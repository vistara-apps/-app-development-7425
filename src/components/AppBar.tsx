import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useGameStore } from '../store/gameStore';
import { Star, Coins } from 'lucide-react';

const AppBar: React.FC = () => {
  const { user, setCurrentView, currentView } = useGameStore();

  return (
    <header className="bg-surface border-b border-primary/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-lg">
            <button 
              onClick={() => setCurrentView('menu')}
              className="flex items-center space-x-2 text-heading cosmic-gradient bg-clip-text text-transparent"
            >
              <Star className="w-8 h-8 text-accent" />
              <span>Cosmic Clash</span>
            </button>
            
            <nav className="hidden md:flex space-x-md">
              <button
                onClick={() => setCurrentView('menu')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentView === 'menu' ? 'bg-primary text-white' : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                Play
              </button>
              <button
                onClick={() => setCurrentView('deckBuilder')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentView === 'deckBuilder' ? 'bg-primary text-white' : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                Deck Builder
              </button>
              <button
                onClick={() => setCurrentView('shop')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentView === 'shop' ? 'bg-primary text-white' : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                Shop
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-lg">
            {user && (
              <div className="flex items-center space-x-2 bg-surface px-4 py-2 rounded-lg border border-accent/20">
                <Coins className="w-5 h-5 text-accent" />
                <span className="text-sm font-semibold">{user.cosmicShardsBalance}</span>
                <span className="text-xs text-textSecondary">Shards</span>
              </div>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppBar;