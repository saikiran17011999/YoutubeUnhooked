/**
 * Category Routes
 * Defines API endpoints for category operations
 */

const express = require('express');
const Joi = require('joi');
const controller = require('../controller/category.controller');
const { validate, validateObjectId, schemas } = require('../../../middleware');

const router = express.Router();

// Validation schemas
const createCategorySchema = Joi.object({
  name: Joi.string().trim().required().max(50),
  description: Joi.string().trim().max(200).allow(''),
  color: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  icon: Joi.string().trim().max(30)
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().max(50),
  description: Joi.string().trim().max(200).allow(''),
  color: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  icon: Joi.string().trim().max(30),
  order: Joi.number().integer().min(1)
}).min(1);

const reorderSchema = Joi.object({
  orderedIds: Joi.array().items(schemas.objectId).required()
});

// Routes

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories with video counts
 */
router.get('/', controller.getAll);

/**
 * @route   POST /api/v1/categories/seed
 * @desc    Seed default categories
 */
router.post('/seed', controller.seed);

/**
 * @route   PATCH /api/v1/categories/reorder
 * @desc    Reorder categories
 * @body    { orderedIds: [] }
 */
router.patch('/reorder', validate(reorderSchema), controller.reorder);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get category by ID
 */
router.get('/:id', validateObjectId('id'), controller.getById);

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @body    { name, description?, color?, icon? }
 */
router.post('/', validate(createCategorySchema), controller.create);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update a category
 * @body    { name?, description?, color?, icon?, order? }
 */
router.put(
  '/:id',
  validateObjectId('id'),
  validate(updateCategorySchema),
  controller.update
);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete a category
 */
router.delete('/:id', validateObjectId('id'), controller.deleteCategory);

module.exports = router;
