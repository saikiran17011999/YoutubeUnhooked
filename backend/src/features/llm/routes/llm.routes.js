/**
 * LLM Routes
 * Defines API endpoints for LLM operations
 */

const express = require('express');
const controller = require('../controller/llm.controller');
const { validateObjectId } = require('../../../middleware');

const router = express.Router();

/**
 * @route   GET /api/v1/llm/health
 * @desc    Check LLM availability
 */
router.get('/health', controller.healthCheck);

/**
 * @route   GET /api/v1/llm/providers
 * @desc    Get available LLM providers
 */
router.get('/providers', controller.getProviders);

/**
 * @route   POST /api/v1/llm/summarize/video/:videoId
 * @desc    Generate AI summary for a video
 */
router.post(
  '/summarize/video/:videoId',
  validateObjectId('videoId'),
  controller.summarizeVideo
);

/**
 * @route   POST /api/v1/llm/summarize/notes/:videoId
 * @desc    Generate AI summary of notes for a video
 */
router.post(
  '/summarize/notes/:videoId',
  validateObjectId('videoId'),
  controller.summarizeNotes
);

/**
 * @route   POST /api/v1/llm/tags/:videoId
 * @desc    Generate AI-suggested tags for a video
 */
router.post(
  '/tags/:videoId',
  validateObjectId('videoId'),
  controller.generateTags
);

module.exports = router;
