import React from 'react';
import { Menu, X } from 'lucide-react';

interface ToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-20 left-4 z-50 bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-colors border border-gray-200"
    >
      {isOpen ? (
        <X className="h-5 w-5 text-gray-600" />
      ) : (
        <Menu className="h-5 w-5 text-gray-600" />
      )}
    </button>
  );
};