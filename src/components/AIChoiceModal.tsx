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
      <div className="bg-white rounded-3xl p-8 md:p-12 max-w-4xl w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-secondary hover:bg-surface rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">How would you like to plan?</h2>
          <p className="text-secondary text-lg max-w-xl mx-auto">
            Choose whether to build your itinerary from scratch or let our intelligent AI travel assistant do the heavy lifting for you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Path */}
          <button 
            onClick={onAIClick}
            className="group relative flex flex-col items-center p-8 bg-gradient-to-br from-accent/5 to-accent/10 border-2 border-accent/20 rounded-3xl hover:border-accent hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1 transition-all overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-md z-10">
              <Sparkles className="w-10 h-10 text-accent animate-pulse" />
            </div>
            <h3 className="text-2xl font-display font-bold text-primary mb-3 z-10 text-center">Chat with AI Expert</h3>
            <p className="text-primary/70 text-center mb-8 z-10">
              Talk to our elite AI travel planner. Just share your dreams, budget, and vibes, and get a highly personalized, structured itinerary in seconds.
            </p>
            <div className="mt-auto w-full py-4 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 z-10 group-hover:bg-accent/90 transition-colors">
              <Sparkles className="w-5 h-5" />
              <span>Start AI Consultation</span>
            </div>
          </button>
          
          {/* Manual Path */}
          <button 
            onClick={onManualClick}
            className="group relative flex flex-col items-center p-8 bg-surface border-2 border-border rounded-3xl hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden text-left"
          >
            <div className="w-20 h-20 bg-white border border-border rounded-2xl flex items-center justify-center mb-6 shadow-sm z-10">
              <Edit3 className="w-10 h-10 text-secondary group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-2xl font-display font-bold text-primary mb-3 z-10 text-center">Plan from Scratch</h3>
            <p className="text-secondary text-center mb-8 z-10">
              Total control over every detail. Add your own destinations, hand-pick activities, calculate your budget manually, and build your perfect trip piece by piece.
            </p>
            <div className="mt-auto w-full py-4 bg-white border-2 border-border text-primary rounded-xl font-bold flex items-center justify-center gap-2 z-10 group-hover:border-primary/20 transition-colors">
              <Edit3 className="w-5 h-5" />
              <span>Open Manual Builder</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
