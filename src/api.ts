import { Trip, Destination, ItineraryItem, Transportation } from './types';
import { supabase } from './lib/supabaseClient';

const toCamelCase = (str: string) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
const transformKeys = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map((v) => transformKeys(v));
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      if (key === 'transportationBetweenDestinations') {
        const transformedObj: any = {};
        for (const k in obj[key]) transformedObj[k] = transformKeys(obj[key][k]);
        acc[key] = transformedObj;
      } else {
        acc[toCamelCase(key)] = transformKeys(obj[key]);
      }
      return acc;
    }, {} as any);
  }
  return obj;
};

const API_BASE = '/api';

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {})
  };
};

export const fetchTrips = async (): Promise<Trip[]> => {
  const res = await fetch(`${API_BASE}/trips`, {
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch trips');
  return transformKeys(await res.json());
};

export const createTrip = async (tripData: Partial<Trip>): Promise<Trip> => {
  const res = await fetch(`${API_BASE}/trips`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(tripData),
  });
  if (!res.ok) throw new Error('Failed to create trip');
  return transformKeys(await res.json());
};

export const updateTrip = async (id: string, tripData: Partial<Trip>): Promise<Trip> => {
  const res = await fetch(`${API_BASE}/trips/${id}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(tripData),
  });
  if (!res.ok) throw new Error('Failed to update trip');
  return transformKeys(await res.json());
};

export const deleteTrip = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/trips/${id}`, { 
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete trip');
};

export const createDestination = async (tripId: string, destData: Partial<Destination>): Promise<Destination> => {
  const res = await fetch(`${API_BASE}/destinations`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ ...destData, trip_id: tripId }),
  });
  if (!res.ok) throw new Error('Failed to create destination');
  return transformKeys(await res.json());
};

export const updateDestination = async (id: string, destData: Partial<Destination>): Promise<Destination> => {
  const res = await fetch(`${API_BASE}/destinations/${id}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(destData),
  });
  if (!res.ok) throw new Error('Failed to update destination');
  return transformKeys(await res.json());
};

export const deleteDestination = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/destinations/${id}`, { 
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete destination');
};

export const createItem = async (destinationId: string, itemData: any): Promise<ItineraryItem> => {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ ...itemData, destination_id: destinationId }),
  });
  if (!res.ok) throw new Error('Failed to create item');
  return transformKeys(await res.json());
};

export const updateItem = async (id: string, itemData: any): Promise<ItineraryItem> => {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(itemData),
  });
  if (!res.ok) throw new Error('Failed to update item');
  return transformKeys(await res.json());
};

export const deleteItem = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/items/${id}`, { 
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete item');
};

export const createTransportationBetween = async (tripId: string, fromDestId: string, toDestId: string, itemData: any): Promise<Transportation> => {
  const res = await fetch(`${API_BASE}/items/transportation_between`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ ...itemData, trip_id: tripId, from_destination_id: fromDestId, to_destination_id: toDestId }),
  });
  if (!res.ok) throw new Error('Failed to create transportation between');
  return transformKeys(await res.json());
};

export const deleteTransportationBetween = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/items/transportation_between/${id}`, { 
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete transportation between');
};
