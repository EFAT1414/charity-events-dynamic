import { pool } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const schema = fs.readFileSync(path.join(__dirname, '../sql/schema.sql'), 'utf8');
  const seed = fs.readFileSync(path.join(__dirname, '../sql/seed.sql'), 'utf8');
  for (const stmt of schema.split(';').map(s => s.trim()).filter(Boolean)) {
    await pool.query(stmt);
  }
  for (const stmt of seed.split(';').map(s => s.trim()).filter(Boolean)) {
    await pool.query(stmt);
  }
  console.log('Database set up with sample data.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
