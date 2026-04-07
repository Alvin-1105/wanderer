import React from 'react';
import { Calendar, MapPin, Clock, Trash2 } from 'lucide-react';
import { Trip, TripStatus } from '../types';
import { calculateTripActualBudget } from '../lib/budget';
import { cn } from '../lib/utils';

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onClick, onDelete }) => {
  const statusColors = {
    [TripStatus.Current]: 'bg-accent text-white',
    [TripStatus.Planning]: 'bg-tertiary text-primary',
    [TripStatus.Past]: 'bg-surface-variant text-secondary',
  };

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-border editorial-shadow transition-all hover:translate-y-[-4px] cursor-pointer"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={trip.coverImage} 
          alt={trip.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            className="p-2 bg-surface/80 backdrop-blur-md rounded-full text-secondary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col p-6 gap-3">
        <h3 className="text-xl font-display font-semibold text-primary group-hover:text-accent transition-colors">
          {trip.title}
        </h3>
        <p className="text-sm text-secondary line-clamp-2 leading-relaxed">
          {trip.description}
        </p>
        
        <div className="flex items-center gap-4 mt-2 text-xs text-secondary font-medium flex-wrap">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(trip.startDate + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{trip.duration} Days</span>
          </div>
          <div className="flex items-center gap-1.5 w-full pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 w-full justify-between">
              <div className="flex items-baseline gap-1">
                <span className="opacity-70 uppercase tracking-widest text-[10px]">Planned:</span>
                <span className="font-semibold text-primary">${trip.budget}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="opacity-70 uppercase tracking-widest text-[10px]">Actual:</span>
                <span className={`font-bold ${calculateTripActualBudget(trip) > trip.budget ? 'text-red-500' : 'text-green-600'}`}>
                  ${calculateTripActualBudget(trip)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
