/**
 * LLM Service
 * API calls for LLM operations
 */

import api from './api';

export const llmService = {
  /**
   * Summarize a video
   */
  summarizeVideo: (videoId) => {
    return api.post(`/llm/summarize/video/${videoId}`);
  },

  /**
   * Summarize notes for a video
   */
  summarizeNotes: (videoId) => {
    return api.post(`/llm/summarize/notes/${videoId}`);
  },

  /**
   * Generate tags for a video
   */
  generateTags: (videoId) => {
    return api.post(`/llm/tags/${videoId}`);
  },

  /**
   * Check LLM health
   */
  healthCheck: () => {
    return api.get('/llm/health');
  },

  /**
   * Get available providers
   */
  getProviders: () => {
    return api.get('/llm/providers');
  },
};

export default llmService;
