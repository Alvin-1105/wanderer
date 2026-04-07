import React from 'react';
import { Plus, Edit3, MapPin, Clock, DollarSign, Wallet, Activity, Train } from 'lucide-react';
import { Destination } from '../types';
import { calculateDestinationActualBudget } from '../lib/budget';
import { Layout } from '../components/Layout';
import { Header } from '../components/Header';
import { ItineraryItemCard } from '../components/ItineraryItemCard';

interface CityDetailsScreenProps {
  destination: Destination;
  onBack: () => void;
  onEditCity: () => void;
  onAddActivity: () => void;
  onAddTransportation: (index?: number) => void;
  onItemClick: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export const CityDetailsScreen: React.FC<CityDetailsScreenProps> = ({ 
  destination, 
  onBack, 
  onEditCity, 
  onAddActivity, 
  onAddTransportation,
  onItemClick,
  onDeleteItem
}) => {
  const activities = destination.items.filter(i => i.type === 'activity');
  const transportations = destination.items.filter(i => i.type === 'transportation');

  return (
    <div className="min-h-screen bg-surface">
      <Header 
        title={destination.city} 
        onBack={onBack}
        actions={
          <button 
            onClick={onEditCity}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-primary rounded-full hover:bg-surface-variant transition-all font-medium text-sm"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit City Details</span>
          </button>
        }
      />
      
      <div className="relative h-64 w-full overflow-hidden">
        <img 
          src={destination.coverImage} 
          alt={destination.city}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <div className="absolute bottom-8 left-6 right-6 flex flex-col gap-4">
          <div className="flex items-center gap-6 text-sm font-medium text-primary">
            <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4 text-accent" />
              <span>{destination.city}, {destination.country}</span>
            </div>
            <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 text-accent" />
              <span>{destination.duration} Days</span>
            </div>
            <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full">
              <span className="text-secondary font-bold uppercase text-[10px] tracking-widest mr-1 opacity-70">Planned</span>
              <DollarSign className="w-4 h-4 text-accent" />
              <span>{destination.budget}</span>
            </div>
            <div className={`flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full ${calculateDestinationActualBudget(destination) > destination.budget ? 'text-red-600 font-bold' : ''}`}>
              <span className="text-secondary font-bold uppercase text-[10px] tracking-widest mr-1 opacity-70">Actual</span>
              <Wallet className="w-4 h-4 text-accent" />
              <span>{calculateDestinationActualBudget(destination)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <Layout className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-12">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-primary tracking-tight">
                  Itinerary
                </h2>
                <div className="flex gap-6">
                  <button 
                    onClick={onAddActivity}
                    className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Activity</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {destination.items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ItineraryItemCard 
                      item={item} 
                      onClick={() => onItemClick(item.id)} 
                      onDelete={() => onDeleteItem(item.id)}
                    />
                    
                    {index < destination.items.length - 1 && (
                      <div className="flex justify-center py-2">
                        <button 
                          onClick={() => onAddTransportation(index + 1)}
                          className="flex items-center gap-2 px-3 py-1 bg-white border border-border text-secondary rounded-full hover:bg-surface-variant transition-all text-[10px] font-medium opacity-60 hover:opacity-100"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Transportation</span>
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                ))}
                {destination.items.length === 0 && (
                  <button 
                    onClick={onAddActivity}
                    className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-border hover:border-accent hover:bg-white transition-all group"
                  >
                    <div className="p-3 bg-white group-hover:bg-accent/10 rounded-full transition-colors">
                      <Activity className="w-6 h-6 text-secondary group-hover:text-accent" />
                    </div>
                    <span className="text-sm font-semibold text-primary group-hover:text-accent">
                      Add Your First Activity
                    </span>
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </Layout>
    </div>
  );
};
