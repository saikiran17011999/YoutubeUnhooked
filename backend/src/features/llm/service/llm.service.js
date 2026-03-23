/**
 * LLM Service
 * Business logic for LLM operations (summarization, etc.)
 */

const { getProvider } = require('../providers');
const videoService = require('../../videos/service/video.service');
const noteService = require('../../notes/service/note.service');
const { errors } = require('../../../middleware');

class LLMService {
  /**
   * Get the current LLM provider
   */
  getProvider() {
    return getProvider();
  }

  /**
   * Summarize a video based on its metadata
   */
  async summarizeVideo(videoId) {
    // Get video details
    const video = await videoService.getById(videoId);

    if (!video) {
      throw errors.notFound('Video not found');
    }

    // Build prompt with video metadata
    const prompt = this.buildVideoSummaryPrompt(video);

    // Get summary from LLM
    const provider = this.getProvider();
    const result = await provider.completeJSON(prompt, {
      temperature: 0.3,
      maxTokens: 1000
    });

    // Update video with summary
    await videoService.updateSummary(videoId, {
      summary: result.summary || '',
      keyPoints: result.keyPoints || [],
      topics: result.topics || []
    });

    return result;
  }

  /**
   * Summarize notes for a video
   */
  async summarizeNotes(videoId) {
    // Get video for context
    const video = await videoService.getById(videoId);

    if (!video) {
      throw errors.notFound('Video not found');
    }

    // Get formatted notes content
    const notesContent = await noteService.getContentForSummarization(videoId);

    if (!notesContent || notesContent.trim().length === 0) {
      throw errors.badRequest('No notes found to summarize');
    }

    // Build prompt
    const prompt = this.buildNotesSummaryPrompt(video.title, notesContent);

    // Get summary from LLM
    const provider = this.getProvider();
    const result = await provider.completeJSON(prompt, {
      temperature: 0.4,
      maxTokens: 1500
    });

    return result;
  }

  /**
   * Build prompt for video summarization
   */
  buildVideoSummaryPrompt(video) {
    return `Analyze the following video information and provide a summary:

Title: ${video.title}
Channel: ${video.channelTitle || 'Unknown'}
Duration: ${video.durationFormatted || 'Unknown'}
Description: ${video.description ? video.description.substring(0, 1500) : 'No description'}
Tags: ${video.tags?.slice(0, 10).join(', ') || 'None'}

Based on this information, provide:
1. A concise summary (2-3 paragraphs) of what this video is likely about
2. 3-5 key points or takeaways
3. Main topics covered

Respond in JSON format:
{
  "summary": "Your summary here...",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "topics": ["topic 1", "topic 2"]
}`;
  }

  /**
   * Build prompt for notes summarization
   */
  buildNotesSummaryPrompt(videoTitle, notesContent) {
    return `Consolidate and summarize the following personal notes taken while watching a video:

Video Title: ${videoTitle}

Notes:
${notesContent}

Please provide:
1. A consolidated summary of all the notes
2. Key themes or topics identified
3. Main insights the user found important
4. Any connections between different notes

Respond in JSON format:
{
  "summary": "Consolidated summary of the notes...",
  "themes": ["theme 1", "theme 2"],
  "keyInsights": ["insight 1", "insight 2"],
  "connections": ["connection 1 between notes"]
}`;
  }

  /**
   * Generate tags for a video
   */
  async generateTags(videoId) {
    const video = await videoService.getById(videoId);

    if (!video) {
      throw errors.notFound('Video not found');
    }

    const prompt = `Based on this video information, suggest 5-10 relevant tags:

Title: ${video.title}
Description: ${video.description?.substring(0, 500) || 'None'}
Existing Tags: ${video.tags?.join(', ') || 'None'}

Respond with JSON:
{
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const provider = this.getProvider();
    const result = await provider.completeJSON(prompt, {
      temperature: 0.6,
      maxTokens: 200
    });

    return result.tags || [];
  }

  /**
   * Check if LLM is available
   */
  async healthCheck() {
    try {
      const provider = this.getProvider();
      return {
        available: true,
        provider: provider.name
      };
    } catch (error) {
      return {
        available: false,
        error: error.message
      };
    }
  }
}

module.exports = new LLMService();
