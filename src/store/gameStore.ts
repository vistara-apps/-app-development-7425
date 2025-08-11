import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { cardDatabase } from '../data/cards';
import type { User, Card, Deck, GameState } from '../types';

interface GameStore {
  user: User | null;
  currentView: 'menu' | 'deckBuilder' | 'game' | 'shop';
  gameState: GameState | null;
  availableCards: Card[];
  
  // Actions
  setCurrentView: (view: 'menu' | 'deckBuilder' | 'game' | 'shop') => void;
  initializeUser: () => Promise<void>;
  updateUserShards: (amount: number) => Promise<void>;
  addCardsToCollection: (cardIds: string[]) => Promise<void>;
  saveDeck: (deck: Omit<Deck, 'deckId'>) => Promise<void>;
  loadUserDecks: () => Promise<Deck[]>;
  startGame: (playerDeck: Deck) => void;
  updateGameState: (newState: Partial<GameState>) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  user: null,
  currentView: 'menu',
  gameState: null,
  availableCards: cardDatabase,

  setCurrentView: (view) => set({ currentView: view }),

  initializeUser: async () => {
    try {
      // Check if user exists in localStorage first
      const savedUser = localStorage.getItem('cosmic-clash-user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        set({ user });
        return;
      }

      // Create new user with starter cards
      const newUser: User = {
        userId: crypto.randomUUID(),
        username: `Player_${Math.floor(Math.random() * 10000)}`,
        email: '',
        cosmicShardsBalance: 500, // Starting shards
        collectedCardIds: [
          'unit-001', 'unit-002', 'unit-003', 'unit-004', 'unit-005',
          'tech-001', 'tech-002', 'event-001', 'event-002'
        ] // Starter deck
      };

      localStorage.setItem('cosmic-clash-user', JSON.stringify(newUser));
      set({ user: newUser });
    } catch (error) {
      console.error('Error initializing user:', error);
    }
  },

  updateUserShards: async (amount) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = {
      ...user,
      cosmicShardsBalance: user.cosmicShardsBalance + amount
    };

    localStorage.setItem('cosmic-clash-user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  addCardsToCollection: async (cardIds) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = {
      ...user,
      collectedCardIds: [...new Set([...user.collectedCardIds, ...cardIds])]
    };

    localStorage.setItem('cosmic-clash-user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  saveDeck: async (deck) => {
    const { user } = get();
    if (!user) return;

    const savedDecks = JSON.parse(localStorage.getItem('cosmic-clash-decks') || '[]');
    const newDeck: Deck = {
      ...deck,
      deckId: crypto.randomUUID()
    };

    savedDecks.push(newDeck);
    localStorage.setItem('cosmic-clash-decks', JSON.stringify(savedDecks));
  },

  loadUserDecks: async () => {
    const { user } = get();
    if (!user) return [];

    const savedDecks = JSON.parse(localStorage.getItem('cosmic-clash-decks') || '[]');
    return savedDecks.filter((deck: Deck) => deck.userId === user.userId);
  },

  startGame: (playerDeck) => {
    const aiDeck: Deck = {
      deckId: 'ai-deck',
      userId: 'ai',
      name: 'AI Opponent',
      cardIdsInDeck: ['unit-001', 'unit-002', 'unit-003', 'tech-001', 'event-001']
    };

    const gameState: GameState = {
      gameId: crypto.randomUUID(),
      currentTurn: 'player',
      turnNumber: 1,
      player: {
        starbaseHealth: 20,
        cosmicEnergy: 3,
        maxCosmicEnergy: 3,
        hand: [],
        deck: playerDeck.cardIdsInDeck,
        battlefield: [],
        discardPile: []
      },
      opponent: {
        starbaseHealth: 20,
        cosmicEnergy: 3,
        maxCosmicEnergy: 3,
        hand: [],
        deck: aiDeck.cardIdsInDeck,
        battlefield: [],
        discardPile: []
      }
    };

    // Draw starting hands
    gameState.player.hand = gameState.player.deck.splice(0, 5);
    gameState.opponent.hand = gameState.opponent.deck.splice(0, 5);

    set({ gameState, currentView: 'game' });
  },

  updateGameState: (newState) => {
    const { gameState } = get();
    if (!gameState) return;

    set({ gameState: { ...gameState, ...newState } });
  }
}));