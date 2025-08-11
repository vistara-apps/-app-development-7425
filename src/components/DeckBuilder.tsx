import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { cardDatabase } from '../data/cards';
import { Plus, Minus, Save, Play } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import type { Card as CardType, Deck } from '../types';

const DeckBuilder: React.FC = () => {
  const { user, saveDeck, loadUserDecks, setCurrentView, startGame } = useGameStore();
  const [currentDeck, setCurrentDeck] = useState<string[]>([]);
  const [deckName, setDeckName] = useState('My Deck');
  const [savedDecks, setSavedDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const loadDecks = async () => {
      const decks = await loadUserDecks();
      setSavedDecks(decks);
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
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Card Collection */}
        <div className="lg:col-span-2">
          <h2 className="text-heading mb-md">Your Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
            {collectedCards.map((card) => (
              <div key={card.cardId} className="relative">
                <Card card={card} variant="default" />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    onClick={() => addCardToDeck(card.cardId)}
                    variant="icon"
                    size="sm"
                    disabled={currentDeck.length >= 40 || getCardCount(card.cardId) >= 3}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  {getCardCount(card.cardId) > 0 && (
                    <Button
                      onClick={() => removeCardFromDeck(card.cardId)}
                      variant="icon"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {getCardCount(card.cardId) > 0 && (
                  <div className="absolute bottom-2 left-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {getCardCount(card.cardId)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Deck Builder */}
        <div className="bg-surface rounded-lg p-lg cosmic-border">
          <h3 className="text-heading mb-md">Current Deck</h3>
          
          <div className="mb-md">
            <Input
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Deck Name"
              className="mb-2"
            />
            <p className="text-caption">
              Cards: {currentDeck.length}/40 (Min: 20)
            </p>
          </div>

          <div className="space-y-2 mb-md max-h-64 overflow-y-auto">
            {currentDeck.length === 0 ? (
              <p className="text-textSecondary text-center py-4">
                Add cards to your deck
              </p>
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
                  <div key={cardId} className="flex items-center justify-between bg-bg rounded p-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{card.name}</span>
                      <span className="text-xs text-textSecondary">({card.cost} ⚡)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold">{count}</span>
                      <Button
                        onClick={() => removeCardFromDeck(cardId)}
                        variant="icon"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
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