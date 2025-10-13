import express from 'express';
import { pool } from '../event_db.js';
import { z } from 'zod';
import { requireAdmin } from '../middlewares/adminAuth.js';

const router = express.Router();
router.use(requireAdmin);

/* ---------- Categories CRUD ---------- */
const categorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100)
});

router.post('/categories', async (req, res) => {
  try {
    const c = categorySchema.parse(req.body);
    await pool.query('INSERT INTO categories (name, slug) VALUES (?,?)', [c.name, c.slug]);
    res.status(201).json({ ok: true });
  } catch (e) {
    if (e.issues) return res.status(422).json({ error: 'Validation failed', details: e.issues });
    console.error(e); res.status(500).json({ error: 'Server error' });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const c = categorySchema.partial().parse(req.body);
    const [r] = await pool.query('UPDATE categories SET name = COALESCE(?, name), slug = COALESCE(?, slug) WHERE id = ?', [c.name || null, c.slug || null, req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    if (e.issues) return res.status(422).json({ error: 'Validation failed', details: e.issues });
    console.error(e); res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const [r] = await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

/* ---------- Events CRUD ---------- */
const eventSchema = z.object({
  org_id: z.number().int().positive(),
  category_id: z.number().int().positive(),
  name: z.string().min(3).max(255),
  description: z.string().min(10),
  location: z.string().min(2),
  event_date: z.string(),          // YYYY-MM-DD
  start_time: z.string(),          // HH:MM
  end_time: z.string(),
  price: z.number().min(0),
  goal_amount: z.number().min(0).optional(),
  raised_amount: z.number().min(0).optional(),
  suspended: z.number().int().min(0).max(1).optional(),
  image_url: z.string().optional()
});

router.post('/events', async (req, res) => {
  try {
    const e = eventSchema.parse(req.body);
    await pool.query(
      `INSERT INTO events
      (org_id, category_id, name, description, location, event_date, start_time, end_time, price, goal_amount, raised_amount, suspended, image_url)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [e.org_id, e.category_id, e.name, e.description, e.location, e.event_date, e.start_time, e.end_time, e.price, e.goal_amount||0, e.raised_amount||0, e.suspended||0, e.image_url||null]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.issues) return res.status(422).json({ error: 'Validation failed', details: err.issues });
    console.error(err); res.status(500).json({ error: 'Server error' });
  }
});

router.put('/events/:id', async (req, res) => {
  try {
    const e = eventSchema.partial().parse(req.body);
    const [r] = await pool.query(
      `UPDATE events SET
         org_id = COALESCE(?, org_id),
         category_id = COALESCE(?, category_id),
         name = COALESCE(?, name),
         description = COALESCE(?, description),
         location = COALESCE(?, location),
         event_date = COALESCE(?, event_date),
         start_time = COALESCE(?, start_time),
         end_time = COALESCE(?, end_time),
         price = COALESCE(?, price),
         goal_amount = COALESCE(?, goal_amount),
         raised_amount = COALESCE(?, raised_amount),
         suspended = COALESCE(?, suspended),
         image_url = COALESCE(?, image_url)
       WHERE id = ?`,
      [
        e.org_id ?? null, e.category_id ?? null, e.name ?? null, e.description ?? null,
        e.location ?? null, e.event_date ?? null, e.start_time ?? null, e.end_time ?? null,
        e.price ?? null, e.goal_amount ?? null, e.raised_amount ?? null, e.suspended ?? null,
        e.image_url ?? null, req.params.id
      ]
    );
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    if (err.issues) return res.status(422).json({ error: 'Validation failed', details: err.issues });
    console.error(err); res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    const [r] = await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

export default router;
