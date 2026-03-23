-- Video Knowledge Manager Database Schema
-- SQLite Database (sql.js compatible)

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    color TEXT DEFAULT '#6366f1',
    icon TEXT DEFAULT 'folder',
    is_default INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    youtube_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    thumbnail TEXT NOT NULL,
    channel_title TEXT DEFAULT '',
    channel_id TEXT DEFAULT '',
    duration TEXT DEFAULT 'PT0S',
    duration_formatted TEXT DEFAULT '0:00',
    published_at TEXT,
    tags TEXT DEFAULT '[]',
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    category_id TEXT,
    watched INTEGER DEFAULT 0,
    favorite INTEGER DEFAULT 0,
    watch_again INTEGER DEFAULT 0,
    summary TEXT DEFAULT '',
    key_points TEXT DEFAULT '[]',
    topics TEXT DEFAULT '[]',
    user_tags TEXT DEFAULT '[]',
    added_from TEXT DEFAULT 'url',
    playlist_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    video_id TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp INTEGER,
    type TEXT DEFAULT 'general',
    color TEXT,
    is_pinned INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_videos_youtube_id ON videos(youtube_id);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_watched ON videos(watched);
CREATE INDEX IF NOT EXISTS idx_videos_favorite ON videos(favorite);
CREATE INDEX IF NOT EXISTS idx_videos_watch_again ON videos(watch_again);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_video_id ON notes(video_id);
CREATE INDEX IF NOT EXISTS idx_notes_timestamp ON notes(video_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
