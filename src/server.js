require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 3000;

// Start server
const startServer = async () => {
  // Test database connection
  const dbConnected = await testConnection();
  
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

