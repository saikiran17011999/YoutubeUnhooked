/**
 * Video Routes
 * Defines API endpoints for video operations
 */

const express = require('express');
const Joi = require('joi');
const controller = require('../controller/video.controller');
const noteController = require('../../notes/controller/note.controller');
const { validate, validateObjectId, schemas } = require('../../../middleware');

const router = express.Router();

// Note validation schema
const createNoteSchema = Joi.object({
  content: Joi.string().trim().required().max(10000),
  timestamp: Joi.number().min(0).allow(null),
  type: Joi.string().valid('general', 'timestamp', 'highlight', 'question'),
  color: Joi.string().allow(null)
});

// Validation schemas
const addVideoSchema = Joi.object({
  url: schemas.youtubeUrl.required(),
  categoryId: schemas.objectId.allow(null)
});

const addPlaylistSchema = Joi.object({
  url: schemas.youtubePlaylistUrl.required(),
  categoryId: schemas.objectId.allow(null)
});

const updateStatusSchema = Joi.object({
  watched: Joi.boolean(),
  favorite: Joi.boolean(),
  watchAgain: Joi.boolean()
}).min(1);

const updateCategorySchema = Joi.object({
  categoryId: schemas.objectId.required()
});

const updateTagsSchema = Joi.object({
  tags: Joi.array().items(Joi.string().trim().lowercase()).max(20)
});

// Routes

/**
 * @route   GET /api/v1/videos/stats
 * @desc    Get video statistics
 */
router.get('/stats', controller.getStats);

/**
 * @route   GET /api/v1/videos
 * @desc    Get all videos with pagination and filters
 * @query   page, limit, category, status, search, sortBy, order, tags
 */
router.get('/', controller.getAll);

/**
 * @route   GET /api/v1/videos/:id
 * @desc    Get video by ID
 */
router.get('/:id', validateObjectId('id'), controller.getById);

/**
 * @route   POST /api/v1/videos
 * @desc    Add video from URL
 * @body    { url, categoryId? }
 */
router.post('/', validate(addVideoSchema), controller.addVideo);

/**
 * @route   POST /api/v1/videos/playlist
 * @desc    Add videos from playlist
 * @body    { url, categoryId? }
 */
router.post('/playlist', validate(addPlaylistSchema), controller.addPlaylist);

/**
 * @route   PATCH /api/v1/videos/:id/status
 * @desc    Update video status (watched, favorite, watchAgain)
 * @body    { watched?, favorite?, watchAgain? }
 */
router.patch(
  '/:id/status',
  validateObjectId('id'),
  validate(updateStatusSchema),
  controller.updateStatus
);

/**
 * @route   PATCH /api/v1/videos/:id/category
 * @desc    Update video category
 * @body    { categoryId }
 */
router.patch(
  '/:id/category',
  validateObjectId('id'),
  validate(updateCategorySchema),
  controller.updateCategory
);

/**
 * @route   PATCH /api/v1/videos/:id/tags
 * @desc    Update video tags
 * @body    { tags: [] }
 */
router.patch(
  '/:id/tags',
  validateObjectId('id'),
  validate(updateTagsSchema),
  controller.updateTags
);

/**
 * @route   DELETE /api/v1/videos/:id
 * @desc    Delete video
 */
router.delete('/:id', validateObjectId('id'), controller.deleteVideo);

// ============================================
// Nested Notes Routes (/api/v1/videos/:videoId/notes)
// ============================================

/**
 * @route   GET /api/v1/videos/:videoId/notes
 * @desc    Get all notes for a video
 */
router.get('/:videoId/notes', validateObjectId('videoId'), noteController.getByVideoId);

/**
 * @route   POST /api/v1/videos/:videoId/notes
 * @desc    Create a note for a video
 * @body    { content, timestamp?, type?, color? }
 */
router.post(
  '/:videoId/notes',
  validateObjectId('videoId'),
  validate(createNoteSchema),
  noteController.create
);

module.exports = router;
