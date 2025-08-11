import React from 'react';
import type { Card as CardType } from '../../types';
import { Zap, Heart, Shield, Target } from 'lucide-react';

interface CardProps {
  card: CardType;
  variant?: 'default' | 'large';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ card, variant = 'default', onClick }) => {
  const isLarge = variant === 'large';
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'border-gray-400';
      case 'Rare': return 'border-blue-400';
      case 'Epic': return 'border-purple-400';
      case 'Legendary': return 'border-yellow-400';
      default: return 'border-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Unit': return 'text-green-400';
      case 'Technology': return 'text-blue-400';
      case 'Event': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div
      className={`
        bg-surface-elevated rounded-lg p-4 cosmic-border-subtle shadow-card card-hover
        ${isLarge ? 'max-w-xs' : 'w-full'} 
        ${onClick ? 'cursor-pointer hover:shadow-card-hover hover:cosmic-glow' : ''}
        ${getRarityColor(card.rarity)}
        relative overflow-hidden group animate-slide-in-up
      `}
      onClick={onClick}
    >
      {/* Card Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold truncate ${isLarge ? 'text-lg' : 'text-sm'}`}>
            {card.name}
          </h3>
          <p className={`${getTypeColor(card.type)} ${isLarge ? 'text-sm' : 'text-xs'}`}>
            {card.type}
          </p>
        </div>
        <div className="flex items-center space-x-1 bg-accent text-white rounded-md px-2 py-1 shadow-sm group-hover:shadow-cosmic-accent transition-shadow">
          <Zap className="w-3 h-3" />
          <span className="text-xs font-bold">{card.cost}</span>
        </div>
      </div>

      {/* Card Image Placeholder */}
      <div className={`bg-bg rounded-md mb-3 flex items-center justify-center relative ${isLarge ? 'h-32' : 'h-20'} cosmic-gradient-subtle group-hover:animate-pulse-glow`}>
        <div className="text-textSecondary text-center">
          <div className="text-2xl mb-1 animate-float">🌌</div>
          <p className="text-xs font-medium">{card.type}</p>
        </div>
        {/* Rarity shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>

      {/* Card Stats */}
      {(card.attack !== undefined || card.health !== undefined) && (
        <div className="flex justify-between items-center mb-2">
          {card.attack !== undefined && (
            <div className="flex items-center space-x-1 text-red-400">
              <Target className="w-4 h-4" />
              <span className="text-sm font-semibold">{card.attack}</span>
            </div>
          )}
          {card.health !== undefined && (
            <div className="flex items-center space-x-1 text-green-400">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-semibold">{card.health}</span>
            </div>
          )}
        </div>
      )}

      {/* Card Description */}
      <p className={`text-textSecondary mb-2 ${isLarge ? 'text-sm' : 'text-xs'} line-clamp-2`}>
        {card.description}
      </p>

      {/* Keywords */}
      {card.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {card.keywords.map((keyword) => (
            <span
              key={keyword}
              className="bg-primary/20 text-primary text-xs px-2 py-1 rounded"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}

      {/* Rarity Indicator */}
      <div className="mt-2 text-center">
        <span className={`text-xs font-semibold ${getRarityColor(card.rarity).replace('border', 'text')}`}>
          {card.rarity}
        </span>
      </div>
    </div>
  );
};

export default Card;
