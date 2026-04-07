import React from 'react';
import { MapPin, ArrowRight, Edit3, Trash2 } from 'lucide-react';
import { Destination } from '../types';
import { calculateDestinationActualBudget } from '../lib/budget';

interface DestinationCardProps {
  destination: Destination;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onClick, onEdit, onDelete }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-border editorial-shadow transition-all hover:translate-y-[-4px] cursor-pointer"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img 
          src={destination.coverImage} 
          alt={destination.city}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={onEdit}
            className="p-2 bg-surface/80 backdrop-blur-md rounded-full text-secondary hover:text-accent transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 bg-surface/80 backdrop-blur-md rounded-full text-secondary hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col p-5 gap-4">
        <div className="flex items-center gap-2 text-primary">
          <MapPin className="w-4 h-4 text-accent" />
          <h3 className="text-2xl font-display font-bold tracking-tight">
            {destination.city}
          </h3>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-secondary uppercase font-bold tracking-widest">Duration</span>
            <span className="text-sm font-medium text-primary">{destination.duration} Days</span>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-secondary uppercase font-bold tracking-widest">Planned</span>
              <span className="text-sm font-medium text-primary">${destination.budget}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-secondary uppercase font-bold tracking-widest">Actual</span>
              <span className={`text-sm font-bold ${calculateDestinationActualBudget(destination) > destination.budget ? 'text-red-500' : 'text-green-600'}`}>${calculateDestinationActualBudget(destination)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
