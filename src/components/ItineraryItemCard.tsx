import React from 'react';
import { Activity, Train, MapPin, Clock, DollarSign, Trash2 } from 'lucide-react';
import { ItineraryItem } from '../types';
import { cn } from '../lib/utils';

interface ItineraryItemCardProps {
  item: ItineraryItem;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const ItineraryItemCard: React.FC<ItineraryItemCardProps> = ({ item, onClick, onDelete }) => {
  const isActivity = item.type === 'activity';

  return (
    <div 
      onClick={onClick}
      className="group relative flex items-center gap-6 p-4 rounded-2xl bg-white border border-border editorial-shadow transition-all hover:translate-x-2 cursor-pointer"
    >
      <div className={cn(
        "flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden",
        !isActivity && "bg-white border border-border flex items-center justify-center"
      )}>
        {isActivity ? (
          <img 
            src={item.image} 
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <Train className="w-8 h-8 text-secondary" />
        )}
      </div>
      
      <div className="flex-grow flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {isActivity ? (
            <Activity className="w-3.5 h-3.5 text-accent" />
          ) : (
            <Train className="w-3.5 h-3.5 text-accent" />
          )}
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
            {isActivity ? item.category : 'Transportation'}
          </span>
        </div>
        <h4 className="text-base font-display font-semibold text-primary group-hover:text-accent transition-colors">
          {item.title}
        </h4>
        <p className="text-xs text-secondary line-clamp-1">
          {item.description}
        </p>
      </div>
      
      <div className="flex flex-col items-end gap-2 text-xs font-medium text-secondary">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{item.duration} {isActivity ? 'hrs' : item.durationUnit}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5" />
          <span>{item.budget > 0 ? `$${item.budget}` : 'Free'}</span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          className="p-1.5 text-secondary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
