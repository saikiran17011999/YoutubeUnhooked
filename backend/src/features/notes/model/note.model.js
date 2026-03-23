/**
 * Note Model
 * SQLite data access layer for notes (sql.js)
 */

const { all, get, run, generateId } = require('../../../database');

class NoteModel {
  /**
   * Find all notes for a video
   */
  static findByVideoId(videoId, options = {}) {
    const { sortBy = 'timestamp', order = 'asc' } = options;

    const sortColumn = sortBy === 'timestamp' ? 'timestamp' : 'created_at';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const sql = `
      SELECT * FROM notes
      WHERE video_id = ?
      ORDER BY is_pinned DESC, ${sortColumn} ${sortOrder}
    `;

    const notes = all(sql, [videoId]);
    return notes.map(this.formatNote);
  }

  /**
   * Find note by ID
   */
  static findById(id) {
    const sql = `SELECT * FROM notes WHERE id = ?`;
    const note = get(sql, [id]);
    return note ? this.formatNote(note) : null;
  }

  /**
   * Create a new note
   */
  static create(videoId, data) {
    const id = generateId();
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO notes (
        id, video_id, content, timestamp, type, color, is_pinned, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    run(sql, [
      id,
      videoId,
      data.content,
      data.timestamp !== undefined ? data.timestamp : null,
      data.type || 'general',
      data.color || null,
      0,
      now,
      now
    ]);

    return this.findById(id);
  }

  /**
   * Update a note
   */
  static update(id, data) {
    const now = new Date().toISOString();

    const updates = [];
    const params = [];

    if (data.content !== undefined) {
      updates.push('content = ?');
      params.push(data.content);
    }
    if (data.timestamp !== undefined) {
      updates.push('timestamp = ?');
      params.push(data.timestamp);
    }
    if (data.type !== undefined) {
      updates.push('type = ?');
      params.push(data.type);
    }
    if (data.color !== undefined) {
      updates.push('color = ?');
      params.push(data.color);
    }
    if (data.isPinned !== undefined) {
      updates.push('is_pinned = ?');
      params.push(data.isPinned ? 1 : 0);
    }

    if (updates.length === 0) return this.findById(id);

    updates.push('updated_at = ?');
    params.push(now, id);

    const sql = `UPDATE notes SET ${updates.join(', ')} WHERE id = ?`;
    run(sql, params);

    return this.findById(id);
  }

  /**
   * Toggle note pinned status
   */
  static togglePin(id) {
    const note = this.findById(id);
    if (!note) return null;

    const now = new Date().toISOString();
    const newPinned = note.isPinned ? 0 : 1;

    run(`UPDATE notes SET is_pinned = ?, updated_at = ? WHERE id = ?`, [newPinned, now, id]);
    return this.findById(id);
  }

  /**
   * Delete a note
   */
  static delete(id) {
    const note = this.findById(id);
    if (!note) return null;

    run('DELETE FROM notes WHERE id = ?', [id]);
    return note;
  }

  /**
   * Delete all notes for a video
   */
  static deleteByVideoId(videoId) {
    const result = run('DELETE FROM notes WHERE video_id = ?', [videoId]);
    return result.changes;
  }

  /**
   * Get note count for a video
   */
  static getCountByVideoId(videoId) {
    const result = get('SELECT COUNT(*) as count FROM notes WHERE video_id = ?', [videoId]);
    return result ? result.count : 0;
  }

  /**
   * Get formatted notes content for LLM summarization
   */
  static getContentForSummarization(videoId) {
    const notes = this.findByVideoId(videoId, { sortBy: 'timestamp', order: 'asc' });

    return notes.map(note => {
      if (note.timestamp !== null) {
        const minutes = Math.floor(note.timestamp / 60);
        const seconds = note.timestamp % 60;
        return `[${minutes}:${seconds.toString().padStart(2, '0')}] ${note.content}`;
      }
      return note.content;
    }).join('\n\n');
  }

  /**
   * Search notes across all videos
   */
  static search(query, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;
    const searchPattern = `%${query}%`;

    const countResult = get(`SELECT COUNT(*) as total FROM notes WHERE content LIKE ?`, [searchPattern]);
    const total = countResult ? countResult.total : 0;

    const sql = `
      SELECT
        n.*,
        v.title as video_title,
        v.thumbnail as video_thumbnail,
        v.youtube_id as video_youtube_id
      FROM notes n
      JOIN videos v ON n.video_id = v.id
      WHERE n.content LIKE ?
      ORDER BY n.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const notes = all(sql, [searchPattern, limit, offset]);

    return {
      notes: notes.map(row => ({
        ...this.formatNote(row),
        video: {
          _id: row.video_id,
          title: row.video_title,
          thumbnail: row.video_thumbnail,
          youtubeId: row.video_youtube_id
        }
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Format note from database row
   */
  static formatNote(row) {
    if (!row) return null;

    return {
      _id: row.id,
      id: row.id,
      videoId: row.video_id,
      content: row.content,
      timestamp: row.timestamp,
      type: row.type,
      color: row.color,
      isPinned: Boolean(row.is_pinned),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = NoteModel;
