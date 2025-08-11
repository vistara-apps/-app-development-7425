import React from 'react';
import { Star } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin mb-4">
          <Star className="w-16 h-16 text-accent mx-auto" />
        </div>
        <h1 className="text-display cosmic-gradient bg-clip-text text-transparent mb-4">
          Cosmic Clash
        </h1>
        <p className="text-textSecondary">Loading the cosmos...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;