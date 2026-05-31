import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import Avatar from '../components/Avatar';
import PodiumCeremony from '../components/PodiumCeremony';
import DiscordPresenceCard from '../components/DiscordPresenceCard';
import discordActivityService from '../services/discordActivity';
import useSoundEffects from '../hooks/useSoundEffects';

const ResultPage = () => {
  const navigate = useNavigate();
  const finalResults = useGameStore((state) => state.finalResults);
  const playerName = useGameStore((state) => state.playerName);
  const resetGame = useGameStore((state) => state.resetGame);
  const discordUser = useGameStore((state) => state.discordUser);
  const isAuthenticated = useGameStore((state) => state.isAuthenticated);
  const { playVictory } = useSoundEffects();

  if (!finalResults) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl font-bold text-primary">Loading results...</div>
      </div>
    );
  }

  const userRank = finalResults.findIndex(p => p.name === playerName) + 1;

  // Play victory sound if winner
  useEffect(() => {
    if (isWinner) {
      setTimeout(() => playVictory(), 500);
    }
  }, [isWinner, playVictory]);

  // Update Discord activity with final result
  useEffect(() => {
    if (isAuthenticated && discordUser && finalResults.length > 0) {
      discordActivityService.finishGame(userRank, finalResults.length);
    }
  }, [isAuthenticated, discordUser, finalResults, userRank]);

  const handlePlayAgain = () => {
    resetGame();
    navigate('/');
  };

  const winner = finalResults[0];
  const isWinner = winner?.name === playerName;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl"
      >
        {/* Winner Announcement */}
        {isWinner && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="text-center mb-8"
          >
            <div className="text-9xl mb-4 text-yellow-500">
              <i className="fas fa-trophy"></i>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-2 gradient-text">
              You Won!
            </h1>
            <p className="text-xl text-muted-foreground">Congratulations!</p>
          </motion.div>
        )}

        {!isWinner && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="text-center mb-8"
          >
            <div className="text-8xl mb-4 text-primary">
              <i className="fas fa-flag-checkered"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-text">
              Game Over!
            </h1>
          </motion.div>
        )}

        {/* Podium Ceremony - Kahoot Style */}
        <PodiumCeremony 
          top3Players={finalResults.slice(0, 3)} 
          currentPlayerName={playerName}
        />

        {/* Leaderboard */}
        <div className="glass-card p-6 md:p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center gradient-text flex items-center justify-center gap-3">
            <i className="fas fa-ranking-star text-primary"></i>
            Final Rankings
          </h2>
          
          <div className="space-y-4">
            {finalResults.map((player, index) => {
              const medals = ['🥇', '🥈', '🥉'];
              const isCurrentPlayer = player.name === playerName;

              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 + 0.5 }}
                  className={`flex items-center gap-4 p-4 md:p-6 rounded-xl transition-all ${
                    index === 0
                      ? 'bg-yellow-500/20 border-2 border-yellow-400/50'
                      : isCurrentPlayer
                      ? 'bg-primary/20 border border-primary/50'
                      : 'bg-secondary/50'
                  }`}
                >
                  {/* Rank */}
                  <div className="text-4xl md:text-5xl w-16 text-center">
                    {medals[index] || `#${index + 1}`}
                  </div>

                  {/* Avatar */}
                  <Avatar avatarId={player.avatar} size="lg" />

                  {/* Player Info */}
                  <div className="flex-1">
                    <p className="text-xl md:text-2xl font-bold">
                      {player.name}
                      {isCurrentPlayer && (
                        <span className="ml-2 text-sm text-primary">(You)</span>
                      )}
                    </p>
                    {index === 0 && (
                      <p className="text-sm text-yellow-400">
                        <i className="fas fa-crown mr-1"></i>Winner!
                      </p>
                    )}
                  </div>

                  {/* Score */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.15 + 0.8, type: 'spring' }}
                    className="text-right"
                  >
                    <p className="text-3xl md:text-4xl font-bold text-primary">
                      {player.score}
                    </p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
            <i className="fas fa-chart-pie text-primary"></i>
            Game Summary
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold gradient-text">{finalResults.length}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <i className="fas fa-users text-xs"></i>
                Players
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold gradient-text">
                {finalResults.reduce((sum, p) => sum + p.score, 0)}
              </p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <i className="fas fa-star text-xs"></i>
                Total Points
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold gradient-text">{winner?.score}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <i className="fas fa-trophy text-xs"></i>
                Highest Score
              </p>
            </div>
          </div>
        </div>

        {/* Discord Status Card */}
        {isAuthenticated && discordUser && (
          <DiscordPresenceCard 
            userData={discordUser} 
            gameData={{ 
              rank: userRank,
              totalPlayers: finalResults.length
            }} 
            type="finished" 
          />
        )}

        {/* Actions */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePlayAgain}
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl 
                     font-bold text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-gamepad"></i>
          Play Again
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ResultPage;
