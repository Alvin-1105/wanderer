import { Trip, Destination, ItineraryItem, Transportation } from '../types';

export const calculateDestinationActualBudget = (destination: Destination): number => {
  if (!destination.items) return 0;
  return destination.items.reduce((total, item) => total + (item.budget || 0), 0);
};

export const calculateTripActualBudget = (trip: Trip): number => {
  let total = 0;

  // Sum up all destination actual budgets (which are all items in that destination)
  if (trip.destinations) {
    trip.destinations.forEach(dest => {
      total += calculateDestinationActualBudget(dest);
    });
  }

  // Sum up all transportations between destinations
  if (trip.transportationBetweenDestinations) {
    Object.values(trip.transportationBetweenDestinations).forEach(transport => {
      total += (transport.budget || 0);
    });
  }

  return total;
};
