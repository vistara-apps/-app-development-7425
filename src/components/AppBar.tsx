import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useGameStore } from '../store/gameStore';
import { Star, Coins, Menu, X } from 'lucide-react';
import Tooltip from './ui/Tooltip';

const AppBar: React.FC = () => {
  const { user, setCurrentView, currentView } = useGameStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-surface glass-morphism border-b border-primary/20 sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-6 py-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-lg">
            <button 
              onClick={() => setCurrentView('menu')}
              className="flex items-center space-x-2 text-heading cosmic-gradient bg-clip-text text-transparent hover:scale-105 transition-transform"
            >
              <Star className="w-8 h-8 text-accent animate-pulse-glow" />
              <span>Cosmic Clash</span>
            </button>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-md">
              <Tooltip content="Start a new game">
                <button
                  onClick={() => setCurrentView('menu')}
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    currentView === 'menu' 
                      ? 'bg-primary text-white shadow-cosmic' 
                      : 'text-textSecondary hover:text-textPrimary hover:bg-surface-elevated'
                  }`}
                >
                  Play
                </button>
              </Tooltip>
              <Tooltip content="Build and customize your deck">
                <button
                  onClick={() => setCurrentView('deckBuilder')}
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    currentView === 'deckBuilder' 
                      ? 'bg-primary text-white shadow-cosmic' 
                      : 'text-textSecondary hover:text-textPrimary hover:bg-surface-elevated'
                  }`}
                >
                  Deck Builder
                </button>
              </Tooltip>
              <Tooltip content="Purchase card packs">
                <button
                  onClick={() => setCurrentView('shop')}
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    currentView === 'shop' 
                      ? 'bg-primary text-white shadow-cosmic' 
                      : 'text-textSecondary hover:text-textPrimary hover:bg-surface-elevated'
                  }`}
                >
                  Shop
                </button>
              </Tooltip>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-textSecondary hover:text-textPrimary hover:bg-surface-elevated transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="flex items-center space-x-lg">
            {user && (
              <Tooltip content={`You have ${user.cosmicShardsBalance} Cosmic Shards`}>
                <div className="flex items-center space-x-2 bg-surface-elevated px-4 py-2 rounded-lg border border-accent/20 hover:shadow-cosmic-accent transition-shadow">
                  <Coins className="w-5 h-5 text-accent" />
                  <span className="text-sm font-semibold">{user.cosmicShardsBalance}</span>
                  <span className="text-xs text-textSecondary hidden sm:inline">Shards</span>
                </div>
              </Tooltip>
            )}
            <div className="hidden sm:block">
              <ConnectButton />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-primary/20 animate-slide-in-up">
            <nav className="flex flex-col space-y-2 mt-4">
              <button
                onClick={() => {
                  setCurrentView('menu');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-md text-left transition-all duration-300 ${
                  currentView === 'menu' 
                    ? 'bg-primary text-white shadow-cosmic' 
                    : 'text-textSecondary hover:text-textPrimary hover:bg-surface-elevated'
                }`}
              >
                🎮 Play
              </button>
              <button
                onClick={() => {
                  setCurrentView('deckBuilder');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-md text-left transition-all duration-300 ${
                  currentView === 'deckBuilder' 
                    ? 'bg-primary text-white shadow-cosmic' 
                    : 'text-textSecondary hover:text-textPrimary hover:bg-surface-elevated'
                }`}
              >
                🃏 Deck Builder
              </button>
              <button
                onClick={() => {
                  setCurrentView('shop');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-md text-left transition-all duration-300 ${
                  currentView === 'shop' 
                    ? 'bg-primary text-white shadow-cosmic' 
                    : 'text-textSecondary hover:text-textPrimary hover:bg-surface-elevated'
                }`}
              >
                🛒 Shop
              </button>
              <div className="pt-2 sm:hidden">
                <ConnectButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppBar;
