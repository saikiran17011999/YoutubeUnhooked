# API Contracts

## Base URL

```
Development: http://localhost:5000/api/v1
Production: https://api.yourdomain.com/api/v1
```

## Authentication

All authenticated endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

## Videos API

### Get All Videos

```http
GET /videos
```

**Query Parameters:**
| Parameter  | Type    | Description                           |
|------------|---------|---------------------------------------|
| page       | number  | Page number (default: 1)              |
| limit      | number  | Items per page (default: 20)          |
| category   | string  | Filter by category ID                 |
| status     | string  | Filter by status (watched, favorite)  |
| search     | string  | Search in title/description           |
| sortBy     | string  | Sort field (createdAt, title)         |
| order      | string  | Sort order (asc, desc)                |

**Response:**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "_id": "video_id",
        "youtubeId": "dQw4w9WgXcQ",
        "title": "Video Title",
        "description": "Video description",
        "thumbnail": "https://img.youtube.com/...",
        "channelTitle": "Channel Name",
        "duration": "PT5M30S",
        "category": {
          "_id": "category_id",
          "name": "AI"
        },
        "status": {
          "watched": false,
          "favorite": true,
          "watchAgain": false
        },
        "notesCount": 5,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### Get Single Video

```http
GET /videos/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "video_id",
    "youtubeId": "dQw4w9WgXcQ",
    "title": "Video Title",
    "description": "Full video description...",
    "thumbnail": "https://img.youtube.com/...",
    "channelTitle": "Channel Name",
    "channelId": "UC...",
    "duration": "PT5M30S",
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "category": { "_id": "category_id", "name": "AI" },
    "tags": ["tag1", "tag2"],
    "status": {
      "watched": false,
      "favorite": true,
      "watchAgain": false
    },
    "summary": "AI-generated summary...",
    "notes": [
      {
        "_id": "note_id",
        "content": "Note content",
        "timestamp": 120,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Add Video

```http
POST /videos
```

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "categoryId": "category_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Video added successfully",
  "data": { /* video object */ }
}
```

### Add Playlist

```http
POST /videos/playlist
```

**Request Body:**
```json
{
  "url": "https://www.youtube.com/playlist?list=PLxxx",
  "categoryId": "category_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Playlist imported successfully",
  "data": {
    "imported": 15,
    "failed": 0,
    "videos": [ /* video objects */ ]
  }
}
```

### Update Video Status

```http
PATCH /videos/:id/status
```

**Request Body:**
```json
{
  "watched": true,
  "favorite": false,
  "watchAgain": true
}
```

### Update Video Category

```http
PATCH /videos/:id/category
```

**Request Body:**
```json
{
  "categoryId": "new_category_id"
}
```

### Delete Video

```http
DELETE /videos/:id
```

---

## Notes API

### Get Notes for Video

```http
GET /videos/:videoId/notes
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "note_id",
      "videoId": "video_id",
      "content": "Note content here",
      "timestamp": 120,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Add Note

```http
POST /videos/:videoId/notes
```

**Request Body:**
```json
{
  "content": "My note content",
  "timestamp": 120
}
```

### Update Note

```http
PUT /notes/:id
```

**Request Body:**
```json
{
  "content": "Updated note content"
}
```

### Delete Note

```http
DELETE /notes/:id
```

---

## Categories API

### Get All Categories

```http
GET /categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "category_id",
      "name": "AI",
      "slug": "ai",
      "color": "#FF5733",
      "icon": "brain",
      "videoCount": 25,
      "isDefault": true
    }
  ]
}
```

### Create Category

```http
POST /categories
```

**Request Body:**
```json
{
  "name": "New Category",
  "color": "#FF5733",
  "icon": "folder"
}
```

### Update Category

```http
PUT /categories/:id
```

### Delete Category

```http
DELETE /categories/:id
```

---

## LLM API

### Generate Video Summary

```http
POST /llm/summarize/video/:videoId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "AI-generated summary of the video...",
    "keyPoints": [
      "Key point 1",
      "Key point 2"
    ],
    "topics": ["topic1", "topic2"]
  }
}
```

### Summarize Notes

```http
POST /llm/summarize/notes/:videoId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Consolidated summary of all notes...",
    "highlights": ["highlight 1", "highlight 2"]
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { /* optional additional info */ }
  }
}
```

### Common Error Codes

| Code               | HTTP Status | Description                |
|--------------------|-------------|----------------------------|
| VALIDATION_ERROR   | 400         | Invalid request data       |
| UNAUTHORIZED       | 401         | Missing/invalid auth token |
| FORBIDDEN          | 403         | Insufficient permissions   |
| NOT_FOUND          | 404         | Resource not found         |
| DUPLICATE_ENTRY    | 409         | Resource already exists    |
| RATE_LIMITED       | 429         | Too many requests          |
| INTERNAL_ERROR     | 500         | Server error               |
