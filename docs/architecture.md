# Architecture Overview

## Design Principles

1. **Feature-Based Architecture**: Each feature is self-contained with its own controller, service, routes, and model
2. **Loose Coupling**: Features communicate through well-defined interfaces
3. **Single Responsibility**: Each layer has a specific purpose
4. **Dependency Injection**: Services are injected, not hardcoded
5. **Abstraction Layers**: External services (LLM, YouTube API) are abstracted

## Backend Architecture

### Layer Structure

```
┌─────────────────────────────────────────────┐
│                  Routes                      │
│  (HTTP endpoints, request validation)        │
├─────────────────────────────────────────────┤
│                Controllers                   │
│  (Request handling, response formatting)     │
├─────────────────────────────────────────────┤
│                 Services                     │
│  (Business logic, orchestration)             │
├─────────────────────────────────────────────┤
│              Data Access Layer               │
│  (Models, database operations)               │
├─────────────────────────────────────────────┤
│                 Database                     │
│  (MongoDB)                                   │
└─────────────────────────────────────────────┘
```

### Feature Module Structure

Each feature follows this pattern:

```
/feature-name
├── controller/
│   └── feature.controller.js    # HTTP request handlers
├── service/
│   └── feature.service.js       # Business logic
├── routes/
│   └── feature.routes.js        # Route definitions
├── model/
│   └── feature.model.js         # Mongoose schema
├── index.js                     # Module exports
└── README.md                    # Feature documentation
```

### Data Flow

```
Client Request
     │
     ▼
┌─────────┐
│ Routes  │ ──► Validation Middleware
└────┬────┘
     │
     ▼
┌────────────┐
│ Controller │ ──► Parse request, call service
└─────┬──────┘
      │
      ▼
┌─────────┐
│ Service │ ──► Business logic, call model
└────┬────┘
     │
     ▼
┌───────┐
│ Model │ ──► Database operations
└───────┘
```

## Frontend Architecture

### Component Structure

```
/components
├── common/           # Reusable UI components (Button, Modal, etc.)
├── layout/           # Layout components (Sidebar, Header, etc.)
├── video/            # Video-specific components
├── notes/            # Notes-specific components
└── categories/       # Category-specific components
```

### State Management

- **React Context**: For global state (user, theme)
- **React Query**: For server state (videos, notes)
- **Local State**: For component-specific state

### Service Layer

API calls are abstracted into service modules:

```javascript
// services/videoService.js
export const videoService = {
  getAll: () => api.get('/videos'),
  getById: (id) => api.get(`/videos/${id}`),
  create: (data) => api.post('/videos', data),
  // ...
};
```

## Database Schema

### Collections

1. **videos**: Stored video metadata and status
2. **notes**: User notes linked to videos
3. **categories**: Video categories
4. **users**: User accounts

### Relationships

```
┌─────────┐       ┌─────────┐
│  User   │───────│  Video  │
└─────────┘   1:N └────┬────┘
                       │
              ┌────────┼────────┐
              │        │        │
         ┌────┴───┐ ┌──┴───┐ ┌──┴──────┐
         │ Notes  │ │Status│ │Category │
         └────────┘ └──────┘ └─────────┘
```

## LLM Integration

### Abstraction Layer

```javascript
// LLMService interface
interface LLMService {
  summarize(text: string): Promise<string>;
  generateNotes(content: string): Promise<string>;
}

// Provider implementations
class OpenAIProvider implements LLMService { ... }
class ClaudeProvider implements LLMService { ... }
```

### Provider Selection

Provider is selected via environment configuration:

```env
LLM_PROVIDER=openai  # or 'claude', 'gemini', etc.
```

## Security Considerations

1. **Input Validation**: All inputs validated with Joi/Zod
2. **Rate Limiting**: API rate limiting per user
3. **Authentication**: JWT-based auth
4. **CORS**: Configured for allowed origins
5. **Environment Variables**: Secrets never in code

## Scalability

1. **Horizontal Scaling**: Stateless API design
2. **Caching**: Redis for frequently accessed data
3. **Database Indexing**: Proper MongoDB indexes
4. **Pagination**: All list endpoints paginated
