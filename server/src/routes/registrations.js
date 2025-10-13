import express from 'express';
import { pool } from '../event_db.js';
import { z } from 'zod';

const router = express.Router();

const createSchema = z.object({
  event_id: z.number().int().positive(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  tickets: z.number().int().min(1).max(20)
});

// POST /api/registrations  (client ticket purchase)
router.post('/', async (req, res) => {
  try {
    const payload = createSchema.parse(req.body);
    const [ev] = await pool.query('SELECT id, suspended FROM events WHERE id = ?', [payload.event_id]);
    if (!ev.length || ev[0].suspended) {
      return res.status(400).json({ error: 'Invalid or suspended event' });
    }
    await pool.query(
      'INSERT INTO registrations (event_id, name, email, tickets) VALUES (?,?,?,?)',
      [payload.event_id, payload.name, payload.email, payload.tickets]
    );
    return res.status(201).json({ ok: true });
  } catch (e) {
    if (e?.issues) return res.status(422).json({ error: 'Validation failed', details: e.issues });
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/registrations?event_id=1&sort=desc
router.get('/', async (req, res) => {
  try {
    const eventId = Number(req.query.event_id);
    if (!eventId) return res.status(400).json({ error: 'event_id required' });
    const sort = (req.query.sort || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const [rows] = await pool.query(
      `SELECT id, name, email, tickets, created_at
       FROM registrations
       WHERE event_id = ?
       ORDER BY created_at ${sort}
       LIMIT 200`,
      [eventId]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
