import React from 'react';
import { Sparkles, Edit3, X } from 'lucide-react';

interface AIChoiceModalProps {
  onClose: () => void;
  onManualClick: () => void;
  onAIClick: () => void;
}

export const AIChoiceModal: React.FC<AIChoiceModalProps> = ({ onClose, onManualClick, onAIClick }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-secondary hover:bg-surface rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-accent" />
        </div>
        
        <h2 className="text-2xl font-display font-bold text-primary mb-2">Plan Your Next Trip</h2>
        <p className="text-secondary text-sm mb-8">
          Need some inspiration? Our AI can automatically generate a full itinerary for you, or you can plan it from scratch yourself.
        </p>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={onAIClick}
            className="flex items-center justify-center gap-3 w-full py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate with AI</span>
          </button>
          
          <button 
            onClick={onManualClick}
            className="flex items-center justify-center gap-3 w-full py-4 bg-surface text-primary rounded-xl font-semibold hover:bg-surface-variant transition-all border border-border"
          >
            <Edit3 className="w-5 h-5" />
            <span>Start from Scratch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
