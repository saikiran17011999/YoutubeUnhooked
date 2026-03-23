# Videos Feature

## Purpose

Manages YouTube video storage, metadata, and user interactions (status, categories, tags).

## Files

```
videos/
├── controller/
│   └── video.controller.js   # HTTP request handlers
├── service/
│   └── video.service.js      # Business logic
├── routes/
│   ├── video.routes.js       # Route definitions
│   └── index.js              # Route exports
├── model/
│   └── video.model.js        # Mongoose schema
├── index.js                  # Module exports
└── README.md                 # This file
```

## API Endpoints

| Method | Endpoint                  | Description                    |
|--------|---------------------------|--------------------------------|
| GET    | /videos                   | List videos with filters       |
| GET    | /videos/stats             | Get video statistics           |
| GET    | /videos/:id               | Get single video               |
| POST   | /videos                   | Add video from URL             |
| POST   | /videos/playlist          | Import playlist                |
| PATCH  | /videos/:id/status        | Update watch status            |
| PATCH  | /videos/:id/category      | Change category                |
| PATCH  | /videos/:id/tags          | Update user tags               |
| DELETE | /videos/:id               | Delete video                   |

## Data Model

```javascript
{
  youtubeId: String,        // YouTube video ID
  title: String,            // Video title
  description: String,      // Video description
  thumbnail: String,        // Thumbnail URL
  channelTitle: String,     // Channel name
  duration: String,         // ISO 8601 duration

  category: ObjectId,       // Reference to Category
  status: {
    watched: Boolean,
    favorite: Boolean,
    watchAgain: Boolean
  },

  summary: String,          // AI-generated summary
  keyPoints: [String],      // Key points
  userTags: [String]        // User-defined tags
}
```

## Service Methods

- `getAll(options)` - Get paginated videos with filters
- `getById(id)` - Get single video by ID
- `addFromUrl(url, categoryId)` - Add video from YouTube URL
- `addFromPlaylist(url, categoryId)` - Import videos from playlist
- `updateStatus(id, status)` - Update watch/favorite status
- `updateCategory(id, categoryId)` - Change video category
- `updateTags(id, tags)` - Update user tags
- `updateSummary(id, summaryData)` - Save AI summary
- `delete(id)` - Delete video

## Connection to Other Modules

- **Categories**: Videos reference categories via `category` field
- **Notes**: Notes reference videos via `videoId` field
- **LLM**: LLM service calls `updateSummary` after generating summaries

## Query Examples

```javascript
// Get all favorite videos
await videoService.getAll({ status: 'favorite' });

// Search videos
await videoService.getAll({ search: 'react tutorial' });

// Filter by category
await videoService.getAll({ category: 'categoryId' });
```
