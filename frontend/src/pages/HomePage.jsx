import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';
import DiscordButton from '../components/DiscordButton';
import DiscordAvatar from '../components/DiscordAvatar';

const HomePage = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState('create'); // 'create' or 'join'
  const [error, setError] = useState('');
  const [showDiscordLogin, setShowDiscordLogin] = useState(true);
  
  const createRoom = useGameStore((state) => state.createRoom);
  const joinRoom = useGameStore((state) => state.joinRoom);
  const loading = useGameStore((state) => state.loading);
  const loginWithDiscord = useGameStore((state) => state.loginWithDiscord);
  const handleDiscordCallback = useGameStore((state) => state.handleDiscordCallback);
  const discordUser = useGameStore((state) => state.discordUser);
  const isAuthenticated = useGameStore((state) => state.isAuthenticated);
  const logout = useGameStore((state) => state.logout);

  // Handle Discord callback on mount
  useEffect(() => {
    const handled = handleDiscordCallback();
    
    // Check for error
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'discord_auth_failed') {
      setError('Discord authentication failed. Please try again.');
    }
    
    if (handled) {
      setShowDiscordLogin(false);
    }
  }, [handleDiscordCallback]);

  const handleLogout = async () => {
    await logout();
    setShowDiscordLogin(true);
    setPlayerName('');
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      setError('');
      await createRoom(playerName.trim());
      navigate('/lobby');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!roomCode.trim()) {
      setError('Please enter room code');
      return;
    }

    try {
      setError('');
      await joinRoom(roomCode.trim().toUpperCase(), playerName.trim());
      navigate('/lobby');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Title */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center mb-8"
        >
          <div className="text-8xl mb-4">
            <i className="fas fa-apple-whole text-primary"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-2 gradient-text">
            Fruit Quiz
          </h1>
          <p className="text-muted-foreground text-lg">Multiplayer Trivia Game</p>
        </motion.div>

        {/* Card */}
        <div className="glass-card p-6 md:p-8">
          {/* Discord Login Section */}
          <AnimatePresence>
            {showDiscordLogin && !isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="text-center mb-4">
                  <p className="text-muted-foreground text-sm mb-3">
                    <i className="fas fa-bolt text-primary mr-1"></i>
                    Quick login with Discord
                  </p>
                </div>
                <DiscordButton onLogin={loginWithDiscord} />
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground">Or continue with name</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Discord User Info */}
          {isAuthenticated && discordUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <DiscordAvatar user={discordUser} size="md" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {discordUser.displayName || discordUser.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Logged in with Discord
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  title="Logout"
                >
                  <i className="fas fa-sign-out-alt text-xl"></i>
                </motion.button>
              </div>
            </motion.div>
          )}
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
            <button
              onClick={() => setMode('create')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                mode === 'create'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <i className="fas fa-plus-circle"></i>
              <span>Create Room</span>
            </button>
            <button
              onClick={() => setMode('join')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                mode === 'join'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <i className="fas fa-right-to-bracket"></i>
              <span>Join Room</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={mode === 'create' ? handleCreateRoom : handleJoinRoom} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder={isAuthenticated ? "Or change your name" : "Enter your name"}
                className="input-field"
                maxLength={20}
                defaultValue={isAuthenticated ? (discordUser?.displayName || discordUser?.username) : ''}
              />
            </div>

            {mode === 'join' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter room code"
                  className="input-field"
                  maxLength={6}
                />
              </motion.div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-destructive text-sm flex items-center gap-2"
              >
                <i className="fas fa-circle-exclamation"></i>
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl 
                         font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 
                         disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i>
                  Loading...
                </span>
              ) : mode === 'create' ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-plus-circle"></i>
                  Create Room
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-right-to-bracket"></i>
                  Join Room
                </span>
              )}
            </motion.button>
          </form>

          {/* Features */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-1 text-primary">
                  <i className="fas fa-users"></i>
                </div>
                <p className="text-xs text-muted-foreground">4 Players</p>
              </div>
              <div>
                <div className="text-2xl mb-1 text-primary">
                  <i className="fas fa-apple-whole"></i>
                </div>
                <p className="text-xs text-muted-foreground">Fruit Quiz</p>
              </div>
              <div>
                <div className="text-2xl mb-1 text-primary">
                  <i className="fas fa-bolt"></i>
                </div>
                <p className="text-xs text-muted-foreground">Real-time</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
