/**
 * Note Controller
 * Handles HTTP requests for note operations
 */

const noteService = require('../service/note.service');
const { asyncHandler } = require('../../../middleware');
const { sendSuccess, sendCreated, sendNoContent } = require('../../../utils');

/**
 * Get all notes for a video
 * GET /api/v1/videos/:videoId/notes
 */
const getByVideoId = asyncHandler(async (req, res) => {
  const notes = await noteService.getByVideoId(req.params.videoId, {
    sortBy: req.query.sortBy,
    order: req.query.order
  });
  sendSuccess(res, notes);
});

/**
 * Get note by ID
 * GET /api/v1/notes/:id
 */
const getById = asyncHandler(async (req, res) => {
  const note = await noteService.getById(req.params.id);
  sendSuccess(res, note);
});

/**
 * Create a new note
 * POST /api/v1/videos/:videoId/notes
 */
const create = asyncHandler(async (req, res) => {
  const note = await noteService.create(req.params.videoId, req.body);
  sendCreated(res, note, 'Note created successfully');
});

/**
 * Update a note
 * PUT /api/v1/notes/:id
 */
const update = asyncHandler(async (req, res) => {
  const note = await noteService.update(req.params.id, req.body);
  sendSuccess(res, note, 'Note updated successfully');
});

/**
 * Toggle note pinned status
 * PATCH /api/v1/notes/:id/pin
 */
const togglePin = asyncHandler(async (req, res) => {
  const note = await noteService.togglePin(req.params.id);
  sendSuccess(res, note, `Note ${note.isPinned ? 'pinned' : 'unpinned'}`);
});

/**
 * Delete a note
 * DELETE /api/v1/notes/:id
 */
const deleteNote = asyncHandler(async (req, res) => {
  await noteService.delete(req.params.id);
  sendNoContent(res);
});

/**
 * Search notes
 * GET /api/v1/notes/search
 */
const search = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;
  const result = await noteService.search(q, { page, limit });
  sendSuccess(res, result);
});

module.exports = {
  getByVideoId,
  getById,
  create,
  update,
  togglePin,
  deleteNote,
  search
};
