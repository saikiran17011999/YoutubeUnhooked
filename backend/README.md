# Video Knowledge Manager - Backend

Node.js + Express.js + SQLite API for the Personal Video Knowledge Manager.

## 🎯 Why SQLite?

| Advantage | Benefit |
|-----------|---------|
| **Zero setup** | No database server needed |
| **Portable** | Single file, easy backup |
| **Fast** | Embedded, no network latency |
| **Reliable** | ACID compliant, battle-tested |
| **Simple deployment** | Just copy the file |

## 🏗️ Architecture

```
src/
├── features/           # Feature-based modules
│   ├── videos/         # Video management
│   ├── notes/          # Notes system
│   ├── categories/     # Category management
│   └── llm/            # LLM abstraction layer
├── middleware/         # Express middleware
├── config/             # App configuration
├── utils/              # Shared utilities
└── database/           # SQLite connection & schema
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+

### Installation

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your API keys

# Seed default categories
npm run seed

# Start development server
npm run dev
```

The database file (`data/videos.db`) is created automatically.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_PATH` | SQLite database file path | No (default: ./data/videos.db) |
| `YOUTUBE_API_KEY` | YouTube Data API key | Yes |
| `LLM_PROVIDER` | LLM provider (openai/anthropic) | No |
| `OPENAI_API_KEY` | OpenAI API key | If using OpenAI |

## 📚 API Documentation

See [docs/api-contracts.md](../docs/api-contracts.md) for full API documentation.

### Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/videos` | GET | List videos |
| `/api/v1/videos` | POST | Add video from URL |
| `/api/v1/videos/:id` | GET | Get video details |
| `/api/v1/videos/:id/status` | PATCH | Update video status |
| `/api/v1/videos/:videoId/notes` | GET/POST | Video notes |
| `/api/v1/categories` | GET/POST | Categories |
| `/api/v1/llm/summarize/video/:id` | POST | AI summarize |

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📁 Database

### Schema

```sql
categories (id, name, slug, color, icon, is_default)
videos (id, youtube_id, title, category_id, watched, favorite, summary)
notes (id, video_id, content, timestamp, is_pinned)
```

### Backup

Simply copy the database file:
```bash
cp data/videos.db backups/videos-backup.db
```

### Reset

```bash
rm data/videos.db
npm run seed
```

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server (nodemon) |
| `npm test` | Run tests |
| `npm run seed` | Seed default categories |
| `npm run lint` | Run ESLint |

## 📄 License

MIT
