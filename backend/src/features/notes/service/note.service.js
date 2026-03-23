/**
 * Note Service
 * Business logic for note operations
 */

const NoteModel = require('../model/note.model');
const VideoModel = require('../../videos/model/video.model');
const { errors } = require('../../../middleware');

class NoteService {
  /**
   * Get all notes for a video
   */
  async getByVideoId(videoId, options = {}) {
    // Verify video exists
    const video = VideoModel.findById(videoId);
    if (!video) {
      throw errors.notFound('Video not found');
    }

    return NoteModel.findByVideoId(videoId, options);
  }

  /**
   * Get note by ID
   */
  async getById(id) {
    const note = NoteModel.findById(id);

    if (!note) {
      throw errors.notFound('Note not found');
    }

    return note;
  }

  /**
   * Create a new note
   */
  async create(videoId, noteData) {
    // Verify video exists
    const video = VideoModel.findById(videoId);
    if (!video) {
      throw errors.notFound('Video not found');
    }

    return NoteModel.create(videoId, noteData);
  }

  /**
   * Update a note
   */
  async update(id, updateData) {
    const note = NoteModel.findById(id);

    if (!note) {
      throw errors.notFound('Note not found');
    }

    return NoteModel.update(id, updateData);
  }

  /**
   * Toggle note pinned status
   */
  async togglePin(id) {
    const note = NoteModel.findById(id);

    if (!note) {
      throw errors.notFound('Note not found');
    }

    return NoteModel.togglePin(id);
  }

  /**
   * Delete a note
   */
  async delete(id) {
    const note = NoteModel.delete(id);

    if (!note) {
      throw errors.notFound('Note not found');
    }

    return note;
  }

  /**
   * Delete all notes for a video
   */
  async deleteByVideoId(videoId) {
    return NoteModel.deleteByVideoId(videoId);
  }

  /**
   * Get note count for a video
   */
  async getCountByVideoId(videoId) {
    return NoteModel.getCountByVideoId(videoId);
  }

  /**
   * Get all notes content for a video (for LLM summarization)
   */
  async getContentForSummarization(videoId) {
    return NoteModel.getContentForSummarization(videoId);
  }

  /**
   * Search notes across all videos
   */
  async search(query, options = {}) {
    return NoteModel.search(query, options);
  }
}

module.exports = new NoteService();
