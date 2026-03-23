/**
 * Server Entry Point
 * Starts the Express server and initializes database
 */

const app = require('./app');
const config = require('./config');
const { initializeDatabase, closeDatabase } = require('./database');

async function startServer() {
  try {
    // Initialize SQLite database (async for sql.js)
    console.log('🔄 Initializing SQLite database...');
    await initializeDatabase();

    // Start server
    const server = app.listen(config.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║   Video Knowledge Manager API                     ║
╠═══════════════════════════════════════════════════╣
║   Environment: ${config.env.padEnd(33)}║
║   Port: ${config.port.toString().padEnd(40)}║
║   Database: SQLite (sql.js)${' '.repeat(21)}║
║   API: http://localhost:${config.port}/api/v1${' '.repeat(17)}║
╚═══════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      server.close(() => {
        console.log('HTTP server closed');
        closeDatabase();
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

startServer();
