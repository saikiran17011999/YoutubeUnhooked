/**
 * SQLite Database Connection (sql.js)
 * Pure JavaScript SQLite - no native compilation needed
 */

const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

let db = null;
let SQL = null;

/**
 * Initialize sql.js and load/create database
 */
async function initializeDatabase() {
  if (db) return db;

  // Initialize sql.js
  SQL = await initSqlJs();

  const dbPath = config.database.path;
  const dbDir = path.dirname(dbPath);

  // Ensure directory exists
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
    console.log(`✅ SQLite database loaded: ${dbPath}`);
  } else {
    db = new SQL.Database();
    console.log(`✅ SQLite database created: ${dbPath}`);
  }

  // Run schema
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.run(schema);

  // Save after schema creation
  saveDatabase();

  return db;
}

/**
 * Get database instance (must call initializeDatabase first)
 */
function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

/**
 * Save database to disk
 */
function saveDatabase() {
  if (!db) return;

  const dbPath = config.database.path;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

/**
 * Close database connection
 */
function closeDatabase() {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
    console.log('Database connection closed');
  }
}

/**
 * Check if database is connected
 */
function isConnected() {
  return db !== null;
}

/**
 * Run a SELECT query and return all results
 */
function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);

  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();

  return results;
}

/**
 * Run a SELECT query and return first result
 */
function get(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);

  let result = null;
  if (stmt.step()) {
    result = stmt.getAsObject();
  }
  stmt.free();

  return result;
}

/**
 * Run a non-SELECT query (INSERT, UPDATE, DELETE)
 */
function run(sql, params = []) {
  db.run(sql, params);
  saveDatabase(); // Auto-save after modifications

  return {
    changes: db.getRowsModified(),
    lastInsertRowid: null // sql.js doesn't provide this easily
  };
}

/**
 * Execute multiple SQL statements
 */
function exec(sql) {
  db.run(sql);
  saveDatabase();
}

/**
 * Generate a UUID
 */
function generateId() {
  return uuidv4();
}

module.exports = {
  initializeDatabase,
  getDatabase,
  saveDatabase,
  closeDatabase,
  isConnected,
  all,
  get,
  run,
  exec,
  generateId
};
