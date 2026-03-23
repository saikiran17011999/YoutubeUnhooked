/**
 * Videos Feature Module
 * Exports all video-related components
 */

const Video = require('./model/video.model');
const videoService = require('./service/video.service');
const videoController = require('./controller/video.controller');
const videoRoutes = require('./routes/video.routes');

module.exports = {
  Video,
  videoService,
  videoController,
  videoRoutes
};
