import { Trip, TripStatus } from '../types';

export const MOCK_TRIPS: Trip[] = [
  {
    id: '1',
    title: 'Autumn in Kyoto',
    description: 'A serene journey through the ancient temples and vibrant maple forests of Japan.',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000',
    startDate: '2025-11-10',
    endDate: '2025-11-20',
    status: TripStatus.Planning,
    budget: 3500,
    duration: 10,
    destinations: [
      {
        id: 'd1',
        city: 'Kyoto',
        country: 'Japan',
        description: 'The heart of traditional Japan, famous for its numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.',
        coverImage: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=1000',
        budget: 2000,
        duration: 5,
        items: [
          {
            id: 'a1',
            type: 'activity',
            title: 'Fushimi Inari Shrine Hike',
            description: 'Walk through thousands of vermilion torii gates.',
            image: 'https://images.unsplash.com/photo-1475116127127-e3ce09ee84e1?auto=format&fit=crop&q=80&w=500',
            budget: 0,
            duration: 3,
            category: 'Sightseeing'
          },
          {
            id: 't1',
            type: 'transportation',
            title: 'Shinkansen from Tokyo',
            description: 'Bullet train ride with views of Mt. Fuji.',
            budget: 150,
            duration: 2.5,
            durationUnit: 'hours'
          }
        ]
      },
      {
        id: 'd2',
        city: 'Nara',
        country: 'Japan',
        description: 'Known for its deer park and the giant Buddha statue at Todai-ji temple.',
        coverImage: 'https://images.unsplash.com/photo-1583329241334-080569426f0e?auto=format&fit=crop&q=80&w=1000',
        budget: 500,
        duration: 2,
        items: []
      }
    ]
  },
  {
    id: '2',
    title: 'Amalfi Coast Retreat',
    description: 'Sun-drenched cliffs, turquoise waters, and the finest Italian cuisine.',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1000',
    startDate: '2025-06-15',
    endDate: '2025-06-25',
    status: TripStatus.Current,
    budget: 5000,
    duration: 10,
    destinations: []
  }
];
