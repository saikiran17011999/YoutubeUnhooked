/**
 * Note Service
 * API calls for note operations
 */

import api from './api';

export const noteService = {
  /**
   * Get notes for a video
   */
  getByVideoId: (videoId) => {
    return api.get(`/videos/${videoId}/notes`);
  },

  /**
   * Create a note
   */
  create: (videoId, data) => {
    return api.post(`/videos/${videoId}/notes`, data);
  },

  /**
   * Update a note
   */
  update: (id, data) => {
    return api.put(`/notes/${id}`, data);
  },

  /**
   * Toggle note pinned status
   */
  togglePin: (id) => {
    return api.patch(`/notes/${id}/pin`);
  },

  /**
   * Delete a note
   */
  delete: (id) => {
    return api.delete(`/notes/${id}`);
  },

  /**
   * Search notes
   */
  search: (query, params = {}) => {
    return api.get('/notes/search', { params: { q: query, ...params } });
  },
};

export default noteService;
