import { motion } from 'framer-motion';

const AnswerDistribution = ({ options, correctIndex, totalPlayers, answerCounts }) => {
  const maxCount = Math.max(...Object.values(answerCounts || {}), 0);

  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="text-xl md:text-2xl font-bold mb-4 gradient-text flex items-center gap-2">
        <i className="fas fa-chart-bar text-primary"></i>
        Answer Distribution
      </h3>
      
      <div className="space-y-3">
        {options.map((option, index) => {
          const count = answerCounts?.[index] || 0;
          const percentage = totalPlayers > 0 ? (count / totalPlayers) * 100 : 0;
          const isCorrect = index === correctIndex;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Background Bar */}
              <div className="w-full h-12 rounded-lg overflow-hidden bg-secondary/50 relative">
                {/* Fill Bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full ${
                    isCorrect 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-primary/40'
                  }`}
                />
                
                {/* Label */}
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <span className="font-bold text-sm md:text-base text-foreground flex items-center gap-2">
                    <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                      isCorrect ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="truncate">{option}</span>
                  </span>
                  
                  {count > 0 && (
                    <span className="font-bold text-primary">
                      {count} {count === 1 ? 'player' : 'players'} ({Math.round(percentage)}%)
                    </span>
                  )}
                </div>
              </div>
              
              {/* Correct Indicator */}
              {isCorrect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -right-2 -top-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <i className="fas fa-check text-white text-xs"></i>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">
              {Object.values(answerCounts || {}).reduce((sum, count) => sum + count, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Answers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">
              {totalPlayers - Object.values(answerCounts || {}).reduce((sum, count) => sum + count, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Didn't Answer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerDistribution;
