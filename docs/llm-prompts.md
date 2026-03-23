# LLM Prompts Documentation

This document contains all prompts used for LLM-powered features.

## Video Summarization

### Primary Summary Prompt

```
You are an expert at summarizing educational and technical video content.

Given the following video information:
- Title: {{title}}
- Description: {{description}}
- Channel: {{channelTitle}}
- Duration: {{duration}}
- Tags: {{tags}}

Please provide:
1. A concise summary (2-3 paragraphs) of what this video is likely about
2. 3-5 key points or takeaways
3. Main topics covered

Format your response as JSON:
{
  "summary": "string",
  "keyPoints": ["string"],
  "topics": ["string"]
}

Focus on being informative and accurate based on the available metadata.
```

### With Transcript Prompt (Enhanced)

```
You are an expert at summarizing educational and technical video content.

Video Information:
- Title: {{title}}
- Channel: {{channelTitle}}

Transcript:
{{transcript}}

Please provide a comprehensive summary that includes:
1. A detailed summary (3-4 paragraphs)
2. Key points with timestamps where mentioned
3. Main concepts explained
4. Any actionable takeaways

Format your response as JSON:
{
  "summary": "string",
  "keyPoints": [
    { "point": "string", "timestamp": "HH:MM:SS" }
  ],
  "concepts": ["string"],
  "takeaways": ["string"]
}
```

## Notes Summarization

### Consolidate Notes Prompt

```
You are helping a user organize and summarize their personal notes taken while watching a video.

Video Title: {{videoTitle}}

User Notes:
{{notes}}

Please:
1. Create a consolidated summary of all the notes
2. Identify the main themes or topics
3. Extract key insights the user found important
4. Suggest any connections between different notes

Format your response as JSON:
{
  "summary": "string",
  "themes": ["string"],
  "keyInsights": ["string"],
  "connections": ["string"]
}

Maintain the user's voice and intent while organizing their thoughts.
```

## Chat with Notes (Future Feature)

### Context-Aware Q&A Prompt

```
You are a helpful assistant that can answer questions based on the user's video notes.

Context:
Video Title: {{videoTitle}}
Video Summary: {{videoSummary}}
User Notes: {{notes}}

User Question: {{question}}

Instructions:
- Answer based primarily on the user's notes
- Reference specific notes when applicable
- If the answer isn't in the notes, say so but provide relevant context from the video summary
- Keep answers concise but informative
```

## Prompt Best Practices

### Temperature Settings

| Feature              | Temperature | Reason                              |
|---------------------|-------------|-------------------------------------|
| Video Summary       | 0.3         | Factual, consistent output          |
| Notes Summary       | 0.4         | Some creativity for consolidation   |
| Chat Q&A            | 0.5         | Balanced for conversational tone    |
| Tag Generation      | 0.6         | Creative but relevant suggestions   |

### Token Limits

| Feature              | Max Input  | Max Output |
|---------------------|------------|------------|
| Video Summary       | 4000       | 1000       |
| Notes Summary       | 8000       | 1500       |
| Chat Q&A            | 6000       | 500        |

### Error Handling

If the LLM returns an invalid response:
1. Attempt to parse partial JSON
2. Retry with more explicit formatting instructions
3. Fall back to simpler prompt
4. Return generic error message to user

### Rate Limiting Strategy

- Per-user limit: 10 summaries per hour
- Batch operations: Queue and process sequentially
- Cache responses for identical inputs (1 hour TTL)
