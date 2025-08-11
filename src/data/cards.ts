import type { Card } from '../types';

export const cardDatabase: Card[] = [
  // Units
  {
    cardId: 'unit-001',
    name: 'Cosmic Warrior',
    description: 'A fierce warrior from the outer rim galaxies.',
    cost: 2,
    attack: 2,
    health: 3,
    keywords: ['Rapid Fire'],
    type: 'Unit',
    imageUrl: '/images/cosmic-warrior.jpg',
    rarity: 'Common'
  },
  {
    cardId: 'unit-002',
    name: 'Shield Guardian',
    description: 'A defensive unit with advanced shielding technology.',
    cost: 3,
    attack: 1,
    health: 5,
    keywords: ['Shield'],
    type: 'Unit',
    imageUrl: '/images/shield-guardian.jpg',
    rarity: 'Common'
  },
  {
    cardId: 'unit-003',
    name: 'Void Hunter',
    description: 'A deadly assassin that strikes from the shadows of space.',
    cost: 4,
    attack: 4,
    health: 2,
    keywords: ['Rapid Fire'],
    type: 'Unit',
    imageUrl: '/images/void-hunter.jpg',
    rarity: 'Rare'
  },
  {
    cardId: 'unit-004',
    name: 'Plasma Drone',
    description: 'An automated unit that can strike immediately.',
    cost: 1,
    attack: 1,
    health: 1,
    keywords: ['Rapid Fire'],
    type: 'Unit',
    imageUrl: '/images/plasma-drone.jpg',
    rarity: 'Common'
  },
  {
    cardId: 'unit-005',
    name: 'Titan Mech',
    description: 'A massive mechanical warrior with incredible durability.',
    cost: 6,
    attack: 6,
    health: 8,
    keywords: ['Shield'],
    type: 'Unit',
    imageUrl: '/images/titan-mech.jpg',
    rarity: 'Epic'
  },
  {
    cardId: 'unit-006',
    name: 'Starburst Phoenix',
    description: 'A legendary creature born from stellar explosions.',
    cost: 8,
    attack: 8,
    health: 6,
    keywords: ['Rapid Fire', 'Orbital Strike'],
    type: 'Unit',
    imageUrl: '/images/starburst-phoenix.jpg',
    rarity: 'Legendary'
  },
  
  // Technologies
  {
    cardId: 'tech-001',
    name: 'Energy Amplifier',
    description: 'Increases your cosmic energy generation.',
    cost: 2,
    keywords: ['Persistent'],
    type: 'Technology',
    imageUrl: '/images/energy-amplifier.jpg',
    rarity: 'Common'
  },
  {
    cardId: 'tech-002',
    name: 'Quantum Shield',
    description: 'Protects your starbase from the next attack.',
    cost: 3,
    keywords: ['Shield'],
    type: 'Technology',
    imageUrl: '/images/quantum-shield.jpg',
    rarity: 'Rare'
  },
  {
    cardId: 'tech-003',
    name: 'Warp Core',
    description: 'Dramatically increases energy production.',
    cost: 5,
    keywords: ['Persistent'],
    type: 'Technology',
    imageUrl: '/images/warp-core.jpg',
    rarity: 'Epic'
  },
  
  // Events
  {
    cardId: 'event-001',
    name: 'Solar Flare',
    description: 'Deal 3 damage to target unit or starbase.',
    cost: 2,
    keywords: ['Orbital Strike'],
    type: 'Event',
    imageUrl: '/images/solar-flare.jpg',
    rarity: 'Common'
  },
  {
    cardId: 'event-002',
    name: 'Cosmic Storm',
    description: 'Deal 2 damage to all enemy units.',
    cost: 4,
    keywords: ['Area Effect'],
    type: 'Event',
    imageUrl: '/images/cosmic-storm.jpg',
    rarity: 'Rare'
  },
  {
    cardId: 'event-003',
    name: 'Stellar Regeneration',
    description: 'Restore 5 health to your starbase.',
    cost: 3,
    keywords: ['Heal'],
    type: 'Event',
    imageUrl: '/images/stellar-regeneration.jpg',
    rarity: 'Common'
  },
  {
    cardId: 'event-004',
    name: 'Supernova',
    description: 'Destroy all units on the battlefield.',
    cost: 7,
    keywords: ['Area Effect', 'Destroy'],
    type: 'Event',
    imageUrl: '/images/supernova.jpg',
    rarity: 'Legendary'
  }
];