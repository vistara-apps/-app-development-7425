import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { cardDatabase } from '../data/cards';
import { Package, Star, Coins } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Modal from './ui/Modal';
import toast from 'react-hot-toast';

interface CardPack {
  id: string;
  name: string;
  description: string;
  price: number;
  shardCost: number;
  cardCount: number;
  guaranteedRarity?: 'Rare' | 'Epic' | 'Legendary';
}

const cardPacks: CardPack[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    description: 'A basic pack with 5 random cards',
    price: 1.99,
    shardCost: 100,
    cardCount: 5
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    description: '10 cards with guaranteed rare',
    price: 4.99,
    shardCost: 250,
    cardCount: 10,
    guaranteedRarity: 'Rare'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Pack',
    description: '15 cards with guaranteed epic',
    price: 9.99,
    shardCost: 500,
    cardCount: 15,
    guaranteedRarity: 'Epic'
  },
  {
    id: 'legendary',
    name: 'Legendary Pack',
    description: '20 cards with guaranteed legendary',
    price: 19.99,
    shardCost: 1000,
    cardCount: 20,
    guaranteedRarity: 'Legendary'
  }
];

const Shop: React.FC = () => {
  const { user, updateUserShards, addCardsToCollection } = useGameStore();
  const { createSession } = usePaymentContext();
  const [showPackModal, setShowPackModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState<CardPack | null>(null);
  const [purchasedCards, setPurchasedCards] = useState<string[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const generateRandomCards = (pack: CardPack): string[] => {
    const cards: string[] = [];
    const availableCards = [...cardDatabase];
    
    // Add guaranteed rarity card first if specified
    if (pack.guaranteedRarity) {
      const guaranteedCards = availableCards.filter(card => card.rarity === pack.guaranteedRarity);
      if (guaranteedCards.length > 0) {
        const randomCard = guaranteedCards[Math.floor(Math.random() * guaranteedCards.length)];
        cards.push(randomCard.cardId);
      }
    }
    
    // Fill remaining slots with random cards
    const remainingSlots = pack.cardCount - cards.length;
    for (let i = 0; i < remainingSlots; i++) {
      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
      cards.push(randomCard.cardId);
    }
    
    return cards;
  };

  const handlePurchaseWithShards = async (pack: CardPack) => {
    if (!user || user.cosmicShardsBalance < pack.shardCost) {
      toast.error('Insufficient Cosmic Shards!');
      return;
    }

    setIsPurchasing(true);
    try {
      // Deduct shards
      await updateUserShards(-pack.shardCost);
      
      // Generate cards
      const newCards = generateRandomCards(pack);
      await addCardsToCollection(newCards);
      
      setPurchasedCards(newCards);
      setSelectedPack(pack);
      setShowPackModal(true);
      
      toast.success(`Purchased ${pack.name}!`);
    } catch (error) {
      toast.error('Purchase failed!');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handlePurchaseWithPayment = async (pack: CardPack) => {
    setIsPurchasing(true);
    try {
      await createSession(`$${pack.price}`);
      
      // On successful payment, add shards equivalent to pack cost + bonus
      const shardsToAdd = pack.shardCost + 50; // Bonus shards for payment
      await updateUserShards(shardsToAdd);
      
      toast.success(`Payment successful! Added ${shardsToAdd} Cosmic Shards!`);
    } catch (error) {
      toast.error('Payment failed!');
    } finally {
      setIsPurchasing(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-lg">
        <h1 className="text-display cosmic-gradient bg-clip-text text-transparent mb-4">
          Cosmic Shop
        </h1>
        <p className="text-textSecondary">
          Expand your collection with powerful new cards
        </p>
      </div>

      {user && (
        <div className="bg-surface rounded-lg p-md cosmic-border mb-lg text-center">
          <div className="flex items-center justify-center space-x-lg">
            <div className="flex items-center space-x-2">
              <Coins className="w-6 h-6 text-accent" />
              <span className="text-xl font-semibold">{user.cosmicShardsBalance}</span>
              <span className="text-textSecondary">Cosmic Shards</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">{user.collectedCardIds.length}</span>
              <span className="text-textSecondary">Cards Collected</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
        {cardPacks.map((pack) => (
          <div key={pack.id} className="bg-surface rounded-lg p-lg cosmic-border">
            <div className="text-center mb-md">
              <Package className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-heading mb-2">{pack.name}</h3>
              <p className="text-textSecondary text-sm mb-4">{pack.description}</p>
              
              <div className="space-y-2 mb-md">
                <p className="text-sm">
                  <span className="text-accent font-semibold">{pack.cardCount}</span> cards
                </p>
                {pack.guaranteedRarity && (
                  <p className={`text-sm ${getRarityColor(pack.guaranteedRarity)}`}>
                    Guaranteed {pack.guaranteedRarity}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => handlePurchaseWithShards(pack)}
                variant="primary"
                className="w-full"
                disabled={!user || user.cosmicShardsBalance < pack.shardCost || isPurchasing}
              >
                <Coins className="w-4 h-4 mr-2" />
                {pack.shardCost} Shards
              </Button>
              
              <Button
                onClick={() => handlePurchaseWithPayment(pack)}
                variant="secondary"
                className="w-full"
                disabled={isPurchasing}
              >
                ${pack.price} USD
              </Button>
            </div>

            {user && user.cosmicShardsBalance < pack.shardCost && (
              <p className="text-xs text-red-400 text-center mt-2">
                Need {pack.shardCost - user.cosmicShardsBalance} more shards
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Pack Opening Modal */}
      <Modal
        isOpen={showPackModal}
        onClose={() => setShowPackModal(false)}
        title={`${selectedPack?.name} Contents`}
      >
        <div className="space-y-md">
          <p className="text-center text-textSecondary">
            You received these cards:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md max-h-96 overflow-y-auto">
            {purchasedCards.map((cardId, index) => {
              const card = cardDatabase.find(c => c.cardId === cardId);
              return card ? (
                <Card key={`${cardId}-${index}`} card={card} variant="default" />
              ) : null;
            })}
          </div>
          
          <Button
            onClick={() => setShowPackModal(false)}
            variant="primary"
            className="w-full"
          >
            Continue
          </Button>
        </div>
      </Modal>

      {/* Purchase Cosmic Shards Section */}
      <div className="mt-lg bg-surface rounded-lg p-lg cosmic-border">
        <h2 className="text-heading mb-md text-center">Need More Cosmic Shards?</h2>
        <p className="text-textSecondary text-center mb-lg">
          Purchase Cosmic Shards directly to unlock more card packs
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div className="text-center p-md bg-bg rounded-lg">
            <div className="cosmic-gradient text-white rounded-lg p-4 mb-2">
              <Coins className="w-8 h-8 mx-auto mb-2" />
              <p className="font-bold">150 Shards</p>
            </div>
            <Button
              onClick={() => handlePurchaseWithPayment({ 
                id: 'shards-small', 
                price: 1.99, 
                shardCost: 150,
                name: 'Small Shard Pack',
                description: '',
                cardCount: 0
              })}
              variant="secondary"
              className="w-full"
              disabled={isPurchasing}
            >
              $1.99
            </Button>
          </div>
          
          <div className="text-center p-md bg-bg rounded-lg">
            <div className="cosmic-gradient text-white rounded-lg p-4 mb-2">
              <Coins className="w-8 h-8 mx-auto mb-2" />
              <p className="font-bold">400 Shards</p>
              <p className="text-xs">+50 Bonus!</p>
            </div>
            <Button
              onClick={() => handlePurchaseWithPayment({ 
                id: 'shards-medium', 
                price: 4.99, 
                shardCost: 400,
                name: 'Medium Shard Pack',
                description: '',
                cardCount: 0
              })}
              variant="secondary"
              className="w-full"
              disabled={isPurchasing}
            >
              $4.99
            </Button>
          </div>
          
          <div className="text-center p-md bg-bg rounded-lg">
            <div className="cosmic-gradient text-white rounded-lg p-4 mb-2">
              <Coins className="w-8 h-8 mx-auto mb-2" />
              <p className="font-bold">1000 Shards</p>
              <p className="text-xs">+200 Bonus!</p>
            </div>
            <Button
              onClick={() => handlePurchaseWithPayment({ 
                id: 'shards-large', 
                price: 9.99, 
                shardCost: 1000,
                name: 'Large Shard Pack',
                description: '',
                cardCount: 0
              })}
              variant="primary"
              className="w-full"
              disabled={isPurchasing}
            >
              $9.99
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;