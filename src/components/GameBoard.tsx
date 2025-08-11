import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { cardDatabase } from '../data/cards';
import { Heart, Zap, Shield, Target } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import type { BattlefieldCard } from '../types';

const GameBoard: React.FC = () => {
  const { gameState, updateGameState, setCurrentView } = useGameStore();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  useEffect(() => {
    if (!gameState) {
      setCurrentView('menu');
    }
  }, [gameState, setCurrentView]);

  if (!gameState) {
    return (
      <div className="text-center py-lg">
        <p className="text-textSecondary">No active game found.</p>
        <Button onClick={() => setCurrentView('menu')} variant="primary" className="mt-4">
          Return to Menu
        </Button>
      </div>
    );
  }

  const getCardData = (cardId: string) => {
    return cardDatabase.find(card => card.cardId === cardId);
  };

  const playCard = (cardId: string) => {
    const card = getCardData(cardId);
    if (!card) return;

    if (gameState.player.cosmicEnergy < card.cost) {
      alert('Not enough Cosmic Energy!');
      return;
    }

    // Remove card from hand
    const newHand = gameState.player.hand.filter(id => id !== cardId);
    
    // Update energy
    const newEnergy = gameState.player.cosmicEnergy - card.cost;

    // Add to battlefield if it's a unit
    let newBattlefield = [...gameState.player.battlefield];
    if (card.type === 'Unit') {
      newBattlefield.push(cardId);
    }

    // Handle events
    if (card.type === 'Event') {
      handleEventCard(card);
    }

    updateGameState({
      player: {
        ...gameState.player,
        hand: newHand,
        cosmicEnergy: newEnergy,
        battlefield: newBattlefield
      }
    });

    setSelectedCard(null);
  };

  const handleEventCard = (card: any) => {
    switch (card.cardId) {
      case 'event-001': // Solar Flare
        // Deal 3 damage to opponent's starbase
        const newOpponentHealth = Math.max(0, gameState.opponent.starbaseHealth - 3);
        updateGameState({
          opponent: {
            ...gameState.opponent,
            starbaseHealth: newOpponentHealth
          }
        });
        break;
      // Add more event handlers here
    }
  };

  const endTurn = () => {
    if (gameState.currentTurn === 'player') {
      // Player ends turn
      let newPlayerEnergy = Math.min(gameState.player.maxCosmicEnergy + 1, 10);
      let newPlayerMaxEnergy = Math.min(gameState.player.maxCosmicEnergy + 1, 10);
      
      // Draw a card
      let newHand = [...gameState.player.hand];
      let newDeck = [...gameState.player.deck];
      if (newDeck.length > 0) {
        newHand.push(newDeck.shift()!);
      }

      updateGameState({
        currentTurn: 'opponent',
        turnNumber: gameState.turnNumber + 1,
        player: {
          ...gameState.player,
          cosmicEnergy: newPlayerEnergy,
          maxCosmicEnergy: newPlayerMaxEnergy,
          hand: newHand,
          deck: newDeck
        }
      });

      // Simple AI turn
      setTimeout(() => {
        performAITurn();
      }, 1000);
    }
  };

  const performAITurn = () => {
    // Simple AI logic - play the first affordable card
    const aiHand = [...gameState!.opponent.hand];
    const availableEnergy = gameState!.opponent.cosmicEnergy;
    
    for (const cardId of aiHand) {
      const card = getCardData(cardId);
      if (card && card.cost <= availableEnergy) {
        // AI plays the card
        const newAIHand = aiHand.filter(id => id !== cardId);
        const newAIEnergy = availableEnergy - card.cost;
        let newAIBattlefield = [...gameState!.opponent.battlefield];
        
        if (card.type === 'Unit') {
          newAIBattlefield.push(cardId);
        }

        updateGameState({
          opponent: {
            ...gameState!.opponent,
            hand: newAIHand,
            cosmicEnergy: newAIEnergy,
            battlefield: newAIBattlefield
          }
        });
        break;
      }
    }

    // End AI turn
    setTimeout(() => {
      let newAIEnergy = Math.min(gameState!.opponent.maxCosmicEnergy + 1, 10);
      let newAIMaxEnergy = Math.min(gameState!.opponent.maxCosmicEnergy + 1, 10);
      
      // AI draws a card
      let newAIHand = [...gameState!.opponent.hand];
      let newAIDeck = [...gameState!.opponent.deck];
      if (newAIDeck.length > 0) {
        newAIHand.push(newAIDeck.shift()!);
      }

      updateGameState({
        currentTurn: 'player',
        opponent: {
          ...gameState!.opponent,
          cosmicEnergy: newAIEnergy,
          maxCosmicEnergy: newAIMaxEnergy,
          hand: newAIHand,
          deck: newAIDeck
        }
      });
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-lg bg-surface rounded-lg p-md cosmic-border">
        <div className="text-center">
          <p className="text-caption">Turn {gameState.turnNumber}</p>
          <p className="text-heading">
            {gameState.currentTurn === 'player' ? 'Your Turn' : 'Opponent Turn'}
          </p>
        </div>
        
        <div className="flex space-x-lg">
          <Button onClick={() => setCurrentView('menu')} variant="secondary">
            Exit Game
          </Button>
          {gameState.currentTurn === 'player' && (
            <Button onClick={endTurn} variant="primary">
              End Turn
            </Button>
          )}
        </div>
      </div>

      {/* Opponent Area */}
      <div className="mb-lg">
        <div className="bg-surface rounded-lg p-md cosmic-border mb-md">
          <div className="flex items-center justify-between">
            <h3 className="text-heading">Opponent</h3>
            <div className="flex items-center space-x-md">
              <div className="flex items-center space-x-1">
                <Heart className="w-5 h-5 text-red-500" />
                <span>{gameState.opponent.starbaseHealth}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-5 h-5 text-accent" />
                <span>{gameState.opponent.cosmicEnergy}/{gameState.opponent.maxCosmicEnergy}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-caption">Cards: {gameState.opponent.hand.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Opponent Battlefield */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-md mb-md">
          {gameState.opponent.battlefield.map((cardId, index) => {
            const card = getCardData(cardId);
            return card ? (
              <Card key={`${cardId}-${index}`} card={card} variant="default" />
            ) : null;
          })}
          {gameState.opponent.battlefield.length === 0 && (
            <div className="col-span-full text-center py-lg text-textSecondary">
              No units on battlefield
            </div>
          )}
        </div>
      </div>

      {/* Player Battlefield */}
      <div className="mb-lg">
        <h3 className="text-heading mb-md">Your Battlefield</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-md mb-md">
          {gameState.player.battlefield.map((cardId, index) => {
            const card = getCardData(cardId);
            return card ? (
              <Card key={`${cardId}-${index}`} card={card} variant="default" />
            ) : null;
          })}
          {gameState.player.battlefield.length === 0 && (
            <div className="col-span-full text-center py-lg text-textSecondary">
              No units on battlefield
            </div>
          )}
        </div>
      </div>

      {/* Player Area */}
      <div className="bg-surface rounded-lg p-md cosmic-border">
        <div className="flex items-center justify-between mb-md">
          <h3 className="text-heading">Your Hand</h3>
          <div className="flex items-center space-x-md">
            <div className="flex items-center space-x-1">
              <Heart className="w-5 h-5 text-red-500" />
              <span>{gameState.player.starbaseHealth}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-5 h-5 text-accent" />
              <span>{gameState.player.cosmicEnergy}/{gameState.player.maxCosmicEnergy}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-md">
          {gameState.player.hand.map((cardId, index) => {
            const card = getCardData(cardId);
            if (!card) return null;

            const canPlay = gameState.currentTurn === 'player' && 
                          gameState.player.cosmicEnergy >= card.cost;

            return (
              <div
                key={`${cardId}-${index}`}
                className={`relative ${canPlay ? 'cursor-pointer' : 'opacity-50'}`}
                onClick={() => canPlay && playCard(cardId)}
              >
                <Card card={card} variant="default" />
                {!canPlay && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-white font-semibold">
                      Need {card.cost} ⚡
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Over Check */}
      {(gameState.player.starbaseHealth <= 0 || gameState.opponent.starbaseHealth <= 0) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-lg text-center cosmic-border">
            <h2 className="text-heading mb-md">
              {gameState.opponent.starbaseHealth <= 0 ? 'Victory!' : 'Defeat!'}
            </h2>
            <p className="text-textSecondary mb-lg">
              {gameState.opponent.starbaseHealth <= 0 
                ? 'You have destroyed the enemy starbase!' 
                : 'Your starbase has been destroyed...'}
            </p>
            <Button onClick={() => setCurrentView('menu')} variant="primary">
              Return to Menu
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;