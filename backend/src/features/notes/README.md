# Notes Feature

## Purpose

Manages user notes attached to videos, including timestamped notes, pinning, and search functionality.

## Files

```
notes/
├── controller/
│   └── note.controller.js    # HTTP request handlers
├── service/
│   └── note.service.js       # Business logic
├── routes/
│   ├── note.routes.js        # Standalone note routes
│   └── index.js              # Route exports
├── model/
│   └── note.model.js         # Mongoose schema
├── index.js                  # Module exports
└── README.md                 # This file
```

## API Endpoints

### Nested Routes (via Video)

| Method | Endpoint                        | Description          |
|--------|--------------------------------|----------------------|
| GET    | /videos/:videoId/notes         | Get video's notes    |
| POST   | /videos/:videoId/notes         | Create note          |

### Standalone Routes

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /notes/search         | Search all notes     |
| GET    | /notes/:id            | Get single note      |
| PUT    | /notes/:id            | Update note          |
| PATCH  | /notes/:id/pin        | Toggle pin status    |
| DELETE | /notes/:id            | Delete note          |

## Data Model

```javascript
{
  videoId: ObjectId,        // Reference to Video
  content: String,          // Note content (max 10000 chars)
  timestamp: Number,        // Seconds into video (null for general)
  type: String,             // 'general', 'timestamp', 'highlight', 'question'
  color: String,            // Highlight color
  isPinned: Boolean         // Pinned to top
}
```

## Note Types

- **general**: General observation, no specific timestamp
- **timestamp**: Note tied to specific moment in video
- **highlight**: Important highlight/quote
- **question**: Question or point to research

## Service Methods

- `getByVideoId(videoId, options)` - Get all notes for a video
- `getById(id)` - Get single note
- `create(videoId, data)` - Create new note
- `update(id, data)` - Update note
- `togglePin(id)` - Toggle pinned status
- `delete(id)` - Delete note
- `deleteByVideoId(videoId)` - Delete all notes for video
- `getContentForSummarization(videoId)` - Get formatted notes for LLM
- `search(query, options)` - Search notes across videos

## Connection to Other Modules

- **Videos**: Notes reference videos via `videoId` field
- **LLM**: `getContentForSummarization()` provides formatted notes for AI summarization

## Usage Examples

```javascript
// Create a timestamped note
await noteService.create(videoId, {
  content: 'Key concept explained here',
  timestamp: 325,
  type: 'timestamp'
});

// Search notes
const results = await noteService.search('react hooks');

// Get notes formatted for LLM
const content = await noteService.getContentForSummarization(videoId);
// Returns: "[5:25] Note 1\n\n[10:30] Note 2"
```
