/**
 * YouTube Utilities
 * Functions for extracting video IDs, metadata, and interacting with YouTube API
 */

const axios = require('axios');
const config = require('../config');

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null
 */
function extractVideoId(url) {
  const patterns = [
    // Standard watch URL
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&]+)/,
    // Short URL
    /youtu\.be\/([^?]+)/,
    // Embed URL
    /youtube\.com\/embed\/([^?]+)/,
    // Shorts URL
    /youtube\.com\/shorts\/([^?]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extract playlist ID from YouTube URL
 * @param {string} url - YouTube playlist URL
 * @returns {string|null} - Playlist ID or null
 */
function extractPlaylistId(url) {
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : null;
}

/**
 * Check if URL is a YouTube playlist
 * @param {string} url - URL to check
 * @returns {boolean}
 */
function isPlaylistUrl(url) {
  return url.includes('playlist?list=') || url.includes('&list=');
}

/**
 * Format ISO 8601 duration to readable format
 * @param {string} duration - ISO 8601 duration (e.g., PT5M30S)
 * @returns {string} - Readable format (e.g., 5:30)
 */
function formatDuration(duration) {
  if (!duration) return '0:00';

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Fetch video details from YouTube API
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} - Video metadata
 */
async function fetchVideoDetails(videoId) {
  const { apiKey, baseUrl } = config.youtube;

  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  const response = await axios.get(`${baseUrl}/videos`, {
    params: {
      part: 'snippet,contentDetails,statistics',
      id: videoId,
      key: apiKey
    }
  });

  if (!response.data.items || response.data.items.length === 0) {
    throw new Error(`Video not found: ${videoId}`);
  }

  const item = response.data.items[0];
  const { snippet, contentDetails, statistics } = item;

  return {
    youtubeId: videoId,
    title: snippet.title,
    description: snippet.description,
    thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
    channelTitle: snippet.channelTitle,
    channelId: snippet.channelId,
    publishedAt: snippet.publishedAt,
    duration: contentDetails.duration,
    durationFormatted: formatDuration(contentDetails.duration),
    tags: snippet.tags || [],
    viewCount: parseInt(statistics.viewCount || 0, 10),
    likeCount: parseInt(statistics.likeCount || 0, 10)
  };
}

/**
 * Fetch playlist items from YouTube API
 * @param {string} playlistId - YouTube playlist ID
 * @param {number} maxResults - Maximum videos to fetch
 * @returns {Promise<Array>} - Array of video IDs
 */
async function fetchPlaylistItems(playlistId, maxResults = 50) {
  const { apiKey, baseUrl } = config.youtube;

  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  const videoIds = [];
  let nextPageToken = null;

  do {
    const response = await axios.get(`${baseUrl}/playlistItems`, {
      params: {
        part: 'contentDetails',
        playlistId,
        maxResults: Math.min(50, maxResults - videoIds.length),
        pageToken: nextPageToken,
        key: apiKey
      }
    });

    const items = response.data.items || [];
    for (const item of items) {
      videoIds.push(item.contentDetails.videoId);
    }

    nextPageToken = response.data.nextPageToken;
  } while (nextPageToken && videoIds.length < maxResults);

  return videoIds;
}

/**
 * Generate thumbnail URL for a video
 * @param {string} videoId - YouTube video ID
 * @param {string} quality - Thumbnail quality (default, medium, high, maxres)
 * @returns {string} - Thumbnail URL
 */
function getThumbnailUrl(videoId, quality = 'high') {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault'
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality] || 'hqdefault'}.jpg`;
}

module.exports = {
  extractVideoId,
  extractPlaylistId,
  isPlaylistUrl,
  formatDuration,
  fetchVideoDetails,
  fetchPlaylistItems,
  getThumbnailUrl
};
