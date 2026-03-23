/**
 * Response Utilities
 * Standardized API response formatters
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
function sendSuccess(res, data, message = null, statusCode = 200) {
  const response = {
    success: true
  };

  if (message) {
    response.message = message;
  }

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

/**
 * Send created response (201)
 * @param {Object} res - Express response object
 * @param {Object} data - Created resource
 * @param {string} message - Success message
 */
function sendCreated(res, data, message = 'Created successfully') {
  return sendSuccess(res, data, message, 201);
}

/**
 * Send no content response (204)
 * @param {Object} res - Express response object
 */
function sendNoContent(res) {
  return res.status(204).send();
}

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Array} items - Array of items
 * @param {Object} pagination - Pagination info
 */
function sendPaginated(res, items, pagination) {
  return sendSuccess(res, {
    items,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrev: pagination.page > 1
    }
  });
}

/**
 * Build pagination query options for Mongoose
 * @param {Object} query - Request query parameters
 * @returns {Object} - Mongoose query options
 */
function buildPaginationOptions(query) {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const sortBy = query.sortBy || 'createdAt';
  const order = query.order === 'asc' ? 1 : -1;

  return {
    skip: (page - 1) * limit,
    limit,
    sort: { [sortBy]: order },
    page,
    originalLimit: limit
  };
}

module.exports = {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendPaginated,
  buildPaginationOptions
};
