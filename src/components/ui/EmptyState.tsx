import React from 'react';
import { LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Icon className="w-16 h-16 text-textSecondary mx-auto mb-4 animate-float" />
          <h3 className="text-heading text-textPrimary mb-2">{title}</h3>
          <p className="text-textSecondary">{description}</p>
        </div>
        
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            variant="primary"
            className="animate-bounce-subtle"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;

