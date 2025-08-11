export interface User {
  userId: string;
  username: string;
  email: string;
  cosmicShardsBalance: number;
  collectedCardIds: string[];
}

export interface Card {
  cardId: string;
  name: string;
  description: string;
  cost: number;
  attack?: number;
  health?: number;
  keywords: string[];
  type: 'Unit' | 'Technology' | 'Event';
  imageUrl: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface Deck {
  deckId: string;
  userId: string;
  name: string;
  cardIdsInDeck: string[];
}

export interface PlayerState {
  starbaseHealth: number;
  cosmicEnergy: number;
  maxCosmicEnergy: number;
  hand: string[];
  deck: string[];
  battlefield: string[];
  discardPile: string[];
}

export interface GameState {
  gameId: string;
  currentTurn: 'player' | 'opponent';
  turnNumber: number;
  player: PlayerState;
  opponent: PlayerState;
}

export interface BattlefieldCard {
  cardId: string;
  instanceId: string;
  currentAttack: number;
  currentHealth: number;
  canAttack: boolean;
  keywords: string[];
}