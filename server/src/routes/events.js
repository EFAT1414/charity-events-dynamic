import express from 'express';
import { pool } from '../event_db.js';
import { z } from 'zod';

const router = express.Router();

const searchSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['upcoming','past','all']).optional().default('upcoming')
});

router.get('/', async (req, res) => {
  try {
    const parsed = searchSchema.parse(req.query);
    const filters = ['e.suspended = 0', 'o.active = 1'];
    const params = [];

    if (parsed.location) {
      filters.push('e.location LIKE ?');
      params.push(`%${parsed.location}%`);
    }
    if (parsed.category) {
      if (/^\d+$/.test(parsed.category)) {
        filters.push('c.id = ?');
        params.push(Number(parsed.category));
      } else {
        filters.push('c.slug = ?');
        params.push(parsed.category);
      }
    }
    if (parsed.from) {
      filters.push('e.event_date >= ?');
      params.push(parsed.from);
    }
    if (parsed.to) {
      filters.push('e.event_date <= ?');
      params.push(parsed.to);
    }

    let having = '';
    if (parsed.status !== 'all') {
      having = parsed.status === 'upcoming' ? 'AND e.event_date >= CURDATE()' : 'AND e.event_date < CURDATE()';
    }

    const where = filters.length ? 'WHERE ' + filters.join(' AND ') : '';
    const sql = `
      SELECT e.id, e.name, e.description, e.location, e.event_date, e.start_time, e.end_time,
             e.price, e.goal_amount, e.raised_amount, e.image_url,
             c.id AS category_id, c.name AS category_name, c.slug AS category_slug,
             o.id AS org_id, o.name AS org_name,
             CASE WHEN e.event_date < CURDATE() THEN 'past' ELSE 'upcoming' END AS status
      FROM events e
      JOIN categories c ON e.category_id = c.id
      JOIN organisations o ON e.org_id = o.id
      ${where}
      ${having}
      ORDER BY e.event_date ASC
      LIMIT 300;
    `;
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid query parameters' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const sql = `
      SELECT e.*, 
             c.name AS category_name, c.slug AS category_slug,
             o.name AS org_name, o.website AS org_website, o.email AS org_email, o.phone AS org_phone,
             CASE WHEN e.event_date < CURDATE() THEN 'past' ELSE 'upcoming' END AS status
      FROM events e
      JOIN categories c ON e.category_id = c.id
      JOIN organisations o ON e.org_id = o.id
      WHERE e.id = ? AND e.suspended = 0 AND o.active = 1
    `;
    const [events] = await pool.query(sql, [req.params.id]);
    if (!events.length) return res.status(404).json({ error: 'Event not found' });
    res.json(events[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
