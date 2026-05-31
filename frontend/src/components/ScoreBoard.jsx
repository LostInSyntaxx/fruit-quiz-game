import { motion } from 'framer-motion';
import Avatar from './Avatar';

const ScoreBoard = ({ players, currentId }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="text-xl md:text-2xl font-bold mb-4 gradient-text flex items-center gap-2">
        <i className="fas fa-chart-line text-primary"></i>
        Live Scores
      </h3>
      
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              player.id === currentId
                ? 'bg-primary/20 border border-primary/50'
                : 'bg-secondary/50'
            }`}
          >
            <div className="text-2xl font-bold w-8 text-center text-primary">
              {index === 0 ? (
                <i className="fas fa-medal text-yellow-500"></i>
              ) : index === 1 ? (
                <i className="fas fa-medal text-gray-400"></i>
              ) : index === 2 ? (
                <i className="fas fa-medal text-amber-600"></i>
              ) : (
                `#${index + 1}`
              )}
            </div>
            
            <Avatar avatarId={player.avatar} size="sm" />
            
            <div className="flex-1">
              <p className="font-semibold text-sm md:text-base text-foreground">
                {player.name}
                {player.id === currentId && (
                  <span className="ml-2 text-xs text-primary">(You)</span>
                )}
              </p>
            </div>
            
            <motion.div
              key={player.score}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-lg md:text-xl font-bold text-primary"
            >
              {player.score}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBoard;
