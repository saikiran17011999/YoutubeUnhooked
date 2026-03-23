/**
 * Middleware Module
 * Exports all middleware utilities
 */

const {
  AppError,
  errors,
  errorHandler,
  notFoundHandler,
  asyncHandler
} = require('./errorHandler');

const {
  validate,
  validateObjectId,
  schemas
} = require('./validate');

module.exports = {
  // Error handling
  AppError,
  errors,
  errorHandler,
  notFoundHandler,
  asyncHandler,

  // Validation
  validate,
  validateObjectId,
  schemas
};
