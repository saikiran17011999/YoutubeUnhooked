/**
 * Note Routes
 * Defines API endpoints for note operations
 */

const express = require('express');
const Joi = require('joi');
const controller = require('../controller/note.controller');
const { validate, validateObjectId } = require('../../../middleware');

const router = express.Router();

// Validation schemas
const createNoteSchema = Joi.object({
  content: Joi.string().trim().required().max(10000),
  timestamp: Joi.number().min(0).allow(null),
  type: Joi.string().valid('general', 'timestamp', 'highlight', 'question'),
  color: Joi.string().allow(null)
});

const updateNoteSchema = Joi.object({
  content: Joi.string().trim().max(10000),
  timestamp: Joi.number().min(0).allow(null),
  type: Joi.string().valid('general', 'timestamp', 'highlight', 'question'),
  color: Joi.string().allow(null),
  isPinned: Joi.boolean()
}).min(1);

// Note-specific routes (mounted at /api/v1/notes)

/**
 * @route   GET /api/v1/notes/search
 * @desc    Search notes across all videos
 * @query   q, page, limit
 */
router.get('/search', controller.search);

/**
 * @route   GET /api/v1/notes/:id
 * @desc    Get note by ID
 */
router.get('/:id', validateObjectId('id'), controller.getById);

/**
 * @route   PUT /api/v1/notes/:id
 * @desc    Update a note
 * @body    { content?, timestamp?, type?, color?, isPinned? }
 */
router.put(
  '/:id',
  validateObjectId('id'),
  validate(updateNoteSchema),
  controller.update
);

/**
 * @route   PATCH /api/v1/notes/:id/pin
 * @desc    Toggle note pinned status
 */
router.patch('/:id/pin', validateObjectId('id'), controller.togglePin);

/**
 * @route   DELETE /api/v1/notes/:id
 * @desc    Delete a note
 */
router.delete('/:id', validateObjectId('id'), controller.deleteNote);

module.exports = router;
