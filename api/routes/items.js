import { Router } from 'express';

const router = Router();

// POST /api/items (activities and local transport)
router.post('/', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { destination_id, type, title, description, image, budget, duration, durationUnit, category, order_index } = req.body;
    const { data, error } = await req.supabase
      .from('items')
      .insert([
        { destination_id, type, title, description, image, budget, duration, duration_unit: durationUnit, category, order_index, user_id: req.user.id }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/items/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.id;
    delete updates.created_at;
    delete updates.updated_at;
    delete updates.user_id;
    delete updates.destination_id;
    
    if (updates.durationUnit !== undefined) { updates.duration_unit = updates.durationUnit; delete updates.durationUnit; }

    const { data, error } = await req.supabase
      .from('items')
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

// DELETE /api/items/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await req.supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/items/transportation_between
router.post('/transportation_between', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    // Note: transportation_between_destinations
    const { trip_id, from_destination_id, to_destination_id, type, title, description, budget, duration, durationUnit } = req.body;
    const { data, error } = await req.supabase
      .from('transportations_between_destinations')
      .insert([
        { trip_id, from_destination_id, to_destination_id, type, title, description, budget, duration, duration_unit: durationUnit, user_id: req.user.id }
      ])
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/items/transportation_between/:id
router.delete('/transportation_between/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await req.supabase
      .from('transportations_between_destinations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
