/**
 * Categories Feature Module
 * Exports all category-related components
 */

const Category = require('./model/category.model');
const categoryService = require('./service/category.service');
const categoryController = require('./controller/category.controller');
const categoryRoutes = require('./routes/category.routes');

module.exports = {
  Category,
  categoryService,
  categoryController,
  categoryRoutes
};
