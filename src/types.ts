export enum TripStatus {
  Current = 'Current',
  Planning = 'Planning Phase',
  Past = 'Past Trip'
}

export interface Activity {
  id: string;
  type: 'activity';
  title: string;
  description: string;
  image: string;
  budget: number;
  duration: number;
  category: string;
}

export interface Transportation {
  id: string;
  type: 'transportation';
  title: string;
  description: string;
  budget: number;
  duration: number;
  durationUnit: string;
}

export type ItineraryItem = Activity | Transportation;

export interface Destination {
  id: string;
  city: string;
  country: string;
  description: string;
  coverImage: string;
  budget: number;
  duration: number;
  items: ItineraryItem[];
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  startDate?: string;
  endDate?: string;
  status: TripStatus;
  budget: number;
  duration: number;
  destinations: Destination[];
  transportationBetweenDestinations?: { [key: string]: Transportation }; // key could be "destId1-destId2"
}
