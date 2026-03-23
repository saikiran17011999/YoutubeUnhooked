/**
 * Category Service
 * API calls for category operations
 */

import api from './api';

export const categoryService = {
  /**
   * Get all categories
   */
  getAll: () => {
    return api.get('/categories');
  },

  /**
   * Get category by ID
   */
  getById: (id) => {
    return api.get(`/categories/${id}`);
  },

  /**
   * Create a category
   */
  create: (data) => {
    return api.post('/categories', data);
  },

  /**
   * Update a category
   */
  update: (id, data) => {
    return api.put(`/categories/${id}`, data);
  },

  /**
   * Delete a category
   */
  delete: (id) => {
    return api.delete(`/categories/${id}`);
  },

  /**
   * Seed default categories
   */
  seed: () => {
    return api.post('/categories/seed');
  },
};

export default categoryService;
