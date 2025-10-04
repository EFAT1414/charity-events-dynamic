# Charity Events Dynamic Website

A Node.js + MySQL dynamic site for managing charity events. Includes:
- Home page showing upcoming and past events (suspended events hidden)
- Search page with filters (date range, location, category, status)
- Event details page with full description, ticket price, registration form
- Goal vs. progress bar (goal/raised), live registrations/tickets count
- REST API consumed by the client

## Tech Stack
- Node.js (Express), MySQL (mysql2), Zod for validation
- Client: HTML + Bootstrap + vanilla JS (fetch + DOM)

## Quick Start

1. Install dependencies
```bash
cd server
cp .env.example .env  # fill in DB_* and PORT if needed
npm install
```
2. Create the database and seed sample data
```bash
# Ensure the database defined in DB_NAME exists (create manually or run:)
# CREATE DATABASE charity_events_db;
node src/db-setup.js
```
3. Run the server
```bash
npm run dev
```
Open http://localhost:3000

## API
- `GET /api/events?from=YYYY-MM-DD&to=YYYY-MM-DD&location=Perth&category=Gala&status=upcoming|past|all`
- `GET /api/events/:id`
- `POST /api/registrations` JSON body: `{ event_id, name, email, tickets }`

## Notes
- Suspended events (`suspended=1`) are not returned by the API and never shown on the site.
- Status (past/upcoming) is calculated based on `event_date` vs today.

## Assessment Mapping
- **NodeJS, HTML, JS, DOM, MySQL**: satisfied (Express server + MySQL schema, vanilla JS DOM updates)
- **Data integration via APIs**: client uses `fetch` to consume `/api/...` routes
- **Home**: separates upcoming/past; hides suspended
- **Search**: filters by date, location, category, status
- **Event details**: description, time/place, price, registration form, goal vs progress
- **Navigation**: present across pages

