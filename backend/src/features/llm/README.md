# LLM Feature

## Purpose

Provides an abstracted interface for LLM (Large Language Model) operations with support for multiple providers.

## Files

```
llm/
├── providers/
│   ├── base.provider.js      # Abstract base class
│   ├── openai.provider.js    # OpenAI implementation
│   ├── anthropic.provider.js # Anthropic/Claude implementation
│   └── index.js              # Provider factory
├── service/
│   └── llm.service.js        # LLM business logic
├── controller/
│   └── llm.controller.js     # HTTP handlers
├── routes/
│   ├── llm.routes.js         # Route definitions
│   └── index.js              # Route exports
├── index.js                  # Module exports
└── README.md                 # This file
```

## API Endpoints

| Method | Endpoint                       | Description              |
|--------|--------------------------------|--------------------------|
| GET    | /llm/health                    | Check LLM availability   |
| GET    | /llm/providers                 | List available providers |
| POST   | /llm/summarize/video/:videoId  | Summarize video          |
| POST   | /llm/summarize/notes/:videoId  | Summarize notes          |
| POST   | /llm/tags/:videoId             | Generate tags            |

## Provider Architecture

### Base Provider Interface

```javascript
class BaseLLMProvider {
  get name()              // Provider name
  isConfigured()          // Check if API key is set
  complete(prompt, options)      // Generate text
  completeJSON(prompt, options)  // Generate JSON
}
```

### Adding a New Provider

1. Create `providers/newprovider.provider.js` extending `BaseLLMProvider`
2. Implement required methods: `name`, `isConfigured()`, `complete()`
3. Register in `providers/index.js`

```javascript
// Example: Adding Gemini
class GeminiProvider extends BaseLLMProvider {
  get name() { return 'gemini'; }
  isConfigured() { return !!this.config.apiKey; }
  async complete(prompt, options) { /* ... */ }
}

// In providers/index.js
const providers = {
  openai: OpenAIProvider,
  anthropic: AnthropicProvider,
  gemini: GeminiProvider  // Add here
};
```

## Configuration

Set provider via environment:

```env
LLM_PROVIDER=openai  # or 'anthropic'

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

## Service Methods

- `summarizeVideo(videoId)` - Generate video summary from metadata
- `summarizeNotes(videoId)` - Consolidate and summarize user notes
- `generateTags(videoId)` - Suggest relevant tags
- `healthCheck()` - Verify LLM is available

## Response Formats

### Video Summary

```json
{
  "summary": "Video summary text...",
  "keyPoints": ["point 1", "point 2"],
  "topics": ["topic 1", "topic 2"]
}
```

### Notes Summary

```json
{
  "summary": "Consolidated notes summary...",
  "themes": ["theme 1", "theme 2"],
  "keyInsights": ["insight 1"],
  "connections": ["connection between notes"]
}
```

## Connection to Other Modules

- **Videos**: Updates video summary via `videoService.updateSummary()`
- **Notes**: Retrieves formatted notes via `noteService.getContentForSummarization()`

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Provider not configured | Missing API key | Set `*_API_KEY` env var |
| Rate limit exceeded | Too many requests | Wait and retry |
| Invalid JSON response | LLM output error | Retry or manual review |
