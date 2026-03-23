/**
 * Database Module
 * Exports database connection utilities
 */

const {
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
} = require('./connection');

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
