/**
 * Category Model
 * SQLite data access layer for categories (sql.js)
 */

const { all, get, run, generateId } = require('../../../database');

class CategoryModel {
  /**
   * Find all categories with video counts
   */
  static findAll() {
    const sql = `
      SELECT
        c.*,
        COUNT(v.id) as video_count
      FROM categories c
      LEFT JOIN videos v ON v.category_id = c.id
      GROUP BY c.id
      ORDER BY c.display_order ASC, c.name ASC
    `;

    const categories = all(sql, []);
    return categories.map(this.formatCategory);
  }

  /**
   * Find category by ID
   */
  static findById(id) {
    const sql = `
      SELECT
        c.*,
        COUNT(v.id) as video_count
      FROM categories c
      LEFT JOIN videos v ON v.category_id = c.id
      WHERE c.id = ?
      GROUP BY c.id
    `;

    const category = get(sql, [id]);
    return category ? this.formatCategory(category) : null;
  }

  /**
   * Find category by slug
   */
  static findBySlug(slug) {
    const sql = `
      SELECT
        c.*,
        COUNT(v.id) as video_count
      FROM categories c
      LEFT JOIN videos v ON v.category_id = c.id
      WHERE c.slug = ?
      GROUP BY c.id
    `;

    const category = get(sql, [slug]);
    return category ? this.formatCategory(category) : null;
  }

  /**
   * Find category by name (case-insensitive)
   */
  static findByName(name) {
    const sql = `SELECT * FROM categories WHERE LOWER(name) = LOWER(?)`;
    const category = get(sql, [name]);
    return category ? this.formatCategory(category) : null;
  }

  /**
   * Create a new category
   */
  static create(data) {
    const id = generateId();
    const now = new Date().toISOString();

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const maxOrderResult = get('SELECT MAX(display_order) as maxOrder FROM categories', []);
    const order = (maxOrderResult?.maxOrder || 0) + 1;

    const sql = `
      INSERT INTO categories (
        id, name, slug, description, color, icon, is_default, display_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    run(sql, [
      id,
      data.name,
      slug,
      data.description || '',
      data.color || '#6366f1',
      data.icon || 'folder',
      data.isDefault ? 1 : 0,
      order,
      now,
      now
    ]);

    return this.findById(id);
  }

  /**
   * Update a category
   */
  static update(id, data) {
    const now = new Date().toISOString();

    const updates = [];
    const params = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      params.push(data.name);

      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      updates.push('slug = ?');
      params.push(slug);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      params.push(data.description);
    }
    if (data.color !== undefined) {
      updates.push('color = ?');
      params.push(data.color);
    }
    if (data.icon !== undefined) {
      updates.push('icon = ?');
      params.push(data.icon);
    }
    if (data.order !== undefined) {
      updates.push('display_order = ?');
      params.push(data.order);
    }

    if (updates.length === 0) return this.findById(id);

    updates.push('updated_at = ?');
    params.push(now, id);

    const sql = `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`;
    run(sql, params);

    return this.findById(id);
  }

  /**
   * Delete a category
   */
  static delete(id) {
    const category = this.findById(id);
    if (!category) return null;

    run('DELETE FROM categories WHERE id = ?', [id]);
    return category;
  }

  /**
   * Reorder categories
   */
  static reorder(orderedIds) {
    orderedIds.forEach((id, index) => {
      run('UPDATE categories SET display_order = ? WHERE id = ?', [index + 1, id]);
    });
    return this.findAll();
  }

  /**
   * Get video count for a category
   */
  static getVideoCount(id) {
    const result = get('SELECT COUNT(*) as count FROM videos WHERE category_id = ?', [id]);
    return result ? result.count : 0;
  }

  /**
   * Count all categories
   */
  static count() {
    const result = get('SELECT COUNT(*) as count FROM categories', []);
    return result ? result.count : 0;
  }

  /**
   * Insert many categories (for seeding)
   */
  static insertMany(categories) {
    const now = new Date().toISOString();

    categories.forEach((cat, index) => {
      const id = generateId();
      const slug = cat.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      run(`
        INSERT INTO categories (
          id, name, slug, description, color, icon, is_default, display_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        cat.name,
        slug,
        cat.description || '',
        cat.color || '#6366f1',
        cat.icon || 'folder',
        cat.isDefault ? 1 : 0,
        cat.order || index + 1,
        now,
        now
      ]);
    });

    return this.findAll();
  }

  /**
   * Format category from database row
   */
  static formatCategory(row) {
    if (!row) return null;

    return {
      _id: row.id,
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      color: row.color,
      icon: row.icon,
      isDefault: Boolean(row.is_default),
      order: row.display_order,
      videoCount: row.video_count || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = CategoryModel;
