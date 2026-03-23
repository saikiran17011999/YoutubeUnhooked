/**
 * Global Error Handler Middleware
 * Catches all errors and formats consistent error responses
 */

const config = require('../config');

/**
 * Custom Application Error class
 */
class AppError extends Error {
  constructor(message, statusCode, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common error factory methods
 */
const errors = {
  badRequest: (message = 'Bad request', code = 'BAD_REQUEST') =>
    new AppError(message, 400, code),

  unauthorized: (message = 'Unauthorized', code = 'UNAUTHORIZED') =>
    new AppError(message, 401, code),

  forbidden: (message = 'Forbidden', code = 'FORBIDDEN') =>
    new AppError(message, 403, code),

  notFound: (message = 'Resource not found', code = 'NOT_FOUND') =>
    new AppError(message, 404, code),

  conflict: (message = 'Resource already exists', code = 'DUPLICATE_ENTRY') =>
    new AppError(message, 409, code),

  validation: (message = 'Validation failed', code = 'VALIDATION_ERROR') =>
    new AppError(message, 400, code),

  rateLimit: (message = 'Too many requests', code = 'RATE_LIMITED') =>
    new AppError(message, 429, code),

  internal: (message = 'Internal server error', code = 'INTERNAL_ERROR') =>
    new AppError(message, 500, code)
};

/**
 * Handle Mongoose validation errors
 */
function handleMongooseValidationError(err) {
  const messages = Object.values(err.errors).map(e => e.message);
  return new AppError(messages.join(', '), 400, 'VALIDATION_ERROR');
}

/**
 * Handle Mongoose duplicate key errors
 */
function handleMongooseDuplicateKeyError(err) {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(
    `Duplicate value for field: ${field}`,
    409,
    'DUPLICATE_ENTRY'
  );
}

/**
 * Handle Mongoose cast errors (invalid ObjectId)
 */
function handleMongooseCastError(err) {
  return new AppError(
    `Invalid ${err.path}: ${err.value}`,
    400,
    'INVALID_ID'
  );
}

/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, next) {
  let error = err;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error = handleMongooseValidationError(err);
  } else if (err.code === 11000) {
    error = handleMongooseDuplicateKeyError(err);
  } else if (err.name === 'CastError') {
    error = handleMongooseCastError(err);
  } else if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401, 'INVALID_TOKEN');
  } else if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401, 'TOKEN_EXPIRED');
  }

  // Set defaults for non-AppError errors
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message = error.isOperational ? error.message : 'Internal server error';

  // Log error in development
  if (config.env === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      statusCode,
      code
    });
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(config.env === 'development' && { stack: err.stack })
    }
  });
}

/**
 * Handle 404 - Route not found
 */
function notFoundHandler(req, res, next) {
  next(new AppError(`Route ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND'));
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  AppError,
  errors,
  errorHandler,
  notFoundHandler,
  asyncHandler
};
