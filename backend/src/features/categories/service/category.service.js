/**
 * Category Service
 * Business logic for category operations
 */

const CategoryModel = require('../model/category.model');
const { errors } = require('../../../middleware');

// Default categories to seed
const DEFAULT_CATEGORIES = [
  { name: 'AI', color: '#8b5cf6', icon: 'brain', order: 1, isDefault: true },
  { name: 'System Design', color: '#06b6d4', icon: 'cpu', order: 2, isDefault: true },
  { name: 'Cybersecurity', color: '#ef4444', icon: 'shield', order: 3, isDefault: true },
  { name: 'Badminton Education', color: '#22c55e', icon: 'activity', order: 4, isDefault: true },
  { name: 'Miscellaneous', color: '#6b7280', icon: 'folder', order: 5, isDefault: true }
];

class CategoryService {
  /**
   * Get all categories with video counts
   */
  async getAll() {
    return CategoryModel.findAll();
  }

  /**
   * Get category by ID
   */
  async getById(id) {
    const category = CategoryModel.findById(id);

    if (!category) {
      throw errors.notFound('Category not found');
    }

    return category;
  }

  /**
   * Get category by slug
   */
  async getBySlug(slug) {
    const category = CategoryModel.findBySlug(slug);

    if (!category) {
      throw errors.notFound('Category not found');
    }

    return category;
  }

  /**
   * Create a new category
   */
  async create(categoryData) {
    // Check if name already exists
    const existing = CategoryModel.findByName(categoryData.name);

    if (existing) {
      throw errors.conflict('Category with this name already exists');
    }

    return CategoryModel.create(categoryData);
  }

  /**
   * Update a category
   */
  async update(id, updateData) {
    const category = CategoryModel.findById(id);

    if (!category) {
      throw errors.notFound('Category not found');
    }

    // Check name uniqueness if name is being changed
    if (updateData.name && updateData.name !== category.name) {
      const existing = CategoryModel.findByName(updateData.name);

      if (existing && existing.id !== id) {
        throw errors.conflict('Category with this name already exists');
      }
    }

    return CategoryModel.update(id, updateData);
  }

  /**
   * Delete a category
   */
  async delete(id) {
    const category = CategoryModel.findById(id);

    if (!category) {
      throw errors.notFound('Category not found');
    }

    if (category.isDefault) {
      throw errors.badRequest('Cannot delete default category');
    }

    // Check if category has videos
    const videoCount = CategoryModel.getVideoCount(id);
    if (videoCount > 0) {
      throw errors.badRequest(
        `Cannot delete category with ${videoCount} videos. Move or delete videos first.`
      );
    }

    return CategoryModel.delete(id);
  }

  /**
   * Reorder categories
   */
  async reorder(orderedIds) {
    return CategoryModel.reorder(orderedIds);
  }

  /**
   * Seed default categories
   */
  async seedDefaults() {
    const existing = CategoryModel.count();

    if (existing > 0) {
      return { message: 'Categories already exist', created: 0 };
    }

    CategoryModel.insertMany(DEFAULT_CATEGORIES);

    return { message: 'Default categories created', created: DEFAULT_CATEGORIES.length };
  }
}

module.exports = new CategoryService();
