import { motion } from 'framer-motion';
import discordAuthService from '../services/discordAuth';

const DiscordAvatar = ({ user, size = 'md', className = '' }) => {
  const avatarUrl = user ? discordAuthService.getAvatarUrl(user.id, user.avatar) : null;
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  if (!user) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-secondary flex items-center justify-center ${className}`}>
        <i className="fas fa-user text-muted-foreground"></i>
      </div>
    );
  }

  return (
    <motion.img
      whileHover={{ scale: 1.1 }}
      src={avatarUrl}
      alt={user.displayName || user.username}
      className={`${sizeClasses[size]} rounded-full object-cover border-2 border-primary shadow-lg ${className}`}
    />
  );
};

export default DiscordAvatar;
