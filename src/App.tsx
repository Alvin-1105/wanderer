import { useEffect, useState, useMemo } from 'react';
import * as api from './api';
import { supabase } from './lib/supabaseClient';
import { AuthScreen } from './components/AuthScreen';
import { Session } from '@supabase/supabase-js';
import { LogOut, Sparkles } from 'lucide-react';
import { Trip, Destination, Activity, Transportation, TripStatus } from './types';
import { MyTripsScreen } from './components/MyTripsScreen';
import { TripDetailsScreen } from './components/TripDetailsScreen';
import { CityDetailsScreen } from './components/CityDetailsScreen';
import { EditTripScreen } from './components/EditTripScreen';
import { AddDestinationScreen } from './components/AddDestinationScreen';
import { AddActivityScreen } from './components/AddActivityScreen';
import { AddTransportationScreen } from './components/AddTransportationScreen';
import { AIChatbotScreen } from './components/AIChatbotScreen';
import { AnimatePresence } from 'motion/react';

type View = 
  | 'my-trips' 
  | 'trip-details' 
  | 'edit-trip' 
  | 'add-destination' 
  | 'city-details' 
  | 'add-activity' 
  | 'add-transportation'
  | 'ai-wizard';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadTrips();
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadTrips();
      } else {
        setTrips([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadTrips = async () => {
    try {
      setIsLoading(true);
      const data = await api.fetchTrips();
      setTrips(data);
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const [currentView, setCurrentView] = useState<View>('my-trips');
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [addingTransportationBetween, setAddingTransportationBetween] = useState<string | null>(null);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);

  const selectedTrip = useMemo(() => 
    trips.find(t => t.id === selectedTripId), 
    [trips, selectedTripId]
  );

  const selectedDestination = useMemo(() => 
    selectedTrip?.destinations.find(d => d.id === selectedDestinationId),
    [selectedTrip, selectedDestinationId]
  );

  const selectedItem = useMemo(() => 
    selectedDestination?.items.find(i => i.id === selectedItemId),
    [selectedDestination, selectedItemId]
  );

  // Navigation Handlers
  const navigateToMyTrips = () => {
    setSelectedTripId(null);
    setSelectedDestinationId(null);
    setSelectedItemId(null);
    setAddingTransportationBetween(null);
    setInsertionIndex(null);
    setCurrentView('my-trips');
  };

  const handleDeleteTrip = async (tripId: string) => {
    try {
      await api.deleteTrip(tripId);
      setTrips(trips.filter(t => t.id !== tripId));
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };
  
  const navigateToTripDetails = (tripId: string) => {
    setSelectedTripId(tripId);
    setSelectedDestinationId(null);
    setSelectedItemId(null);
    setAddingTransportationBetween(null);
    setInsertionIndex(null);
    setCurrentView('trip-details');
  };

  const navigateToEditTrip = (tripId?: string) => {
    if (tripId) setSelectedTripId(tripId);
    setCurrentView('edit-trip');
  };

  const navigateToAITrip = () => {
    setSelectedTripId(null);
    setCurrentView('ai-wizard');
  };

  const navigateToAddDestination = (destId?: string) => {
    if (destId) setSelectedDestinationId(destId);
    setCurrentView('add-destination');
  };

  const handleDeleteDestination = async (destId: string) => {
    if (!selectedTripId) return;
    try {
      await api.deleteDestination(destId);
      setTrips(trips.map(t => {
        if (t.id === selectedTripId) {
          return {
            ...t,
            destinations: t.destinations.filter(d => d.id !== destId)
          };
        }
        return t;
      }));
      setCurrentView('trip-details');
    } catch (error) {
      console.error('Failed to delete destination:', error);
    }
  };

  const navigateToCityDetails = (destId: string) => {
    setSelectedDestinationId(destId);
    setSelectedItemId(null);
    setCurrentView('city-details');
  };

  const navigateToAddActivity = (itemId?: string) => {
    if (itemId) setSelectedItemId(itemId);
    setCurrentView('add-activity');
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!selectedTripId) return;
    try {
      const isActivity = currentView === 'add-activity' || currentView === 'city-details';
      
      // Determine what to delete. The easiest way is to try the items delete point.
      // Or we can rely on our `transportationBetweenDestinations` logic vs item logic.
      if (currentView === 'add-transportation' && addingTransportationBetween) {
        await api.deleteTransportationBetween(itemId);
      } else {
        await api.deleteItem(itemId);
      }
      await loadTrips(); // Reload after delete to ensure sync
      
      if (currentView === 'add-activity' || currentView === 'add-transportation') {
        setCurrentView('city-details');
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const navigateToAddTransportation = (itemId?: string, prevDestId?: string, index?: number) => {
    if (itemId) setSelectedItemId(itemId);
    if (prevDestId) setAddingTransportationBetween(prevDestId);
    if (index !== undefined) setInsertionIndex(index);
    setCurrentView('add-transportation');
  };

  // Data Handlers
  const handleSaveTrip = async (tripData: Partial<Trip>) => {
    try {
      if (selectedTripId) {
        await api.updateTrip(selectedTripId, tripData);
        await loadTrips(); // Reload all to get updated relations if needed
        navigateToTripDetails(selectedTripId);
      } else {
        const newTrip = await api.createTrip(tripData);
        setTrips([...trips, { ...newTrip, destinations: [] } as Trip]);
        navigateToMyTrips();
      }
    } catch (error) {
      console.error('Failed to save trip:', error);
    }
  };

  const handleSaveDestination = async (destData: Partial<Destination>) => {
    if (!selectedTripId) return;
    
    try {
      if (selectedDestinationId) {
        await api.updateDestination(selectedDestinationId, destData);
      } else {
        await api.createDestination(selectedTripId, destData);
      }
      await loadTrips();
      setCurrentView('trip-details');
    } catch (error) {
      console.error('Failed to save destination:', error);
    }
  };

  const handleSaveItem = async (itemData: any) => {
    if (!selectedTripId) return;

    try {
      if (addingTransportationBetween) {
        // Saving transportation between destinations
        const trip = trips.find(t => t.id === selectedTripId);
        if (!trip) return;
        
        const nextDestIndex = trip.destinations.findIndex(d => d.id === addingTransportationBetween) + 1;
        const nextDestId = trip.destinations[nextDestIndex]?.id;
        if (!nextDestId) return;

        // If it's an update, we might need a different API route.
        // Assuming we just delete and recreate for simplicity if itemId exists
        if (selectedItemId) {
           await api.deleteTransportationBetween(selectedItemId);
        }
        await api.createTransportationBetween(selectedTripId, addingTransportationBetween, nextDestId, itemData);
        
        await loadTrips();
        setAddingTransportationBetween(null);
        setCurrentView('trip-details');
        return;
      }

      if (!selectedDestinationId) return;

      if (selectedItemId) {
        await api.updateItem(selectedItemId, itemData);
      } else {
        await api.createItem(selectedDestinationId, { ...itemData, order_index: insertionIndex || 0 });
      }

      await loadTrips();
      setInsertionIndex(null);
      setCurrentView('city-details');
      
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading your app...</div>;
  }

  if (!session) {
    return <AuthScreen />;
  }

  const handleSignOut = () => {
    supabase.auth.signOut();
  };

  return (
    <div className="antialiased text-primary selection:bg-accent/20 min-h-screen flex flex-col pt-14 relative">
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-6">
        <h1 className="font-semibold text-lg">Wanderer</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session.user.email}</span>
          <button onClick={handleSignOut} className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 text-sm font-medium">
             <LogOut className="w-4 h-4"/> Sign Out
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {currentView === 'my-trips' && (
          <MyTripsScreen 
            key="my-trips"
            trips={trips} 
            onTripClick={navigateToTripDetails}
            onAddTrip={() => navigateToEditTrip()}
            onAddAITrip={() => navigateToAITrip()}
            onDeleteTrip={handleDeleteTrip}
          />
        )}
        
        {currentView === 'trip-details' && selectedTrip && (
          <TripDetailsScreen 
            key="trip-details"
            trip={selectedTrip}
            onBack={navigateToMyTrips}
            onEditTrip={() => navigateToEditTrip(selectedTrip.id)}
            onAddDestination={() => navigateToAddDestination()}
            onAddTransportation={(prevId) => navigateToAddTransportation(undefined, prevId)}
            onDestinationClick={navigateToCityDetails}
            onEditDestination={navigateToAddDestination}
            onDeleteDestination={handleDeleteDestination}
            onItemClick={(id) => {
              // Handle clicking transportation between destinations
              if (selectedTrip.transportationBetweenDestinations) {
                const transportations = Object.values(selectedTrip.transportationBetweenDestinations) as Transportation[];
                const item = transportations.find(i => i.id === id);
                if (item) {
                  const key = Object.keys(selectedTrip.transportationBetweenDestinations).find(k => selectedTrip.transportationBetweenDestinations![k].id === id);
                  if (key) {
                    const [prevId] = key.split('-');
                    navigateToAddTransportation(id, prevId);
                    return;
                  }
                }
              }
            }} 
            onDeleteItem={handleDeleteItem}
          />
        )}

        {currentView === 'edit-trip' && (
          <EditTripScreen 
            key="edit-trip"
            trip={selectedTrip}
            onBack={() => selectedTripId ? setCurrentView('trip-details') : navigateToMyTrips()}
            onSave={handleSaveTrip}
          />
        )}

        {currentView === 'add-destination' && (
          <AddDestinationScreen 
            key="add-destination"
            destination={selectedDestination}
            onBack={() => setCurrentView('trip-details')}
            onSave={handleSaveDestination}
            onDelete={() => handleDeleteDestination(selectedDestination!.id)}
          />
        )}

        {currentView === 'city-details' && selectedDestination && (
          <CityDetailsScreen 
            key="city-details"
            destination={selectedDestination}
            onBack={() => setCurrentView('trip-details')}
            onEditCity={() => navigateToAddDestination(selectedDestination.id)}
            onAddActivity={() => navigateToAddActivity()}
            onAddTransportation={(index) => navigateToAddTransportation(undefined, undefined, index)}
            onItemClick={(id) => {
              const item = selectedDestination.items.find(i => i.id === id);
              if (item?.type === 'activity') navigateToAddActivity(id);
              else navigateToAddTransportation(id);
            }}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {currentView === 'add-activity' && (
          <AddActivityScreen 
            key="add-activity"
            activity={selectedItem as Activity}
            onBack={() => setCurrentView('city-details')}
            onSave={handleSaveItem}
            onDelete={() => handleDeleteItem(selectedItemId!)}
          />
        )}

        {currentView === 'add-transportation' && (
          <AddTransportationScreen 
            key="add-transportation"
            transportation={selectedItem as Transportation}
            onBack={() => setCurrentView('city-details')}
            onSave={handleSaveItem}
            onDelete={() => handleDeleteItem(selectedItemId!)}
          />
        )}
        {currentView === 'ai-wizard' && (
          <AIChatbotScreen
            key="ai-wizard"
            contextTrip={selectedTrip}
            onBack={() => selectedTripId ? setCurrentView('trip-details') : setCurrentView('my-trips')}
            onTripGenerated={(tripId) => {
              loadTrips();
              navigateToTripDetails(tripId);
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Floating AI Copilot Button */}
      {currentView !== 'my-trips' && currentView !== 'ai-wizard' && session && (
        <button 
          onClick={() => setCurrentView('ai-wizard')}
          className="fixed bottom-6 right-6 z-50 p-4 bg-accent hover:bg-accent/90 text-white rounded-full shadow-2xl hover:shadow-accent/40 hover:-translate-y-1 transition-all animate-in fade-in slide-in-from-bottom flex items-center justify-center group"
          title="Ask AI Copilot"
        >
          <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );
}
