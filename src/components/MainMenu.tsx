import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Play, Settings, Trophy, Star } from 'lucide-react';
import Button from './ui/Button';

const MainMenu: React.FC = () => {
  const { setCurrentView, user } = useGameStore();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <Star className="w-24 h-24 text-accent mx-auto mb-6" />
          <h1 className="text-display cosmic-gradient bg-clip-text text-transparent mb-4">
            Cosmic Clash
          </h1>
          <p className="text-xl text-textSecondary mb-8">
            Forge your cosmic destiny in a space-themed deck-building duel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="cosmic-border rounded-lg p-6 bg-surface">
            <Play className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-heading mb-2">Quick Battle</h3>
            <p className="text-textSecondary mb-4">
              Jump into a quick match against an AI opponent
            </p>
            <Button 
              onClick={() => setCurrentView('game')} 
              variant="primary"
              className="w-full"
            >
              Start Battle
            </Button>
          </div>

          <div className="cosmic-border rounded-lg p-6 bg-surface">
            <Settings className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-heading mb-2">Deck Builder</h3>
            <p className="text-textSecondary mb-4">
              Customize your deck with collected cards
            </p>
            <Button 
              onClick={() => setCurrentView('deckBuilder')} 
              variant="secondary"
              className="w-full"
            >
              Build Deck
            </Button>
          </div>

          <div className="cosmic-border rounded-lg p-6 bg-surface">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-heading mb-2">Card Shop</h3>
            <p className="text-textSecondary mb-4">
              Purchase new cards with Cosmic Shards
            </p>
            <Button 
              onClick={() => setCurrentView('shop')} 
              variant="secondary"
              className="w-full"
            >
              Visit Shop
            </Button>
          </div>
        </div>

        {user && (
          <div className="bg-surface rounded-lg p-6 cosmic-border">
            <h3 className="text-heading mb-4">Welcome back, {user.username}!</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-textSecondary">Cosmic Shards:</span>
                <span className="ml-2 font-semibold text-accent">{user.cosmicShardsBalance}</span>
              </div>
              <div>
                <span className="text-textSecondary">Cards Collected:</span>
                <span className="ml-2 font-semibold text-primary">{user.collectedCardIds.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainMenu;