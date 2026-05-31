const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class DiscordAuthService {
  // Get Discord auth URL
  async getDiscordAuthUrl(redirect = null) {
    try {
      const params = redirect ? `?redirect=${encodeURIComponent(redirect)}` : '';
      const response = await fetch(`${API_URL}/api/auth/discord${params}`);
      const data = await response.json();
      return data.authUrl;
    } catch (error) {
      console.error('Failed to get Discord auth URL:', error);
      throw error;
    }
  }

  // Redirect to Discord login
  async loginWithDiscord(redirect = null) {
    const authUrl = await this.getDiscordAuthUrl(redirect);
    window.location.href = authUrl;
  }

  // Verify token and get user info
  async verifyToken(token) {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify?token=${token}`);
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  // Logout
  async logout(token) {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  // Get Discord avatar URL
  getAvatarUrl(userId, avatarHash) {
    if (!avatarHash) {
      // Default avatar based on user ID
      const defaultAvatar = BigInt(userId) % 6n;
      return `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png`;
    }
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=128`;
  }

  // Parse URL params for Discord callback
  parseDiscordCallback() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('discord_token');
    const userStr = params.get('discord_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        return { token, user };
      } catch (error) {
        console.error('Failed to parse Discord user data:', error);
        return null;
      }
    }
    
    return null;
  }

  // Clean URL after processing Discord callback
  cleanUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete('discord_token');
    url.searchParams.delete('discord_user');
    url.searchParams.delete('error');
    window.history.replaceState({}, document.title, url.toString());
  }
}

export default new DiscordAuthService();
