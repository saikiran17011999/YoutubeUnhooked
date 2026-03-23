# Utils Module

## Purpose

Provides shared utility functions used across multiple features.

## Files

- `youtube.js` - YouTube URL parsing and API interactions
- `response.js` - Standardized API response formatters
- `index.js` - Module exports

## YouTube Utilities

### URL Parsing

```javascript
const { extractVideoId, extractPlaylistId, isPlaylistUrl } = require('./utils');

const videoId = extractVideoId('https://youtube.com/watch?v=dQw4w9WgXcQ');
// Returns: 'dQw4w9WgXcQ'

const playlistId = extractPlaylistId('https://youtube.com/playlist?list=PLxxx');
// Returns: 'PLxxx'

const isPlaylist = isPlaylistUrl(url);
// Returns: true/false
```

### API Interactions

```javascript
const { fetchVideoDetails, fetchPlaylistItems } = require('./utils');

// Fetch single video metadata
const video = await fetchVideoDetails('dQw4w9WgXcQ');

// Fetch all videos from a playlist
const videoIds = await fetchPlaylistItems('PLxxx', 50);
```

## Response Utilities

### Standard Responses

```javascript
const { sendSuccess, sendCreated, sendPaginated } = require('./utils');

// Success response
sendSuccess(res, { video }, 'Video retrieved');

// Created response (201)
sendCreated(res, { video }, 'Video added');

// Paginated response
sendPaginated(res, videos, { page: 1, limit: 20, total: 100 });
```

### Pagination Helper

```javascript
const { buildPaginationOptions } = require('./utils');

const options = buildPaginationOptions(req.query);
// Returns: { skip, limit, sort, page }
```

## Connection to Other Modules

- Used by video service for YouTube API interactions
- Used by all controllers for response formatting
