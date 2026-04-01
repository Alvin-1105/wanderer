import { Router } from 'express';

const router = Router();

// POST /api/destinations
router.post('/', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { trip_id, city, country, description, coverImage, budget, duration } = req.body;
    const { data, error } = await req.supabase
      .from('destinations')
      .insert([
        { trip_id, city, country, description, cover_image: coverImage, budget, duration, user_id: req.user.id }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/destinations/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.coverImage !== undefined) { updates.cover_image = updates.coverImage; delete updates.coverImage; }

    const { data, error } = await req.supabase
      .from('destinations')
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

// DELETE /api/destinations/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await req.supabase
      .from('destinations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
