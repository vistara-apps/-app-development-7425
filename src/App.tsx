import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useGameStore } from './store/gameStore';
import { useSupabase } from './hooks/useSupabase';
import AppBar from './components/AppBar';
import MainMenu from './components/MainMenu';
import DeckBuilder from './components/DeckBuilder';
import GameBoard from './components/GameBoard';
import Shop from './components/Shop';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { currentView, user, initializeUser } = useGameStore();
  const { initialized } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (initialized) {
        await initializeUser();
        setIsLoading(false);
      }
    };
    init();
  }, [initialized, initializeUser]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'menu':
        return <MainMenu />;
      case 'deckBuilder':
        return <DeckBuilder />;
      case 'game':
        return <GameBoard />;
      case 'shop':
        return <Shop />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <AppBar />
      <main className="container mx-auto px-6 py-lg">
        {renderCurrentView()}
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(230 15% 15%)',
            color: 'hsl(0 0% 98%)',
            border: '1px solid hsl(220 100% 50%)',
          },
        }}
      />
    </div>
  );
}

export default App;