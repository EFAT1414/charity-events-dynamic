import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import eventsRouter from './routes/events.js';
import registrationsRouter from './routes/registrations.js';
import categoriesRouter from './routes/categories.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../../public')));

// Required GET endpoints for Assessment 2
app.use('/api/events', eventsRouter);
app.use('/api/categories', categoriesRouter);

// Optional POST (keep or comment out for strict A2)
app.use('/api/registrations', registrationsRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
