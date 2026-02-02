require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 3000;
const DB_CONNECT_TIMEOUT_MS = parseInt(process.env.DB_CONNECT_TIMEOUT_MS, 10) || 15000;

// Start server
const startServer = async () => {
  // Test database connection with timeout so we don't hang forever on small servers
  const dbConnected = await Promise.race([
    testConnection(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database connection timeout')), DB_CONNECT_TIMEOUT_MS)
    ),
  ]).then((ok) => ok === true).catch((err) => {
    console.error('❌ Database:', err?.message || err);
    return false;
  });

  if (!dbConnected) {
    console.error('❌ Database connection failed. Please check your .env configuration.');
    process.exit(1);
  }

  // Start listening
  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║      🚂 Camino Travel Platform - Backend API        ║
╠══════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}           ║
║  Environment: ${process.env.NODE_ENV || 'development'.padEnd(27)} ║
║  Database: Connected ✅                              ║
╚══════════════════════════════════════════════════════╝
    `);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

