/**
 * LLM Controller
 * Handles HTTP requests for LLM operations
 */

const llmService = require('../service/llm.service');
const { getAvailableProviders } = require('../providers');
const { asyncHandler } = require('../../../middleware');
const { sendSuccess } = require('../../../utils');

/**
 * Summarize a video
 * POST /api/v1/llm/summarize/video/:videoId
 */
const summarizeVideo = asyncHandler(async (req, res) => {
  const result = await llmService.summarizeVideo(req.params.videoId);
  sendSuccess(res, result, 'Video summarized successfully');
});

/**
 * Summarize notes for a video
 * POST /api/v1/llm/summarize/notes/:videoId
 */
const summarizeNotes = asyncHandler(async (req, res) => {
  const result = await llmService.summarizeNotes(req.params.videoId);
  sendSuccess(res, result, 'Notes summarized successfully');
});

/**
 * Generate tags for a video
 * POST /api/v1/llm/tags/:videoId
 */
const generateTags = asyncHandler(async (req, res) => {
  const tags = await llmService.generateTags(req.params.videoId);
  sendSuccess(res, { tags }, 'Tags generated successfully');
});

/**
 * Get LLM health status
 * GET /api/v1/llm/health
 */
const healthCheck = asyncHandler(async (req, res) => {
  const status = await llmService.healthCheck();
  sendSuccess(res, status);
});

/**
 * Get available LLM providers
 * GET /api/v1/llm/providers
 */
const getProviders = asyncHandler(async (req, res) => {
  const providers = getAvailableProviders();
  sendSuccess(res, providers);
});

module.exports = {
  summarizeVideo,
  summarizeNotes,
  generateTags,
  healthCheck,
  getProviders
};
