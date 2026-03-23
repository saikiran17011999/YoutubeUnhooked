# Categories Feature

## Purpose

Manages video organization through customizable categories with colors, icons, and ordering.

## Files

```
categories/
├── controller/
│   └── category.controller.js   # HTTP request handlers
├── service/
│   └── category.service.js      # Business logic
├── routes/
│   ├── category.routes.js       # Route definitions
│   └── index.js                 # Route exports
├── model/
│   └── category.model.js        # Mongoose schema
├── index.js                     # Module exports
└── README.md                    # This file
```

## API Endpoints

| Method | Endpoint                 | Description              |
|--------|--------------------------|--------------------------|
| GET    | /categories              | List all categories      |
| GET    | /categories/:id          | Get single category      |
| POST   | /categories              | Create category          |
| PUT    | /categories/:id          | Update category          |
| DELETE | /categories/:id          | Delete category          |
| PATCH  | /categories/reorder      | Reorder categories       |
| POST   | /categories/seed         | Seed default categories  |

## Data Model

```javascript
{
  name: String,           // Category name (unique)
  slug: String,           // URL-friendly slug
  description: String,    // Optional description
  color: String,          // Hex color code
  icon: String,           // Icon name for frontend
  isDefault: Boolean,     // System category (cannot delete)
  order: Number           // Display order
}
```

## Default Categories

On first run, seed these defaults via `POST /categories/seed`:

1. **AI** - Purple (#8b5cf6)
2. **System Design** - Cyan (#06b6d4)
3. **Cybersecurity** - Red (#ef4444)
4. **Badminton Education** - Green (#22c55e)
5. **Miscellaneous** - Gray (#6b7280)

## Service Methods

- `getAll()` - Get all categories with video counts
- `getById(id)` - Get single category
- `getBySlug(slug)` - Get category by slug
- `create(data)` - Create new category
- `update(id, data)` - Update category
- `delete(id)` - Delete category (if no videos)
- `reorder(orderedIds)` - Reorder categories
- `seedDefaults()` - Create default categories

## Connection to Other Modules

- **Videos**: Videos reference categories via `category` field
- **Frontend**: Sidebar displays categories for filtering

## Business Rules

1. Category names must be unique (case-insensitive)
2. Default categories cannot be deleted
3. Categories with videos cannot be deleted
4. Slugs are auto-generated from names
