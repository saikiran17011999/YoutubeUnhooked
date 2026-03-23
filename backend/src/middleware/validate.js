/**
 * Request Validation Middleware
 * Uses Joi for schema validation
 */

const Joi = require('joi');
const { AppError } = require('./errorHandler');

/**
 * Creates validation middleware for request data
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(messages, 400, 'VALIDATION_ERROR'));
    }

    // Replace with validated/sanitized values
    req[property] = value;
    next();
  };
}

// UUID v4 regex pattern
const UUID_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

/**
 * Common validation schemas
 */
const schemas = {
  // UUID (for SQLite)
  objectId: Joi.string().pattern(UUID_PATTERN).messages({
    'string.pattern.base': 'Invalid ID format'
  }),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string().default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // YouTube URL
  youtubeUrl: Joi.string().pattern(
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
  ).messages({
    'string.pattern.base': 'Invalid YouTube URL'
  }),

  // YouTube playlist URL
  youtubePlaylistUrl: Joi.string().pattern(
    /^(https?:\/\/)?(www\.)?youtube\.com\/playlist\?list=.+$/
  ).messages({
    'string.pattern.base': 'Invalid YouTube playlist URL'
  })
};

/**
 * Validate params contain valid UUID
 */
function validateObjectId(paramName = 'id') {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id || !UUID_PATTERN.test(id)) {
      return next(new AppError(`Invalid ${paramName} format`, 400, 'INVALID_ID'));
    }

    next();
  };
}

module.exports = {
  validate,
  validateObjectId,
  schemas
};
