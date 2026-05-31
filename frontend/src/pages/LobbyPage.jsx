import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import Avatar from '../components/Avatar';
import DiscordPresenceCard from '../components/DiscordPresenceCard';
import discordActivityService from '../services/discordActivity';

const LobbyPage = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const roomCode = useGameStore((state) => state.roomCode);
  const players = useGameStore((state) => state.players);
  const isHost = useGameStore((state) => state.isHost);
  const startGame = useGameStore((state) => state.startGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const gameState = useGameStore((state) => state.gameState);
  const discordUser = useGameStore((state) => state.discordUser);
  const isAuthenticated = useGameStore((state) => state.isAuthenticated);

  // Redirect if game started
  useEffect(() => {
    if (gameState === 'playing') {
      navigate('/game');
    }
  }, [gameState, navigate]);

  // Update Discord activity
  useEffect(() => {
    if (isAuthenticated && discordUser && roomCode) {
      discordActivityService.waitingInLobby(roomCode, players.length);
    }
  }, [isAuthenticated, discordUser, roomCode, players.length]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    if (players.length < 2) {
      alert('Need at least 2 players to start!');
      return;
    }
    startGame();
  };

  const handleLeave = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-text">
            <i className="fas fa-door-open mr-3"></i>Game Lobby
          </h1>
          <p className="text-muted-foreground">Waiting for players to join...</p>
        </div>

        {/* Room Code */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            <i className="fas fa-key mr-2 text-primary"></i>Room Code
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="bg-primary px-8 py-4 rounded-xl">
              <span className="text-4xl font-bold tracking-wider text-primary-foreground">{roomCode}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyCode}
              className="glass-button px-6 py-4"
            >
              {copied ? (
                <span className="flex items-center gap-2">
                  <i className="fas fa-check text-green-500"></i>
                  Copied!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <i className="fas fa-copy"></i>
                  Copy
                </span>
              )}
            </motion.button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            <i className="fas fa-share-nodes mr-1"></i>
            Share this code with your friends
          </p>
        </div>

        {/* Players */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            <i className="fas fa-users mr-2 text-primary"></i>
            Players ({players.length}/4)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
              >
                <Avatar avatarId={player.avatar} size="md" />
                <div className="flex-1">
                  <p className="font-semibold text-lg text-foreground">{player.name}</p>
                  {player.id === players[0]?.id && (
                    <span className="text-xs text-yellow-400">
                      <i className="fas fa-crown mr-1"></i>Host
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: 4 - players.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border-2 border-dashed border-white/10"
              >
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-3xl text-muted-foreground">?</span>
                </div>
                <p className="text-muted-foreground font-semibold">Waiting...</p>
              </div>
            ))}
          </div>
        </div>

        {/* Discord Status Card */}
        {isAuthenticated && discordUser && (
          <DiscordPresenceCard 
            userData={discordUser} 
            gameData={{ 
              roomCode, 
              playerCount: players.length 
            }} 
            type="lobby" 
          />
        )}

        {/* Actions */}
        <div className="flex gap-4">
          {isHost ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartGame}
              disabled={players.length < 2}
              className="flex-1 py-4 bg-green-600 text-primary-foreground rounded-xl 
                         font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 
                         disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {players.length < 2 ? (
                <span className="flex items-center gap-2">
                  <i className="fas fa-hourglass-half"></i>
                  Waiting for Players...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <i className="fas fa-rocket"></i>
                  Start Game
                </span>
              )}
            </motion.button>
          ) : (
            <div className="flex-1 py-4 bg-secondary rounded-xl font-semibold text-center text-foreground">
              Waiting for host to start...
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLeave}
            className="glass-button px-8 py-4 font-semibold flex items-center gap-2"
          >
            <i className="fas fa-arrow-right-from-bracket"></i>
            Leave
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LobbyPage;
