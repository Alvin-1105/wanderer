import React from 'react';
import { Plus, Edit3, Calendar, MapPin, Clock, DollarSign } from 'lucide-react';
import { Trip } from '../types';
import { Layout } from '../components/Layout';
import { Header } from '../components/Header';
import { DestinationCard } from '../components/DestinationCard';
import { ItineraryItemCard } from '../components/ItineraryItemCard';

interface TripDetailsScreenProps {
  trip: Trip;
  onBack: () => void;
  onEditTrip: () => void;
  onAddDestination: () => void;
  onAddTransportation: (prevDestId: string) => void;
  onDestinationClick: (destinationId: string) => void;
  onEditDestination: (destinationId: string) => void;
  onDeleteDestination: (destinationId: string) => void;
  onItemClick: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export const TripDetailsScreen: React.FC<TripDetailsScreenProps> = ({ 
  trip, 
  onBack, 
  onEditTrip, 
  onAddDestination, 
  onAddTransportation,
  onDestinationClick,
  onEditDestination,
  onDeleteDestination,
  onItemClick,
  onDeleteItem
}) => {
  return (
    <div className="min-h-screen bg-surface">
      <Header 
        title={trip.title} 
        onBack={onBack}
        actions={
          <button 
            onClick={onEditTrip}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-primary rounded-full hover:bg-surface-variant transition-all font-medium text-sm"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Trip</span>
          </button>
        }
      />
      
      <div className="relative h-64 w-full overflow-hidden">
        <img 
          src={trip.coverImage} 
          alt={trip.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <div className="absolute bottom-8 left-6 right-6 flex flex-col gap-4">
          <div className="flex items-center gap-6 text-sm font-medium text-primary">
            <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Calendar className="w-4 h-4 text-accent" />
              <span>{new Date(trip.startDate ? trip.startDate + 'T12:00:00' : '').toLocaleDateString()} - {new Date(trip.endDate ? trip.endDate + 'T12:00:00' : '').toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 text-accent" />
              <span>{trip.duration} Days</span>
            </div>
            <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full">
              <DollarSign className="w-4 h-4 text-accent" />
              <span>Budget: ${trip.budget}</span>
            </div>
          </div>
        </div>
      </div>
      
      <Layout className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 flex flex-col gap-10">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-primary tracking-tight">
                  Itinerary
                </h2>
                <button 
                  onClick={onAddDestination}
                  className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Destination</span>
                </button>
              </div>
              <div className="flex flex-col gap-8">
                {trip.destinations.map((dest, index) => (
                  <React.Fragment key={dest.id}>
                    <DestinationCard 
                      destination={dest} 
                      onClick={() => onDestinationClick(dest.id)}
                      onEdit={(e) => {
                        e.stopPropagation();
                        onEditDestination(dest.id);
                      }}
                      onDelete={(e) => {
                        e.stopPropagation();
                        onDeleteDestination(dest.id);
                      }}
                    />
                    
                    {index < trip.destinations.length - 1 && (
                      <div className="flex flex-col items-center gap-4 py-4">
                        {trip.transportationBetweenDestinations?.[`${dest.id}-${trip.destinations[index+1].id}`] ? (
                          <div className="w-full max-w-md">
                            <ItineraryItemCard 
                              item={trip.transportationBetweenDestinations[`${dest.id}-${trip.destinations[index+1].id}`]}
                              onClick={() => onItemClick(trip.transportationBetweenDestinations![`${dest.id}-${trip.destinations[index+1].id}`].id)}
                              onDelete={() => onDeleteItem(trip.transportationBetweenDestinations![`${dest.id}-${trip.destinations[index+1].id}`].id)}
                            />
                          </div>
                        ) : (
                          <button 
                            onClick={() => onAddTransportation(dest.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-secondary rounded-full hover:bg-surface-variant transition-all text-xs font-medium"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Transportation to {trip.destinations[index+1].city}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ))}
                
                <button 
                  onClick={onAddDestination}
                  className="flex flex-col items-center justify-center gap-3 h-full min-h-[200px] rounded-2xl border-2 border-dashed border-border hover:border-accent hover:bg-white transition-all group"
                >
                  <div className="p-3 bg-white group-hover:bg-accent/10 rounded-full transition-colors">
                    <Plus className="w-6 h-6 text-secondary group-hover:text-accent" />
                  </div>
                  <span className="text-sm font-semibold text-primary group-hover:text-accent">
                    Add New Destination
                  </span>
                </button>
              </div>
            </section>
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="p-6 bg-white rounded-2xl border border-border editorial-shadow">
              <h3 className="text-lg font-display font-bold text-primary mb-4 tracking-tight">
                Trip Overview
              </h3>
              <div className="flex flex-col bg-surface/50 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border/50 text-sm">
                  <span className="text-secondary">Total Budget</span>
                  <span className="font-semibold text-primary">${trip.budget}</span>
                </div>
                <div className="flex items-center justify-between p-4 text-sm">
                  <span className="text-secondary">Destinations</span>
                  <span className="font-semibold text-primary">{trip.destinations.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};
