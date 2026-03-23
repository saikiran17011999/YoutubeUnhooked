/**
 * Videos Feature Tests
 * Test structure for the videos module (SQLite)
 */

const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Set test database path before requiring app
process.env.DATABASE_PATH = path.join(__dirname, 'test.db');

const app = require('../src/app');
const { initializeDatabase, getDatabase, closeDatabase } = require('../src/database');
const VideoModel = require('../src/features/videos/model/video.model');
const CategoryModel = require('../src/features/categories/model/category.model');

// Test data
const testVideo = {
  youtubeId: 'dQw4w9WgXcQ',
  title: 'Test Video',
  description: 'Test description',
  thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  channelTitle: 'Test Channel',
  duration: 'PT3M32S',
  durationFormatted: '3:32'
};

describe('Videos API', () => {
  beforeAll(() => {
    // Initialize test database
    initializeDatabase();
  });

  beforeEach(() => {
    // Clear tables before each test
    const db = getDatabase();
    db.exec('DELETE FROM notes');
    db.exec('DELETE FROM videos');
    db.exec('DELETE FROM categories');
  });

  afterAll(() => {
    closeDatabase();
    // Remove test database file
    const testDbPath = process.env.DATABASE_PATH;
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    // Remove WAL files if they exist
    if (fs.existsSync(testDbPath + '-wal')) {
      fs.unlinkSync(testDbPath + '-wal');
    }
    if (fs.existsSync(testDbPath + '-shm')) {
      fs.unlinkSync(testDbPath + '-shm');
    }
  });

  describe('GET /api/v1/videos', () => {
    it('should return empty array when no videos exist', async () => {
      const res = await request(app)
        .get('/api/v1/videos')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toEqual([]);
      expect(res.body.data.pagination.total).toBe(0);
    });

    it('should return videos with pagination', async () => {
      // Create test videos
      VideoModel.create({ ...testVideo, youtubeId: 'video1' });
      VideoModel.create({ ...testVideo, youtubeId: 'video2' });
      VideoModel.create({ ...testVideo, youtubeId: 'video3' });

      const res = await request(app)
        .get('/api/v1/videos')
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(2);
      expect(res.body.data.pagination.total).toBe(3);
      expect(res.body.data.pagination.pages).toBe(2);
    });

    it('should filter videos by status', async () => {
      const video1 = VideoModel.create({ ...testVideo, youtubeId: 'video1' });
      VideoModel.create({ ...testVideo, youtubeId: 'video2' });

      // Mark first as watched
      VideoModel.updateStatus(video1._id, { watched: true });

      const res = await request(app)
        .get('/api/v1/videos')
        .query({ status: 'watched' })
        .expect(200);

      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.items[0].status.watched).toBe(true);
    });
  });

  describe('GET /api/v1/videos/:id', () => {
    it('should return a single video by ID', async () => {
      const video = VideoModel.create(testVideo);

      const res = await request(app)
        .get(`/api/v1/videos/${video._id}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.youtubeId).toBe(testVideo.youtubeId);
    });

    it('should return 404 for non-existent video', async () => {
      const fakeId = 'non-existent-id';

      const res = await request(app)
        .get(`/api/v1/videos/${fakeId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /api/v1/videos', () => {
    it('should reject invalid YouTube URL', async () => {
      const res = await request(app)
        .post('/api/v1/videos')
        .send({ url: 'not-a-valid-url' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PATCH /api/v1/videos/:id/status', () => {
    it('should update video status', async () => {
      const video = VideoModel.create(testVideo);

      const res = await request(app)
        .patch(`/api/v1/videos/${video._id}/status`)
        .send({ watched: true, favorite: true })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status.watched).toBe(true);
      expect(res.body.data.status.favorite).toBe(true);
    });

    it('should reject empty status update', async () => {
      const video = VideoModel.create(testVideo);

      const res = await request(app)
        .patch(`/api/v1/videos/${video._id}/status`)
        .send({})
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/videos/:id', () => {
    it('should delete a video', async () => {
      const video = VideoModel.create(testVideo);

      await request(app)
        .delete(`/api/v1/videos/${video._id}`)
        .expect(204);

      const deletedVideo = VideoModel.findById(video._id);
      expect(deletedVideo).toBeNull();
    });

    it('should return 404 when deleting non-existent video', async () => {
      const fakeId = 'non-existent-id';

      const res = await request(app)
        .delete(`/api/v1/videos/${fakeId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/videos/stats', () => {
    it('should return video statistics', async () => {
      // Create test videos with different statuses
      const video1 = VideoModel.create({ ...testVideo, youtubeId: 'video1' });
      VideoModel.create({ ...testVideo, youtubeId: 'video2' });

      VideoModel.updateStatus(video1._id, { watched: true, favorite: true });

      const res = await request(app)
        .get('/api/v1/videos/stats')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(2);
      expect(res.body.data.watched).toBe(1);
      expect(res.body.data.favorites).toBe(1);
    });
  });
});
