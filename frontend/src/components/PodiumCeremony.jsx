import { motion } from 'framer-motion';
import Avatar from './Avatar';
import DiscordAvatar from './DiscordAvatar';

const PodiumCeremony = ({ top3Players, currentPlayerName }) => {
  const [first, second, third] = top3Players;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-6 md:p-8"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center gradient-text flex items-center justify-center gap-3">
        <i className="fas fa-trophy text-yellow-400"></i>
        Podium Ceremony
      </h2>

      {/* Podium */}
      <div className="flex items-end justify-center gap-2 md:gap-4 mb-8">
        {/* 2nd Place */}
        {second && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-3">
              <div className="text-4xl mb-2">🥈</div>
              {second.discordUser ? (
                <DiscordAvatar user={second.discordUser} size="md" />
              ) : (
                <Avatar avatarId={second.avatar} size="md" />
              )}
              {second.name === currentPlayerName && (
                <div className="absolute -top-2 -right-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  You
                </div>
              )}
            </div>
            <p className="font-bold text-sm md:text-base text-center mb-2">{second.name}</p>
            <div className="w-24 md:w-32 h-24 md:h-32 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-lg flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-bold text-white">2</span>
            </div>
          </motion.div>
        )}

        {/* 1st Place */}
        {first && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-3">
              <div className="text-5xl mb-2 animate-bounce">🥇</div>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <i className="fas fa-crown text-yellow-400 text-2xl animate-pulse"></i>
              </div>
              {first.discordUser ? (
                <DiscordAvatar user={first.discordUser} size="lg" />
              ) : (
                <Avatar avatarId={first.avatar} size="lg" />
              )}
              {first.name === currentPlayerName && (
                <div className="absolute -top-2 -right-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  You
                </div>
              )}
            </div>
            <p className="font-bold text-base md:text-lg text-center mb-2 text-yellow-400">{first.name}</p>
            <div className="w-28 md:w-40 h-32 md:h-48 bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-lg flex items-center justify-center relative">
              <span className="text-5xl md:text-6xl font-bold text-white">1</span>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-2 right-2"
              >
                ✨
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* 3rd Place */}
        {third && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-3">
              <div className="text-4xl mb-2">🥉</div>
              {third.discordUser ? (
                <DiscordAvatar user={third.discordUser} size="md" />
              ) : (
                <Avatar avatarId={third.avatar} size="md" />
              )}
              {third.name === currentPlayerName && (
                <div className="absolute -top-2 -right-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  You
                </div>
              )}
            </div>
            <p className="font-bold text-sm md:text-base text-center mb-2">{third.name}</p>
            <div className="w-24 md:w-32 h-16 md:h-24 bg-gradient-to-t from-amber-700 to-amber-500 rounded-t-lg flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-bold text-white">3</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Confetti Effect */}
      <div className="relative h-20 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: -20, 
              x: Math.random() * 400 - 200,
              rotate: 0,
              opacity: 1
            }}
            animate={{ 
              y: 100, 
              x: Math.random() * 400 - 200 + (Math.random() * 100 - 50),
              rotate: Math.random() * 360,
              opacity: 0
            }}
            transition={{ 
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute top-0 text-2xl"
          >
            {['🎉', '', '✨', '🌟', '⭐'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PodiumCeremony;
