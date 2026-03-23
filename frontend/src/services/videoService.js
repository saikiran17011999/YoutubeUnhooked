/**
 * Video Service
 * API calls for video operations
 */

import api from './api';

export const videoService = {
  /**
   * Get all videos with filters
   */
  getAll: (params = {}) => {
    return api.get('/videos', { params });
  },

  /**
   * Get video by ID
   */
  getById: (id) => {
    return api.get(`/videos/${id}`);
  },

  /**
   * Add video from URL
   */
  add: (url, categoryId = null) => {
    return api.post('/videos', { url, categoryId });
  },

  /**
   * Add videos from playlist
   */
  addPlaylist: (url, categoryId = null) => {
    return api.post('/videos/playlist', { url, categoryId });
  },

  /**
   * Update video status
   */
  updateStatus: (id, status) => {
    return api.patch(`/videos/${id}/status`, status);
  },

  /**
   * Update video category
   */
  updateCategory: (id, categoryId) => {
    return api.patch(`/videos/${id}/category`, { categoryId });
  },

  /**
   * Update video tags
   */
  updateTags: (id, tags) => {
    return api.patch(`/videos/${id}/tags`, { tags });
  },

  /**
   * Delete video
   */
  delete: (id) => {
    return api.delete(`/videos/${id}`);
  },

  /**
   * Get video statistics
   */
  getStats: () => {
    return api.get('/videos/stats');
  },
};

export default videoService;
