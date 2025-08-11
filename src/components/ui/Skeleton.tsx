import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1
}) => {
  const baseClasses = 'skeleton rounded animate-pulse';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    card: 'rounded-lg h-48'
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'circular' ? width : undefined)
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={className}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} mb-2 last:mb-0`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Card skeleton component
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-surface-elevated rounded-lg p-4 cosmic-border-subtle ${className}`}>
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <Skeleton variant="text" width="60%" className="mb-1" />
        <Skeleton variant="text" width="40%" />
      </div>
      <Skeleton variant="rectangular" width={40} height={24} />
    </div>
    
    <Skeleton variant="rectangular" className="mb-3 h-20" />
    
    <div className="flex justify-between items-center mb-2">
      <Skeleton variant="rectangular" width={30} height={20} />
      <Skeleton variant="rectangular" width={30} height={20} />
    </div>
    
    <Skeleton variant="text" lines={2} className="mb-2" />
    
    <div className="flex gap-2">
      <Skeleton variant="rectangular" width={60} height={20} />
      <Skeleton variant="rectangular" width={50} height={20} />
    </div>
  </div>
);

export default Skeleton;

