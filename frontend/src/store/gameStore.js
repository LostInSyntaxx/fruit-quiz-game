import { create } from 'zustand';
import socketService from '../services/socket';
import discordAuthService from '../services/discordAuth';

const useGameStore = create((set, get) => ({
  // Player info
  playerName: '',
  playerId: null,
  
  // Discord auth
  discordUser: null,
  discordToken: null,
  isAuthenticated: false,
  
  // Room info
  roomCode: null,
  players: [],
  isHost: false,
  
  // Game state
  gameState: 'lobby', // lobby, playing, finished
  questions: [],
  currentQuestionIndex: 0,
  currentQuestion: null,
  timeRemaining: 10,
  
  // Scores
  playerScores: [],
  finalResults: null,
  
  // UI state
  error: null,
  loading: false,
  
  // Actions
  setPlayerName: (name) => set({ playerName: name }),
  
  // Discord login
  loginWithDiscord: async () => {
    await discordAuthService.loginWithDiscord(window.location.href);
  },
  
  handleDiscordCallback: () => {
    const callback = discordAuthService.parseDiscordCallback();
    
    if (callback) {
      set({
        discordUser: callback.user,
        discordToken: callback.token,
        isAuthenticated: true,
        playerName: callback.user.displayName || callback.user.username
      });
      
      discordAuthService.cleanUrl();
      return true;
    }
    
    return false;
  },
  
  logout: async () => {
    const { discordToken } = get();
    if (discordToken) {
      await discordAuthService.logout(discordToken);
    }
    
    set({
      discordUser: null,
      discordToken: null,
      isAuthenticated: false,
      playerName: ''
    });
  },
  
  createRoom: async (playerName) => {
    set({ loading: true, error: null });
    const socket = socketService.getSocket();
    
    return new Promise((resolve, reject) => {
      socket.emit('create_room', { playerName });
      
      socket.on('room_created', ({ roomCode }) => {
        set({
          roomCode,
          isHost: true,
          playerName,
          playerId: socket.id,
          gameState: 'lobby',
          loading: false
        });
        resolve(roomCode);
      });
      
      socket.on('error', ({ message }) => {
        set({ error: message, loading: false });
        reject(new Error(message));
      });
    });
  },
  
  joinRoom: async (roomCode, playerName) => {
    set({ loading: true, error: null });
    const socket = socketService.getSocket();
    
    return new Promise((resolve, reject) => {
      socket.emit('join_room', { roomCode, playerName });
      
      socket.on('update_players', (players) => {
        set({
          roomCode,
          players,
          playerName,
          playerId: socket.id,
          isHost: false,
          gameState: 'lobby',
          loading: false
        });
        resolve(roomCode);
      });
      
      socket.on('error', ({ message }) => {
        set({ error: message, loading: false });
        reject(new Error(message));
      });
    });
  },
  
  startGame: () => {
    const { roomCode } = get();
    const socket = socketService.getSocket();
    socket.emit('start_game', { roomCode });
  },
  
  submitAnswer: (questionIndex, answerIndex, timeRemaining) => {
    const { roomCode } = get();
    const socket = socketService.getSocket();
    socket.emit('submit_answer', {
      roomCode,
      questionIndex,
      answerIndex,
      timeRemaining
    });
  },
  
  nextQuestion: () => {
    const { roomCode } = get();
    const socket = socketService.getSocket();
    socket.emit('next_question', { roomCode });
  },
  
  // Socket event listeners setup
  setupSocketListeners: () => {
    const socket = socketService.getSocket();
    
    socket.on('update_players', (players) => {
      set({ players });
    });
    
    socket.on('game_started', ({ questions, totalQuestions }) => {
      set({
        gameState: 'playing',
        questions,
        currentQuestionIndex: 0,
        currentQuestion: questions[0],
        timeRemaining: 10
      });
    });
    
    socket.on('new_question', ({ questionIndex, question, options, timeLimit }) => {
      set({
        currentQuestionIndex: questionIndex,
        currentQuestion: { question, options },
        timeRemaining: timeLimit
      });
    });
    
    socket.on('answer_result', ({ playerId, correct, points, playerScores, playerAnswers }) => {
      set({ playerScores });
      
      // Update players with answer info
      if (playerAnswers) {
        const state = get();
        const updatedPlayers = state.players.map(p => {
          const answerInfo = playerAnswers.find(a => a.id === p.id);
          return answerInfo ? { ...p, ...answerInfo } : p;
        });
        set({ players: updatedPlayers });
      }
    });
    
    // Listen for all players answered event
    socket.on('all_answered', () => {
      // This event can be used to sync state if needed
      console.log('All players have answered');
    });
    
    socket.on('game_finished', ({ players }) => {
      set({
        gameState: 'finished',
        finalResults: players
      });
    });
    
    socket.on('error', ({ message }) => {
      set({ error: message });
    });
  },
  
  resetGame: () => {
    set({
      roomCode: null,
      players: [],
      isHost: false,
      gameState: 'lobby',
      questions: [],
      currentQuestionIndex: 0,
      currentQuestion: null,
      timeRemaining: 10,
      playerScores: [],
      finalResults: null,
      error: null
    });
  },
  
  setError: (error) => set({ error }),
  
  setTimeRemaining: (time) => set({ timeRemaining: time })
}));

export default useGameStore;
