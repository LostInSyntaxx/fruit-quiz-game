import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

const CountdownTimer = ({ onTimeUp }) => {
  const timeRemaining = useGameStore((state) => state.timeRemaining);
  const setTimeRemaining = useGameStore((state) => state.setTimeRemaining);

  useEffect(() => {
    setTimeRemaining(10);
    
    let currentTime = 10;
    const timer = setInterval(() => {
      currentTime -= 1;
      
      if (currentTime <= 0) {
        clearInterval(timer);
        setTimeRemaining(0);
        onTimeUp?.();
      } else {
        setTimeRemaining(currentTime);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp, setTimeRemaining]);

  const circumference = 2 * Math.PI * 45;
  const progress = (timeRemaining / 10) * circumference;

  return (
    <div className="relative w-24 h-24 md:w-32 md:h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={timeRemaining > 3 ? '#10B981' : '#be1e2d'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </svg>
      
      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={timeRemaining}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-3xl md:text-4xl font-bold ${
            timeRemaining > 3 ? 'text-foreground' : 'text-destructive'
          }`}
        >
          {timeRemaining}
        </motion.span>
      </div>
    </div>
  );
};

export default CountdownTimer;
