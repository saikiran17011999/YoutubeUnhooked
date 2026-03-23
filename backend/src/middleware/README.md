# Middleware Module

## Purpose

Provides reusable Express middleware for error handling, validation, and request processing.

## Files

- `errorHandler.js` - Global error handling and custom error classes
- `validate.js` - Request validation using Joi
- `index.js` - Module exports

## Error Handling

### AppError Class

Custom error class for operational errors:

```javascript
const { AppError } = require('./middleware');

throw new AppError('User not found', 404, 'USER_NOT_FOUND');
```

### Error Factory Methods

```javascript
const { errors } = require('./middleware');

throw errors.notFound('Video not found');
throw errors.validation('Invalid URL format');
throw errors.conflict('Video already exists');
```

### Async Handler

Wraps async route handlers to catch errors:

```javascript
const { asyncHandler } = require('./middleware');

router.get('/', asyncHandler(async (req, res) => {
  const data = await someAsyncOperation();
  res.json({ success: true, data });
}));
```

## Validation

### Schema Validation

```javascript
const { validate } = require('./middleware');
const Joi = require('joi');

const schema = Joi.object({
  title: Joi.string().required(),
  url: Joi.string().uri().required()
});

router.post('/', validate(schema), controller.create);
```

### ObjectId Validation

```javascript
const { validateObjectId } = require('./middleware');

router.get('/:id', validateObjectId('id'), controller.getById);
```

### Common Schemas

```javascript
const { schemas } = require('./middleware');

// Pagination schema
const paginationSchema = schemas.pagination;

// YouTube URL schema
const urlSchema = schemas.youtubeUrl;
```

## Connection to Other Modules

- Used by all route handlers for validation
- `errorHandler` is registered globally in `server.js`
- `asyncHandler` wraps all controller methods
