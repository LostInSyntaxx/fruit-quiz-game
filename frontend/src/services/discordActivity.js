import discordAuthService from './discordAuth';

class DiscordActivityService {
  constructor() {
    this.activityStartTime = null;
  }

  // Set Discord activity (Game Presence)
  // This uses Discord's embedded activity SDK
  // Note: This only works when app is embedded in Discord
  setActivity(activityData) {
    try {
      // For web apps, we'll create a shareable activity card
      const activity = {
        type: 'PLAYING',
        name: 'Fruit Quiz',
        details: activityData.details || 'Playing a quiz game',
        state: activityData.state || 'In Game',
        timestamps: {
          start: this.activityStartTime || Date.now()
        },
        assets: {
          large_image: activityData.largeImage || 'fruit_quiz_logo',
          large_text: activityData.largeText || 'Fruit Quiz - Multiplayer Game',
          small_image: activityData.smallImage,
          small_text: activityData.smallText
        },
        party: activityData.party || null,
        secrets: activityData.secrets || null
      };

      // Store locally for display purposes
      localStorage.setItem('discord_activity', JSON.stringify(activity));
      
      console.log('Activity data prepared:', activity);
      return activity;
    } catch (error) {
      console.error('Failed to set Discord activity:', error);
      return null;
    }
  }

  // Clear activity
  clearActivity() {
    localStorage.removeItem('discord_activity');
    this.activityStartTime = null;
  }

  // Start game activity
  startGame(roomCode, playerCount) {
    this.activityStartTime = Date.now();
    
    return this.setActivity({
      details: `Room: ${roomCode}`,
      state: `${playerCount}/4 Players`,
      largeText: 'Fruit Quiz - Multiplayer Trivia',
      party: {
        id: roomCode,
        size: [playerCount, 4]
      }
    });
  }

  // Update game progress
  updateGame(questionNumber, totalQuestions, score) {
    return this.setActivity({
      details: `Question ${questionNumber}/${totalQuestions}`,
      state: `Score: ${score} points`,
      largeText: 'Answering questions...'
    });
  }

  // Game finished
  finishGame(finalRank, totalPlayers) {
    const ordinal = this.getOrdinal(finalRank);
    
    return this.setActivity({
      details: 'Game Finished!',
      state: `Ranked #${finalRank} ${ordinal}`,
      largeText: `Out of ${totalPlayers} players`
    });
  }

  // Lobby waiting
  waitingInLobby(roomCode, playerCount) {
    return this.setActivity({
      details: `Room: ${roomCode}`,
      state: `Waiting for players (${playerCount}/4)`,
      largeText: 'Preparing to start...'
    });
  }

  // Get ordinal suffix (1st, 2nd, 3rd, etc.)
  getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

  // Generate a Discord shareable image/card
  generateActivityCard(userData, gameData) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 600;
    canvas.height = 200;

    // Background
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, 600, 200);

    // Border
    ctx.strokeStyle = '#0078f2';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 596, 196);

    // Title
    ctx.fillStyle = '#0078f2';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('🍎 Fruit Quiz', 20, 50);

    // User info
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '20px Arial';
    ctx.fillText(`Player: ${userData.displayName || userData.username}`, 20, 90);

    // Game info
    ctx.fillStyle = '#a0a0a0';
    ctx.font = '18px Arial';
    if (gameData.roomCode) {
      ctx.fillText(`Room: ${gameData.roomCode}`, 20, 125);
    }
    if (gameData.score !== undefined) {
      ctx.fillText(`Score: ${gameData.score} points`, 20, 155);
    }
    if (gameData.rank) {
      ctx.fillText(`Rank: #${gameData.rank}`, 20, 155);
    }

    // Discord logo area (right side)
    ctx.fillStyle = '#5865F2';
    ctx.beginPath();
    ctx.arc(520, 100, 60, 0, Math.PI * 2);
    ctx.fill();

    // Convert to image
    return canvas.toDataURL('image/png');
  }

  // Share activity to Discord (creates an image to share)
  async shareToDiscord(userData, gameData) {
    try {
      const activityCard = this.generateActivityCard(userData, gameData);
      
      // Create a downloadable image
      const link = document.createElement('a');
      link.download = 'fruit-quiz-activity.png';
      link.href = activityCard;
      link.click();

      return activityCard;
    } catch (error) {
      console.error('Failed to generate activity card:', error);
      return null;
    }
  }
}

export default new DiscordActivityService();
