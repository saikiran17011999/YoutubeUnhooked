/**
 * Video Controller
 * Handles HTTP requests for video operations
 */

const videoService = require('../service/video.service');
const { asyncHandler } = require('../../../middleware');
const { sendSuccess, sendCreated, sendNoContent, sendPaginated } = require('../../../utils');

/**
 * Get all videos
 * GET /api/v1/videos
 */
const getAll = asyncHandler(async (req, res) => {
  const options = {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 20,
    category: req.query.category,
    status: req.query.status,
    search: req.query.search,
    sortBy: req.query.sortBy || 'createdAt',
    order: req.query.order || 'desc',
    tags: req.query.tags ? req.query.tags.split(',') : undefined
  };

  const result = await videoService.getAll(options);
  sendPaginated(res, result.videos, result.pagination);
});

/**
 * Get video by ID
 * GET /api/v1/videos/:id
 */
const getById = asyncHandler(async (req, res) => {
  const video = await videoService.getById(req.params.id);
  sendSuccess(res, video);
});

/**
 * Add video from URL
 * POST /api/v1/videos
 */
const addVideo = asyncHandler(async (req, res) => {
  const { url, categoryId } = req.body;
  const video = await videoService.addFromUrl(url, categoryId);
  sendCreated(res, video, 'Video added successfully');
});

/**
 * Add videos from playlist
 * POST /api/v1/videos/playlist
 */
const addPlaylist = asyncHandler(async (req, res) => {
  const { url, categoryId } = req.body;
  const result = await videoService.addFromPlaylist(url, categoryId);
  sendCreated(res, result, `Imported ${result.imported} videos from playlist`);
});

/**
 * Update video status
 * PATCH /api/v1/videos/:id/status
 */
const updateStatus = asyncHandler(async (req, res) => {
  const video = await videoService.updateStatus(req.params.id, req.body);
  sendSuccess(res, video, 'Status updated');
});

/**
 * Update video category
 * PATCH /api/v1/videos/:id/category
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.body;
  const video = await videoService.updateCategory(req.params.id, categoryId);
  sendSuccess(res, video, 'Category updated');
});

/**
 * Update video tags
 * PATCH /api/v1/videos/:id/tags
 */
const updateTags = asyncHandler(async (req, res) => {
  const { tags } = req.body;
  const video = await videoService.updateTags(req.params.id, tags);
  sendSuccess(res, video, 'Tags updated');
});

/**
 * Delete video
 * DELETE /api/v1/videos/:id
 */
const deleteVideo = asyncHandler(async (req, res) => {
  await videoService.delete(req.params.id);
  sendNoContent(res);
});

/**
 * Get video statistics
 * GET /api/v1/videos/stats
 */
const getStats = asyncHandler(async (req, res) => {
  const stats = await videoService.getStats();
  sendSuccess(res, stats);
});

module.exports = {
  getAll,
  getById,
  addVideo,
  addPlaylist,
  updateStatus,
  updateCategory,
  updateTags,
  deleteVideo,
  getStats
};
