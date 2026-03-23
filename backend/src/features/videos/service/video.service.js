/**
 * Video Service
 * Business logic for video operations
 */

const VideoModel = require('../model/video.model');
const { errors } = require('../../../middleware');
const {
  extractVideoId,
  extractPlaylistId,
  fetchVideoDetails,
  fetchPlaylistItems,
  getThumbnailUrl
} = require('../../../utils');

class VideoService {
  /**
   * Get all videos with pagination and filters
   */
  async getAll(options = {}) {
    return VideoModel.findAll(options);
  }

  /**
   * Get video by ID
   */
  async getById(id) {
    const video = VideoModel.findById(id);

    if (!video) {
      throw errors.notFound('Video not found');
    }

    // Get notes for this video
    const NoteModel = require('../../notes/model/note.model');
    video.notes = NoteModel.findByVideoId(id);

    return video;
  }

  /**
   * Get video by YouTube ID
   */
  async getByYoutubeId(youtubeId) {
    return VideoModel.findByYoutubeId(youtubeId);
  }

  /**
   * Add video from URL
   */
  async addFromUrl(url, categoryId = null) {
    const videoId = extractVideoId(url);

    if (!videoId) {
      throw errors.validation('Invalid YouTube URL');
    }

    // Check if video already exists
    const existing = await this.getByYoutubeId(videoId);
    if (existing) {
      throw errors.conflict('Video already exists in your library');
    }

    // Fetch video details from YouTube API
    let videoData;
    try {
      videoData = await fetchVideoDetails(videoId);
    } catch (error) {
      // Fallback: create with minimal data if API fails
      videoData = {
        youtubeId: videoId,
        title: 'Unknown Video',
        description: '',
        thumbnail: getThumbnailUrl(videoId),
        channelTitle: 'Unknown Channel',
        duration: 'PT0S',
        durationFormatted: '0:00'
      };
    }

    // Create video
    const video = VideoModel.create({
      ...videoData,
      category: categoryId,
      addedFrom: 'url'
    });

    return video;
  }

  /**
   * Add videos from playlist
   */
  async addFromPlaylist(url, categoryId = null) {
    const playlistId = extractPlaylistId(url);

    if (!playlistId) {
      throw errors.validation('Invalid YouTube playlist URL');
    }

    // Fetch playlist items
    const videoIds = await fetchPlaylistItems(playlistId, 50);

    if (videoIds.length === 0) {
      throw errors.notFound('No videos found in playlist');
    }

    const results = {
      imported: 0,
      skipped: 0,
      failed: 0,
      videos: []
    };

    // Process videos
    for (const videoId of videoIds) {
      try {
        // Check if already exists
        const existing = await this.getByYoutubeId(videoId);
        if (existing) {
          results.skipped++;
          continue;
        }

        // Fetch and create
        const videoData = await fetchVideoDetails(videoId);
        const video = VideoModel.create({
          ...videoData,
          category: categoryId,
          addedFrom: 'playlist',
          playlistId
        });

        results.videos.push(video);
        results.imported++;
      } catch (error) {
        console.error(`Failed to import video ${videoId}:`, error.message);
        results.failed++;
      }
    }

    return results;
  }

  /**
   * Update video status
   */
  async updateStatus(id, statusUpdate) {
    const video = VideoModel.findById(id);

    if (!video) {
      throw errors.notFound('Video not found');
    }

    return VideoModel.updateStatus(id, statusUpdate);
  }

  /**
   * Update video category
   */
  async updateCategory(id, categoryId) {
    const video = VideoModel.findById(id);

    if (!video) {
      throw errors.notFound('Video not found');
    }

    return VideoModel.updateCategory(id, categoryId);
  }

  /**
   * Update video tags
   */
  async updateTags(id, tags) {
    const video = VideoModel.findById(id);

    if (!video) {
      throw errors.notFound('Video not found');
    }

    return VideoModel.updateTags(id, tags);
  }

  /**
   * Update video summary (from LLM)
   */
  async updateSummary(id, summaryData) {
    const video = VideoModel.findById(id);

    if (!video) {
      throw errors.notFound('Video not found');
    }

    return VideoModel.updateSummary(id, summaryData);
  }

  /**
   * Delete video
   */
  async delete(id) {
    const video = VideoModel.delete(id);

    if (!video) {
      throw errors.notFound('Video not found');
    }

    return video;
  }

  /**
   * Get video statistics
   */
  async getStats() {
    return VideoModel.getStats();
  }
}

module.exports = new VideoService();
