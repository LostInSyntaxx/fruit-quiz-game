const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { generateQuestions } = require('./utils/questionGenerator');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Mount auth routes
app.use('/api/auth', authRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://frontend-taupe-five-10.vercel.app", "https://fruit-quiz-game.onrender.com"],
    methods: ["GET", "POST"]
  }
});

// Store rooms in memory
const rooms = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new room
  socket.on('create_room', ({ playerName }) => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    rooms[roomCode] = {
      code: roomCode,
      host: socket.id,
      players: [
        {
          id: socket.id,
          name: playerName,
          score: 0,
          avatar: Math.floor(Math.random() * 8)
        }
      ],
      gameState: 'waiting',
      currentQuestion: null,
      questionIndex: 0,
      questions: [],
      answers: {}
    };

    socket.join(roomCode);
    socket.emit('room_created', { roomCode });
    io.to(roomCode).emit('update_players', rooms[roomCode].players);
  });

  // Join an existing room
  socket.on('join_room', ({ roomCode, playerName }) => {
    const room = rooms[roomCode];
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.players.length >= 4) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    if (room.gameState !== 'waiting') {
      socket.emit('error', { message: 'Game already started' });
      return;
    }

    room.players.push({
      id: socket.id,
      name: playerName,
      score: 0,
      avatar: Math.floor(Math.random() * 8)
    });

    socket.join(roomCode);
    io.to(roomCode).emit('update_players', room.players);
  });

  // Start the game
  socket.on('start_game', async ({ roomCode }) => {
    const room = rooms[roomCode];
    
    if (!room || room.host !== socket.id) return;

    room.gameState = 'playing';
    room.questions = await generateQuestions(10);
    room.questionIndex = 0;
    room.answers = {};

    io.to(roomCode).emit('game_started', {
      questions: room.questions,
      totalQuestions: room.questions.length
    });

    // Send first question
    sendQuestion(roomCode);
  });

  // Handle answer submission
  socket.on('submit_answer', ({ roomCode, questionIndex, answerIndex, timeRemaining }) => {
    const room = rooms[roomCode];
    
    if (!room || room.gameState !== 'playing') return;

    const question = room.questions[questionIndex];
    
    // Validate answerIndex
    if (answerIndex < -1 || answerIndex >= question.options.length) {
      return; // Invalid answer
    }
    
    const isCorrect = answerIndex === question.correctIndex;
    
    let points = 0;
    if (isCorrect) {
      // More points for faster answers
      points = Math.round(100 + (timeRemaining / 10) * 100);
    }

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.score += points;
    }

    room.answers[socket.id] = {
      correct: isCorrect,
      points,
      timeRemaining,
      answerIndex: answerIndex
    };

    // Check if all players have answered
    const allAnswered = room.players.every(p => room.answers[p.id]);
    if (allAnswered) {
      io.to(roomCode).emit('all_answered');
    }

    // Send answer info for PlayerGrid display
    const playerAnswers = room.players.map(p => {
      const answer = room.answers[p.id];
      return {
        id: p.id,
        name: p.name,
        score: p.score,
        avatar: p.avatar,
        answerIndex: answer ? answer.answerIndex : null,
        correct: answer ? answer.correct : null,
        answered: answer ? (answer.correct ? 'correct' : 'wrong') : null
      };
    });

    io.to(roomCode).emit('answer_result', {
      playerId: socket.id,
      correct: isCorrect,
      points,
      playerScores: room.players.map(p => ({ id: p.id, name: p.name, score: p.score, avatar: p.avatar })),
      playerAnswers: playerAnswers
    });
  });

  // Next question - Allow any player to trigger after all answered
  socket.on('next_question', ({ roomCode }) => {
    const room = rooms[roomCode];
    
    if (!room) return;
    
    // Check if all players have answered
    const allAnswered = room.players.every(p => room.answers[p.id]);
    if (!allAnswered) {
      socket.emit('error', { message: 'Not all players have answered yet' });
      return;
    }

    room.questionIndex++;
    room.answers = {};

    if (room.questionIndex >= room.questions.length) {
      // Game over
      room.gameState = 'finished';
      const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
      io.to(roomCode).emit('game_finished', {
        players: sortedPlayers
      });
    } else {
      sendQuestion(roomCode);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find and clean up room
    for (const [roomCode, room] of Object.entries(rooms)) {
      room.players = room.players.filter(p => p.id !== socket.id);
      
      if (room.players.length === 0) {
        delete rooms[roomCode];
      } else {
        // Transfer host if needed
        if (room.host === socket.id) {
          room.host = room.players[0].id;
        }
        io.to(roomCode).emit('update_players', room.players);
      }
    }
  });
});

function sendQuestion(roomCode) {
  const room = rooms[roomCode];
  
  if (!room) return;

  const question = room.questions[room.questionIndex];
  
  io.to(roomCode).emit('new_question', {
    questionIndex: room.questionIndex,
    question: question.question,
    options: question.options,
    timeLimit: 10
  });
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
