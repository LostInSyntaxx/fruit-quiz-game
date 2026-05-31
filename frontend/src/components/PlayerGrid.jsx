import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';

const PlayerGrid = ({ players, currentPlayerId, showAnswers = false }) => {
  // Sort players by score (descending)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="text-xl md:text-2xl font-bold mb-4 gradient-text flex items-center gap-2">
        <i className="fas fa-users text-primary"></i>
        Players ({players.length}/4)
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <AnimatePresence>
          {sortedPlayers.map((player, index) => {
            const isCurrentPlayer = player.id === currentPlayerId;
            const rank = index + 1;
            
            return (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                className={`relative p-3 md:p-4 rounded-xl border-2 transition-all ${
                  isCurrentPlayer
                    ? 'border-primary bg-primary/10'
                    : rank === 1
                    ? 'border-yellow-400 bg-yellow-400/10'
                    : rank === 2
                    ? 'border-gray-400 bg-gray-400/10'
                    : rank === 3
                    ? 'border-amber-600 bg-amber-600/10'
                    : 'border-border bg-secondary/30'
                }`}
              >
                {/* Rank Badge */}
                {rank <= 3 && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                  </div>
                )}
                
                {/* Avatar */}
                <div className="flex flex-col items-center gap-2">
                  <Avatar 
                    avatarId={player.avatar} 
                    size={isCurrentPlayer ? 'lg' : 'md'} 
                    className={isCurrentPlayer ? 'ring-4 ring-primary ring-offset-2 ring-offset-background' : ''}
                  />
                  
                  {/* Player Name */}
                  <div className="text-center w-full">
                    <p className={`font-bold text-sm md:text-base truncate ${
                      isCurrentPlayer ? 'text-primary' : 'text-foreground'
                    }`}>
                      {player.name}
                      {isCurrentPlayer && (
                        <span className="block text-xs text-primary mt-1">
                          <i className="fas fa-user mr-1"></i>You
                        </span>
                      )}
                    </p>
                    
                    {/* Score */}
                    <motion.p 
                      key={player.score}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      className="text-lg md:text-xl font-bold text-primary mt-1"
                    >
                      {player.score}
                    </motion.p>
                    
                    {/* Answer Status (if showing) */}
                    {showAnswers && player.answered !== undefined && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`mt-2 px-2 py-1 rounded-full text-xs font-bold ${
                          player.answered === 'correct'
                            ? 'bg-green-500/20 text-green-400'
                            : player.answered === 'wrong'
                            ? 'bg-destructive/20 text-destructive'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {player.answered === 'correct' ? (
                          <><i className="fas fa-check mr-1"></i>Correct</>
                        ) : player.answered === 'wrong' ? (
                          <><i className="fas fa-times mr-1"></i>Wrong</>
                        ) : (
                          <><i className="fas fa-clock mr-1"></i>Waiting</>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlayerGrid;
