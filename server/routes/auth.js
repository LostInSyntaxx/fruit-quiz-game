const express = require('express');
const crypto = require('crypto');

const router = express.Router();

// Discord OAuth2 configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || 'your_client_id';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || 'your_client_secret';
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'http://localhost:3001/api/auth/discord/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Store temporary user data during OAuth flow
const oauthSessions = new Map();

// Generate random state for CSRF protection
function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

// Step 1: Redirect to Discord OAuth
router.get('/discord', (req, res) => {
  const state = generateState();
  
  // Store state temporarily (expires in 10 minutes)
  oauthSessions.set(state, { 
    timestamp: Date.now(),
    frontendRedirect: req.query.redirect || `${FRONTEND_URL}/lobby`
  });

  // Clean up old sessions
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [key, value] of oauthSessions.entries()) {
    if (value.timestamp < tenMinutesAgo) {
      oauthSessions.delete(key);
    }
  }

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?` +
    `client_id=${DISCORD_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=identify%20email` +
    `&state=${state}`;

  res.json({ authUrl: discordAuthUrl });
});

// Step 2: Handle Discord callback
router.get('/discord/callback', async (req, res) => {
  const { code, state } = req.query;

  // Verify state
  const session = oauthSessions.get(state);
  if (!session) {
    return res.status(400).json({ error: 'Invalid or expired session' });
  }

  oauthSessions.delete(state);

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get token from Discord');
    }

    const tokenData = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info from Discord');
    }

    const discordUser = await userResponse.json();

    // Create user object
    const user = {
      id: discordUser.id,
      username: discordUser.username,
      displayName: discordUser.global_name || discordUser.username,
      avatar: discordUser.avatar,
      email: discordUser.email,
      discriminator: discordUser.discriminator,
    };

    // Generate a simple token (in production, use JWT)
    const authToken = crypto.randomBytes(32).toString('hex');

    // Store user session (in production, use database)
    oauthSessions.set(authToken, {
      user,
      timestamp: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    // Redirect to frontend with token
    const redirectUrl = `${session.frontendRedirect}?discord_token=${authToken}&discord_user=${encodeURIComponent(JSON.stringify(user))}`;
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Discord OAuth error:', error);
    res.redirect(`${FRONTEND_URL}/?error=discord_auth_failed`);
  }
});

// Step 3: Verify token and get user info
router.get('/verify', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }

  const session = oauthSessions.get(token);
  
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Check if token expired
  if (session.expiresAt && Date.now() > session.expiresAt) {
    oauthSessions.delete(token);
    return res.status(401).json({ error: 'Token expired' });
  }

  res.json({ user: session.user });
});

// Logout
router.post('/logout', (req, res) => {
  const { token } = req.body;
  
  if (token) {
    oauthSessions.delete(token);
  }

  res.json({ success: true });
});

module.exports = router;
