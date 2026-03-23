/**
 * Category Controller
 * Handles HTTP requests for category operations
 */

const categoryService = require('../service/category.service');
const { asyncHandler } = require('../../../middleware');
const { sendSuccess, sendCreated, sendNoContent } = require('../../../utils');

/**
 * Get all categories
 * GET /api/v1/categories
 */
const getAll = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAll();
  sendSuccess(res, categories);
});

/**
 * Get category by ID
 * GET /api/v1/categories/:id
 */
const getById = asyncHandler(async (req, res) => {
  const category = await categoryService.getById(req.params.id);
  sendSuccess(res, category);
});

/**
 * Create a new category
 * POST /api/v1/categories
 */
const create = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.body);
  sendCreated(res, category, 'Category created successfully');
});

/**
 * Update a category
 * PUT /api/v1/categories/:id
 */
const update = asyncHandler(async (req, res) => {
  const category = await categoryService.update(req.params.id, req.body);
  sendSuccess(res, category, 'Category updated successfully');
});

/**
 * Delete a category
 * DELETE /api/v1/categories/:id
 */
const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.delete(req.params.id);
  sendNoContent(res);
});

/**
 * Reorder categories
 * PATCH /api/v1/categories/reorder
 */
const reorder = asyncHandler(async (req, res) => {
  const { orderedIds } = req.body;
  const categories = await categoryService.reorder(orderedIds);
  sendSuccess(res, categories, 'Categories reordered');
});

/**
 * Seed default categories
 * POST /api/v1/categories/seed
 */
const seed = asyncHandler(async (req, res) => {
  const result = await categoryService.seedDefaults();
  sendSuccess(res, result);
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteCategory,
  reorder,
  seed
};
