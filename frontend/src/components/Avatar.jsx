import { motion } from 'framer-motion';

const Avatar = ({ avatarId, size = 'md', className = '' }) => {
  const emojis = ['🍎', '🍊', '🍋', '🍇', '🍓', '🥭', '🍑', '🍒'];
  const emoji = emojis[avatarId % emojis.length];
  
  const sizeClasses = {
    sm: 'w-10 h-10 text-2xl',
    md: 'w-14 h-14 text-3xl',
    lg: 'w-20 h-20 text-5xl',
    xl: 'w-24 h-24 text-6xl'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`${sizeClasses[size]} rounded-full bg-primary 
                 flex items-center justify-center shadow-lg ${className}`}
    >
      {emoji}
    </motion.div>
  );
};

export default Avatar;
