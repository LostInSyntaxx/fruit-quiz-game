import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';
import CountdownTimer from '../components/CountdownTimer';
import ProgressBar from '../components/ProgressBar';
import ScoreBoard from '../components/ScoreBoard';
import PlayerGrid from '../components/PlayerGrid';
import AnswerDistribution from '../components/AnswerDistribution';
import DiscordPresenceCard from '../components/DiscordPresenceCard';
import discordActivityService from '../services/discordActivity';
import useSoundEffects from '../hooks/useSoundEffects';

const GamePage = () => {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [answeredPlayers, setAnsweredPlayers] = useState(new Set());

  const currentQuestion = useGameStore((state) => state.currentQuestion);
  const currentQuestionIndex = useGameStore((state) => state.currentQuestionIndex);
  const questions = useGameStore((state) => state.questions);
  const players = useGameStore((state) => state.players);
  const playerId = useGameStore((state) => state.playerId);
  const submitAnswer = useGameStore((state) => state.submitAnswer);
  const nextQuestion = useGameStore((state) => state.nextQuestion);
  const gameState = useGameStore((state) => state.gameState);
  const discordUser = useGameStore((state) => state.discordUser);
  const isAuthenticated = useGameStore((state) => state.isAuthenticated);
  const playerScores = useGameStore((state) => state.playerScores);
  const { playCorrect, playWrong, playClick } = useSoundEffects();

  // Check if all players have answered
  const allPlayersAnswered = answeredPlayers.size === players.length;

  // Redirect if game finished
  if (gameState === 'finished') {
    navigate('/result');
    return null;
  }

  // Update Discord activity during game
  useEffect(() => {
    if (isAuthenticated && discordUser && currentQuestion) {
      const userScore = playerScores.find(p => p.id === playerId)?.score || 0;
      discordActivityService.updateGame(
        currentQuestionIndex + 1, 
        questions.length, 
        userScore
      );
    }
  }, [isAuthenticated, discordUser, currentQuestionIndex, questions.length, playerScores, playerId, currentQuestion]);

  const handleTimeUp = useCallback(() => {
    if (!hasAnswered) {
      handleSubmit(-1); // No answer
    }
  }, [hasAnswered]);

  const handleSubmit = (answerIndex) => {
    if (hasAnswered) return;
    
    playClick();
    setHasAnswered(true);
    setSelectedAnswer(answerIndex);
    
    // Track that this player has answered
    setAnsweredPlayers(prev => new Set([...prev, playerId]));
    
    const timeRemaining = useGameStore.getState().timeRemaining;
    submitAnswer(currentQuestionIndex, answerIndex, timeRemaining);
    
    // Play sound after a short delay
    setTimeout(() => {
      const isCorrect = answerIndex === currentQuestion.correctIndex;
      if (isCorrect) {
        playCorrect();
      } else {
        playWrong();
      }
    }, 500);
    
    // Show result briefly
    setTimeout(() => {
      setShowResult(true);
    }, 500);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    setShowResult(false);
    setAnsweredPlayers(new Set());
    nextQuestion();
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl font-bold text-primary">Loading...</div>
      </div>
    );
  }

  const isHost = playerId === players[0]?.id;

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold gradient-text flex items-center gap-3">
              <i className="fas fa-circle-question text-primary"></i>
              Question {currentQuestionIndex + 1}/{questions.length}
            </h1>
            <CountdownTimer onTimeUp={handleTimeUp} />
          </div>
          <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
        </div>

        {/* Player Grid - Kahoot Style */}
        <div className="mb-6">
          <PlayerGrid 
            players={players} 
            currentPlayerId={playerId}
            showAnswers={showResult}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question & Answers */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 md:p-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {currentQuestion.question}
              </h2>
            </motion.div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = currentQuestion.correctIndex === index;
                  const showCorrect = hasAnswered && isCorrect;
                  const showWrong = hasAnswered && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={!hasAnswered ? { scale: 1.02 } : {}}
                      whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                      onClick={() => handleSubmit(index)}
                      disabled={hasAnswered}
                      className={`p-6 rounded-xl font-semibold text-lg transition-all text-left ${
                        showCorrect
                          ? 'bg-green-600/30 border-2 border-green-500 ring-4 ring-green-500/50'
                          : showWrong
                          ? 'bg-destructive/30 border-2 border-destructive'
                          : isSelected
                          ? 'bg-primary/30 border-2 border-primary'
                          : 'glass-button'
                      } ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {showCorrect && <i className="fas fa-check-circle text-2xl text-green-500"></i>}
                        {showWrong && <i className="fas fa-times-circle text-2xl text-destructive"></i>}
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Next Button */}
            {showResult && allPlayersAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl 
                             font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-arrow-right"></i>
                  {currentQuestionIndex + 1 >= questions.length ? 'See Results 🏆' : 'Next Question'}
                </motion.button>
              </motion.div>
            )}
            {showResult && !allPlayersAnswered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center py-4 px-6 bg-secondary/50 rounded-xl border border-border"
              >
                <i className="fas fa-clock text-primary mr-2"></i>
                <span className="text-muted-foreground">
                  Waiting for other players... ({answeredPlayers.size}/{players.length} answered)
                </span>
              </motion.div>
            )}
          </div>

          {/* Scoreboard */}
          <div className="lg:col-span-1 space-y-6">
            <ScoreBoard players={players} currentId={playerId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
