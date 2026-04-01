import React from 'react';
import { Plus } from 'lucide-react';
import { Trip } from '../types';
import { TripCard } from '../components/TripCard';
import { Layout } from '../components/Layout';
import { Header } from '../components/Header';

interface MyTripsScreenProps {
  trips: Trip[];
  onTripClick: (tripId: string) => void;
  onAddTrip: () => void;
  onDeleteTrip: (tripId: string) => void;
}

export const MyTripsScreen: React.FC<MyTripsScreenProps> = ({ trips, onTripClick, onAddTrip, onDeleteTrip }) => {
  return (
    <div className="min-h-screen bg-surface">
      <Header 
        title="My Trips" 
      />
      <Layout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              onClick={() => onTripClick(trip.id)} 
              onDelete={() => onDeleteTrip(trip.id)}
            />
          ))}
          
          <button 
            onClick={onAddTrip}
            className="flex flex-col items-center justify-center gap-4 h-full min-h-[300px] rounded-2xl border-2 border-dashed border-border hover:border-accent hover:bg-white transition-all group"
          >
            <div className="p-4 bg-white group-hover:bg-accent/10 rounded-full transition-colors">
              <Plus className="w-8 h-8 text-secondary group-hover:text-accent" />
            </div>
            <div className="text-center">
              <span className="block text-lg font-display font-semibold text-primary group-hover:text-accent">
                Start a New Journey
              </span>
              <span className="text-sm text-secondary">
                Add your next destination
              </span>
            </div>
          </button>
        </div>
      </Layout>
    </div>
  );
};
