# Database Module

## Purpose

Manages SQLite database connection and provides data access utilities.

## Files

- `connection.js` - Database connection and helper functions
- `schema.sql` - Database schema definitions
- `seed.js` - Database seeding script
- `index.js` - Module exports

## Usage

```javascript
const { getDatabase, initializeDatabase, all, get, run, generateId } = require('./database');

// Initialize database (creates tables)
initializeDatabase();

// Get database instance
const db = getDatabase();

// Helper functions
const videos = all('SELECT * FROM videos');
const video = get('SELECT * FROM videos WHERE id = ?', [id]);
const result = run('INSERT INTO videos ...', params);
const id = generateId(); // UUID
```

## Schema

### Tables

**categories**
```sql
- id (TEXT, PRIMARY KEY)
- name (TEXT, UNIQUE)
- slug (TEXT, UNIQUE)
- description (TEXT)
- color (TEXT)
- icon (TEXT)
- is_default (INTEGER)
- display_order (INTEGER)
```

**videos**
```sql
- id (TEXT, PRIMARY KEY)
- youtube_id (TEXT, UNIQUE)
- title (TEXT)
- description (TEXT)
- thumbnail (TEXT)
- channel_title (TEXT)
- duration (TEXT)
- category_id (TEXT, FK -> categories)
- watched, favorite, watch_again (INTEGER)
- summary, key_points, topics (TEXT/JSON)
```

**notes**
```sql
- id (TEXT, PRIMARY KEY)
- video_id (TEXT, FK -> videos)
- content (TEXT)
- timestamp (INTEGER)
- type (TEXT)
- is_pinned (INTEGER)
```

## Features

- **WAL Mode**: Enabled for better concurrent read performance
- **Foreign Keys**: Enforced for data integrity
- **Full-Text Search**: videos_fts table for searching titles/descriptions
- **Auto Triggers**: Keep FTS index updated

## Seeding

```bash
npm run seed
```

Creates default categories:
- AI, System Design, Cybersecurity, Badminton Education, Miscellaneous
