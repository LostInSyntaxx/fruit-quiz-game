import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import useGameStore from './store/gameStore';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import ResultPage from './pages/ResultPage';

function App() {
  const setupSocketListeners = useGameStore((state) => state.setupSocketListeners);

  useEffect(() => {
    setupSocketListeners();
  }, [setupSocketListeners]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </div>
  );
}

export default App;
