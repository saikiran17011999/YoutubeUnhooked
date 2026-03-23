# Configuration Module

## Purpose

Centralizes all application configuration and environment variables into a single source of truth.

## Files

- `index.js` - Main configuration object exported for use throughout the application

## Usage

```javascript
const config = require('./config');

// Access configuration
console.log(config.port);
console.log(config.mongodb.uri);
console.log(config.llm.provider);
```

## Environment Variables

All configuration is driven by environment variables. See `.env.example` for the complete list.

### Required in Production

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `YOUTUBE_API_KEY` - YouTube Data API key

### Optional

- `LLM_PROVIDER` - LLM provider to use (openai, anthropic)
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key

## Adding New Configuration

1. Add the environment variable to `.env.example`
2. Add the configuration key to `config/index.js`
3. Document the variable in this README
