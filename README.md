# 🍎 Fruit Quiz - Multiplayer Game

A real-time multiplayer fruit quiz game built with React, Socket.IO, Express, and Tailwind CSS.

## Features

- 👥 **Multiplayer Support**: Up to 4 players per room
- 🏠 **Room System**: Create or join rooms with unique codes
- 🍎 **Fruit Quiz**: Auto-generated questions about fruits
- ⏱️ **Timed Questions**: 10-second countdown timer
- 🏆 **Scoring System**: Faster correct answers earn more points
- 📊 **Live Leaderboard**: Real-time score updates
- 🎨 **Beautiful UI**: Dark mode with glassmorphism design
- 📱 **Responsive**: Works on mobile and desktop
- ✨ **Animations**: Smooth transitions with Framer Motion

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **Zustand** - State management
- **Framer Motion** - Animations
- **React Router** - Routing

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Socket.IO** - WebSocket server
- **Axios** - HTTP client

## Project Structure

```
Game/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Avatar.jsx
│   │   │   ├── CountdownTimer.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── ScoreBoard.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LobbyPage.jsx
│   │   │   ├── GamePage.jsx
│   │   │   └── ResultPage.jsx
│   │   ├── services/      # Services
│   │   │   └── socket.js
│   │   ├── store/         # State management
│   │   │   └── gameStore.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
├── server/                # Express backend
│   ├── utils/
│   │   └── questionGenerator.js
│   ├── index.js
│   └── package.json
└── package.json          # Root package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Game
```

2. Install all dependencies:
```bash
npm run install:all
```

Or install manually:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install server dependencies
cd ../server
npm install
```

### Running the Application

**Development Mode** (Run both frontend and backend):
```bash
npm run dev
```

This will start:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:3001`

**Run Separately:**

Backend only:
```bash
npm run dev:server
```

Frontend only:
```bash
npm run dev:client
```

### Production Build

```bash
npm run build
```

## How to Play

1. **Start the Game**
   - Open `http://localhost:5173` in your browser
   - Enter your name

2. **Create or Join a Room**
   - **Create Room**: Click "Create Room" to start a new game
   - **Join Room**: Click "Join Room" and enter the room code

3. **Share Room Code**
   - Share the 6-character room code with your friends
   - Up to 4 players can join

4. **Start the Game**
   - Host clicks "Start Game" when everyone is ready
   - Minimum 2 players required

5. **Answer Questions**
   - Each question has 4 options
   - You have 10 seconds to answer
   - Faster correct answers = more points
   - Wrong answers = 0 points

6. **View Results**
   - See final rankings after all questions
   - Play again!

## Game Features

### Scoring System
- Base points for correct answer: 100
- Speed bonus: Up to 100 additional points
- Maximum per question: 200 points
- Wrong answer: 0 points

### Question Generation
- Questions are randomly generated from a fruit database
- 5 question types:
  - Fruit color identification
  - Taste description
  - Origin location
  - Category classification
  - Fruit identification

### Real-time Features
- Live player updates in lobby
- Real-time score updates during gameplay
- Instant answer feedback
- Synchronized game state

## UI Design

- **Dark Mode Theme**: Purple/gray gradient background
- **Glassmorphism Cards**: Frosted glass effect with backdrop blur
- **Gradient Text**: Colorful gradient headings
- **Animated Components**: 
  - Circular countdown timer
  - Progress bars
  - Smooth page transitions
  - Button hover effects
- **Responsive Design**: Mobile-first approach

## API Integration

The question generator uses a built-in fruit database with 40+ fruits. You can easily integrate with external fruit APIs by modifying `server/utils/questionGenerator.js`:

```javascript
async function fetchFruitsFromAPI() {
  try {
    const response = await axios.get('https://api.example.com/fruits');
    return response.data;
  } catch (error) {
    return fruitDatabase; // Fallback
  }
}
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_SOCKET_URL=http://localhost:3001
```

## Customization

### Add More Fruits
Edit `server/utils/questionGenerator.js` and add to the `fruitDatabase` array:

```javascript
{
  name: 'New Fruit',
  color: 'Color',
  taste: 'Taste',
  category: 'Category',
  origin: 'Origin'
}
```

### Change Time Limit
Modify the `timeLimit` in `server/index.js`:
```javascript
timeLimit: 15 // Change from 10 to 15 seconds
```

### Adjust Scoring
Edit the scoring formula in `server/index.js`:
```javascript
points = Math.round(100 + (timeRemaining / 10) * 100);
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Support

For support, email support@example.com or open an issue in the repository.
