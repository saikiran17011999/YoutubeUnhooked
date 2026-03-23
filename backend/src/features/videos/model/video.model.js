/**
 * Video Model
 * SQLite data access layer for videos (sql.js)
 */

const { all, get, run, generateId } = require('../../../database');

class VideoModel {
  /**
   * Find all videos with filters and pagination
   */
  static findAll(options = {}) {
    const {
      page = 1,
      limit = 20,
      category,
      status,
      search,
      sortBy = 'created_at',
      order = 'desc',
      tags
    } = options;

    const offset = (page - 1) * limit;
    const params = [];
    let whereClause = '1=1';

    // Category filter
    if (category) {
      whereClause += ' AND v.category_id = ?';
      params.push(category);
    }

    // Status filters
    if (status === 'watched') {
      whereClause += ' AND v.watched = 1';
    } else if (status === 'favorite') {
      whereClause += ' AND v.favorite = 1';
    } else if (status === 'watchAgain') {
      whereClause += ' AND v.watch_again = 1';
    } else if (status === 'unwatched') {
      whereClause += ' AND v.watched = 0';
    }

    // Search (LIKE-based for sql.js compatibility)
    if (search) {
      whereClause += ` AND (v.title LIKE ? OR v.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // Tags filter
    if (tags && tags.length > 0) {
      const tagConditions = tags.map(() => `v.user_tags LIKE ?`).join(' OR ');
      whereClause += ` AND (${tagConditions})`;
      tags.forEach(tag => params.push(`%"${tag}"%`));
    }

    // Sort mapping
    const sortMap = {
      createdAt: 'v.created_at',
      created_at: 'v.created_at',
      title: 'v.title',
      updatedAt: 'v.updated_at'
    };
    const sortColumn = sortMap[sortBy] || 'v.created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM videos v WHERE ${whereClause}`;
    const countResult = get(countSql, params);
    const total = countResult ? countResult.total : 0;

    // Get videos with category join
    const sql = `
      SELECT
        v.*,
        c.id as cat_id,
        c.name as cat_name,
        c.slug as cat_slug,
        c.color as cat_color,
        c.icon as cat_icon
      FROM videos v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE ${whereClause}
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const videos = all(sql, [...params, limit, offset]);

    return {
      videos: videos.map(this.formatVideo),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Find video by ID
   */
  static findById(id) {
    const sql = `
      SELECT
        v.*,
        c.id as cat_id,
        c.name as cat_name,
        c.slug as cat_slug,
        c.color as cat_color,
        c.icon as cat_icon
      FROM videos v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.id = ?
    `;

    const video = get(sql, [id]);
    return video ? this.formatVideo(video) : null;
  }

  /**
   * Find video by YouTube ID
   */
  static findByYoutubeId(youtubeId) {
    const sql = `SELECT * FROM videos WHERE youtube_id = ?`;
    const video = get(sql, [youtubeId]);
    return video ? this.formatVideo(video) : null;
  }

  /**
   * Create a new video
   */
  static create(data) {
    const id = generateId();
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO videos (
        id, youtube_id, title, description, thumbnail,
        channel_title, channel_id, duration, duration_formatted,
        published_at, tags, view_count, like_count, category_id,
        watched, favorite, watch_again, summary, key_points, topics,
        user_tags, added_from, playlist_id, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
    `;

    run(sql, [
      id,
      data.youtubeId,
      data.title,
      data.description || '',
      data.thumbnail,
      data.channelTitle || '',
      data.channelId || '',
      data.duration || 'PT0S',
      data.durationFormatted || '0:00',
      data.publishedAt || null,
      JSON.stringify(data.tags || []),
      data.viewCount || 0,
      data.likeCount || 0,
      data.category || null,
      0,
      0,
      0,
      '',
      '[]',
      '[]',
      '[]',
      data.addedFrom || 'url',
      data.playlistId || null,
      now,
      now
    ]);

    return this.findById(id);
  }

  /**
   * Update video status
   */
  static updateStatus(id, status) {
    const now = new Date().toISOString();

    const updates = [];
    const params = [];

    if (typeof status.watched === 'boolean') {
      updates.push('watched = ?');
      params.push(status.watched ? 1 : 0);
    }
    if (typeof status.favorite === 'boolean') {
      updates.push('favorite = ?');
      params.push(status.favorite ? 1 : 0);
    }
    if (typeof status.watchAgain === 'boolean') {
      updates.push('watch_again = ?');
      params.push(status.watchAgain ? 1 : 0);
    }

    if (updates.length === 0) return this.findById(id);

    updates.push('updated_at = ?');
    params.push(now, id);

    const sql = `UPDATE videos SET ${updates.join(', ')} WHERE id = ?`;
    run(sql, params);

    return this.findById(id);
  }

  /**
   * Update video category
   */
  static updateCategory(id, categoryId) {
    const now = new Date().toISOString();
    const sql = `UPDATE videos SET category_id = ?, updated_at = ? WHERE id = ?`;
    run(sql, [categoryId, now, id]);
    return this.findById(id);
  }

  /**
   * Update video tags
   */
  static updateTags(id, tags) {
    const now = new Date().toISOString();
    const sql = `UPDATE videos SET user_tags = ?, updated_at = ? WHERE id = ?`;
    run(sql, [JSON.stringify(tags), now, id]);
    return this.findById(id);
  }

  /**
   * Update video summary
   */
  static updateSummary(id, summaryData) {
    const now = new Date().toISOString();
    const sql = `
      UPDATE videos
      SET summary = ?, key_points = ?, topics = ?, updated_at = ?
      WHERE id = ?
    `;
    run(sql, [
      summaryData.summary || '',
      JSON.stringify(summaryData.keyPoints || []),
      JSON.stringify(summaryData.topics || []),
      now,
      id
    ]);
    return this.findById(id);
  }

  /**
   * Delete video
   */
  static delete(id) {
    const video = this.findById(id);
    if (!video) return null;

    run('DELETE FROM notes WHERE video_id = ?', [id]);
    run('DELETE FROM videos WHERE id = ?', [id]);
    return video;
  }

  /**
   * Get video statistics
   */
  static getStats() {
    const total = get('SELECT COUNT(*) as count FROM videos')?.count || 0;
    const watched = get('SELECT COUNT(*) as count FROM videos WHERE watched = 1')?.count || 0;
    const favorites = get('SELECT COUNT(*) as count FROM videos WHERE favorite = 1')?.count || 0;
    const watchAgain = get('SELECT COUNT(*) as count FROM videos WHERE watch_again = 1')?.count || 0;

    const byCategory = all(`
      SELECT c.id, c.name, c.color, COUNT(v.id) as count
      FROM categories c
      LEFT JOIN videos v ON v.category_id = c.id
      GROUP BY c.id
    `);

    return {
      total,
      watched,
      unwatched: total - watched,
      favorites,
      watchAgain,
      byCategory
    };
  }

  /**
   * Format video from database row
   */
  static formatVideo(row) {
    if (!row) return null;

    const video = {
      _id: row.id,
      id: row.id,
      youtubeId: row.youtube_id,
      title: row.title,
      description: row.description,
      thumbnail: row.thumbnail,
      channelTitle: row.channel_title,
      channelId: row.channel_id,
      duration: row.duration,
      durationFormatted: row.duration_formatted,
      publishedAt: row.published_at,
      tags: JSON.parse(row.tags || '[]'),
      viewCount: row.view_count,
      likeCount: row.like_count,
      status: {
        watched: Boolean(row.watched),
        favorite: Boolean(row.favorite),
        watchAgain: Boolean(row.watch_again)
      },
      summary: row.summary,
      keyPoints: JSON.parse(row.key_points || '[]'),
      topics: JSON.parse(row.topics || '[]'),
      userTags: JSON.parse(row.user_tags || '[]'),
      addedFrom: row.added_from,
      playlistId: row.playlist_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    if (row.cat_id) {
      video.category = {
        _id: row.cat_id,
        id: row.cat_id,
        name: row.cat_name,
        slug: row.cat_slug,
        color: row.cat_color,
        icon: row.cat_icon
      };
    } else {
      video.category = null;
    }

    return video;
  }
}

module.exports = VideoModel;
