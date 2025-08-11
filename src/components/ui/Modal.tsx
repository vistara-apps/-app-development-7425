import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-surface rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto cosmic-border animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-lg border-b border-primary/20">
          <h2 className="text-heading">{title}</h2>
          <Button
            onClick={onClose}
            variant="icon"
            className="bg-transparent hover:bg-primary/20 text-textSecondary hover:text-textPrimary"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;