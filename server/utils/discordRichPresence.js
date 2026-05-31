const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const crypto = require('crypto');

class DiscordRichPresence {
  constructor() {
    this.client = null;
    this.userActivities = new Map();
    this.isConnected = false;
  }

  // Initialize Discord bot client
  async initialize(botToken) {
    if (!botToken) {
      console.warn('Discord bot token not provided. Rich Presence disabled.');
      return false;
    }

    try {
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildPresences
        ]
      });

      this.client.once('ready', () => {
        console.log(`Discord Rich Presence bot logged in as ${this.client.user.tag}`);
        this.isConnected = true;
      });

      this.client.on('error', (error) => {
        console.error('Discord bot error:', error);
        this.isConnected = false;
      });

      await this.client.login(botToken);
      return true;
    } catch (error) {
      console.error('Failed to initialize Discord Rich Presence:', error);
      return false;
    }
  }

  // Set activity for a user
  async setActivity(userId, activityData) {
    if (!this.isConnected || !this.client) {
      console.warn('Discord bot not connected');
      return false;
    }

    try {
      const { 
        state, 
        details, 
        startTime, 
        largeImage, 
        largeText, 
        smallImage, 
        smallText 
      } = activityData;

      // Store activity data
      this.userActivities.set(userId, {
        state,
        details,
        startTime: startTime || Date.now(),
        largeImage,
        largeText,
        smallImage,
        smallText
      });

      // Note: Discord.js doesn't allow setting custom presence for other users directly
      // This is handled through the OAuth2 scope 'activities.write' and Activity API
      // For now, we store the data and can use it with Discord's Activity SDK
      
      console.log(`Activity set for user ${userId}: ${details}`);
      return true;
    } catch (error) {
      console.error('Failed to set activity:', error);
      return false;
    }
  }

  // Clear activity for a user
  clearActivity(userId) {
    this.userActivities.delete(userId);
    console.log(`Activity cleared for user ${userId}`);
  }

  // Get activity for a user
  getActivity(userId) {
    return this.userActivities.get(userId);
  }

  // Shutdown bot
  async shutdown() {
    if (this.client) {
      await this.client.destroy();
      this.isConnected = false;
      console.log('Discord Rich Presence bot shut down');
    }
  }
}

module.exports = new DiscordRichPresence();
