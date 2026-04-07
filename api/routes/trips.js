import { Router } from 'express';

const router = Router();

// GET /api/trips
router.get('/', async (req, res) => {
  try {
    const { data: trips, error } = await req.supabase
      .from('trips')
      .select(`
        *,
        destinations (
          *,
          items (
            *
          )
        ),
        transportations_between_destinations (
          *
        )
      `)
      .order('start_date', { ascending: true });

    if (error) throw error;
    
    // Process transportations into an object keyed by from_dest-to_dest as expected by frontend
    const formattedTrips = trips.map(trip => {
      const transpObj = {};
      if (trip.transportations_between_destinations) {
        trip.transportations_between_destinations.forEach(t => {
          transpObj[`${t.from_destination_id}-${t.to_destination_id}`] = t;
        });
      }
      return {
        ...trip,
        transportationBetweenDestinations: transpObj
      }
    });

    res.json(formattedTrips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/trips
router.post('/', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    const { title, description, coverImage, startDate, endDate, status, budget, duration } = req.body;
    const { data, error } = await req.supabase
      .from('trips')
      .insert([
        { title, description, cover_image: coverImage, start_date: startDate, end_date: endDate, status, budget, duration, user_id: req.user.id }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/trips/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.id;
    delete updates.created_at;
    delete updates.createdAt;
    delete updates.updated_at;
    delete updates.updatedAt;
    delete updates.user_id;
    delete updates.userId;
    delete updates.destinations;
    delete updates.transportationBetweenDestinations;
    
    if (updates.coverImage !== undefined) { updates.cover_image = updates.coverImage; delete updates.coverImage; }
    if (updates.startDate !== undefined) { updates.start_date = updates.startDate; delete updates.startDate; }
    if (updates.endDate !== undefined) { updates.end_date = updates.endDate; delete updates.endDate; }

    const { data, error } = await req.supabase
      .from('trips')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/trips/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await req.supabase
      .from('trips')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
