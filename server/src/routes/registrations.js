import express from 'express';
import { pool } from '../event_db.js';
import { z } from 'zod';

const router = express.Router();

const payloadSchema = z.object({
  event_id: z.number(),
  name: z.string().min(1),
  email: z.string().email(),
  tickets: z.number().int().min(1).max(20)
});

router.post('/', async (req, res) => {
  try {
    const body = payloadSchema.parse(req.body);
    // ensure event exists and not suspended/past if you want to restrict
    const [ev] = await pool.query('SELECT id, suspended FROM events WHERE id = ?', [body.event_id]);
    if (!ev.length || ev[0].suspended) return res.status(400).json({ error: 'Invalid event' });
    await pool.query('INSERT INTO registrations (event_id, name, email, tickets) VALUES (?, ?, ?, ?)', 
      [body.event_id, body.name, body.email, body.tickets]);
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Invalid payload' });
  }
});

export default router;
