import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { cardDatabase } from '../data/cards';
import { Plus, Minus, Save, Play, Package, Sparkles } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import EmptyState from './ui/EmptyState';
import { CardSkeleton } from './ui/Skeleton';
import Tooltip from './ui/Tooltip';
import type { Card as CardType, Deck } from '../types';

const DeckBuilder: React.FC = () => {
  const { user, saveDeck, loadUserDecks, setCurrentView, startGame } = useGameStore();
  const [currentDeck, setCurrentDeck] = useState<string[]>([]);
  const [deckName, setDeckName] = useState('My Deck');
  const [savedDecks, setSavedDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDecks = async () => {
      setIsLoading(true);
      try {
        const decks = await loadUserDecks();
        setSavedDecks(decks);
      } catch (error) {
        console.error('Failed to load decks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDecks();
  }, [loadUserDecks]);

  if (!user) {
    return (
      <div className="text-center py-lg">
        <p className="text-textSecondary">Please wait while we load your collection...</p>
      </div>
    );
  }

  const collectedCards = cardDatabase.filter(card => 
    user.collectedCardIds.includes(card.cardId)
  );

  const getCardCount = (cardId: string) => {
    return currentDeck.filter(id => id === cardId).length;
  };

  const addCardToDeck = (cardId: string) => {
    if (currentDeck.length >= 40) return; // Max deck size
    if (getCardCount(cardId) >= 3) return; // Max 3 copies of any card
    setCurrentDeck([...currentDeck, cardId]);
  };

  const removeCardFromDeck = (cardId: string) => {
    const index = currentDeck.indexOf(cardId);
    if (index > -1) {
      const newDeck = [...currentDeck];
      newDeck.splice(index, 1);
      setCurrentDeck(newDeck);
    }
  };

  const handleSaveDeck = async () => {
    if (currentDeck.length < 20) {
      alert('Deck must contain at least 20 cards');
      return;
    }

    await saveDeck({
      userId: user.userId,
      name: deckName,
      cardIdsInDeck: currentDeck
    });

    const decks = await loadUserDecks();
    setSavedDecks(decks);
    alert('Deck saved successfully!');
  };

  const loadDeck = (deck: Deck) => {
    setCurrentDeck(deck.cardIdsInDeck);
    setDeckName(deck.name);
  };

  const handlePlayWithDeck = () => {
    if (currentDeck.length < 20) {
      alert('Deck must contain at least 20 cards');
      return;
    }

    const deck: Deck = {
      deckId: 'temp-deck',
      userId: user.userId,
      name: deckName,
      cardIdsInDeck: currentDeck
    };

    startGame(deck);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Card Collection */}
        <div className="lg:col-span-2">
          <h2 className="text-heading mb-md flex items-center">
            <Package className="w-6 h-6 mr-2 text-primary" />
            Your Collection
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : collectedCards.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No Cards Yet"
              description="Visit the shop to purchase card packs and start building your collection!"
              actionLabel="Visit Shop"
              onAction={() => setCurrentView('shop')}
              className="lg:col-span-2"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {collectedCards.map((card) => (
                <div key={card.cardId} className="relative">
                  <Card card={card} variant="default" />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Tooltip content={
                      currentDeck.length >= 40 
                        ? "Deck is full (40 cards max)" 
                        : getCardCount(card.cardId) >= 3 
                          ? "Maximum 3 copies per card" 
                          : "Add to deck"
                    }>
                      <Button
                        onClick={() => addCardToDeck(card.cardId)}
                        variant="icon"
                        size="sm"
                        disabled={currentDeck.length >= 40 || getCardCount(card.cardId) >= 3}
                        className="bg-success hover:bg-success/80 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                    {getCardCount(card.cardId) > 0 && (
                      <Tooltip content="Remove from deck">
                        <Button
                          onClick={() => removeCardFromDeck(card.cardId)}
                          variant="icon"
                          size="sm"
                          className="bg-error hover:bg-error/80 shadow-sm"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                  {getCardCount(card.cardId) > 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-cosmic animate-pulse-glow">
                      {getCardCount(card.cardId)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deck Builder */}
        <div className="bg-surface-elevated rounded-lg p-lg cosmic-border-subtle shadow-card">
          <h3 className="text-heading mb-md flex items-center">
            <Save className="w-5 h-5 mr-2 text-accent" />
            Current Deck
          </h3>
          
          <div className="mb-md">
            <Input
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Deck Name"
              className="mb-2"
            />
            <div className="flex justify-between items-center">
              <p className="text-caption">
                Cards: <span className={`font-semibold ${currentDeck.length >= 20 ? 'text-success' : 'text-warning'}`}>
                  {currentDeck.length}
                </span>/40 (Min: 20)
              </p>
              <div className="w-24 bg-surface rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentDeck.length >= 20 ? 'bg-success' : 'bg-warning'
                  }`}
                  style={{ width: `${Math.min((currentDeck.length / 40) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-md max-h-64 overflow-y-auto">
            {currentDeck.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-textSecondary mx-auto mb-2 animate-float" />
                <p className="text-textSecondary">
                  Add cards to your deck
                </p>
                <p className="text-xs text-textSecondary mt-1">
                  Click the + button on cards to add them
                </p>
              </div>
            ) : (
              Object.entries(
                currentDeck.reduce((acc, cardId) => {
                  acc[cardId] = (acc[cardId] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([cardId, count]) => {
                const card = cardDatabase.find(c => c.cardId === cardId);
                if (!card) return null;
                
                return (
                  <div key={cardId} className="flex items-center justify-between bg-surface rounded-md p-3 hover:bg-surface-elevated transition-colors">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{card.name}</span>
                      <span className="text-xs text-textSecondary bg-accent/20 px-2 py-1 rounded">
                        {card.cost} ⚡
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold bg-primary/20 text-primary px-2 py-1 rounded">
                        {count}
                      </span>
                      <Tooltip content="Remove one copy">
                        <Button
                          onClick={() => removeCardFromDeck(cardId)}
                          variant="icon"
                          size="sm"
                          className="bg-error hover:bg-error/80"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleSaveDeck}
              variant="primary"
              className="w-full"
              disabled={currentDeck.length < 20}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Deck
            </Button>
            <Button
              onClick={handlePlayWithDeck}
              variant="secondary"
              className="w-full"
              disabled={currentDeck.length < 20}
            >
              <Play className="w-4 h-4 mr-2" />
              Play with this Deck
            </Button>
          </div>

          {savedDecks.length > 0 && (
            <div className="mt-lg">
              <h4 className="text-base font-semibold mb-2">Saved Decks</h4>
              <div className="space-y-2">
                {savedDecks.map((deck) => (
                  <button
                    key={deck.deckId}
                    onClick={() => loadDeck(deck)}
                    className="w-full text-left bg-bg rounded p-2 hover:bg-primary/10 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{deck.name}</span>
                      <span className="text-xs text-textSecondary">
                        {deck.cardIdsInDeck.length} cards
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeckBuilder;
