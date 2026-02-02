require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 3000;

const { sequelize } = require('./config/database');

// Start server
const startServer = async () => {
  // Test database connection
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('❌ Database connection failed. Please check your .env configuration.');
    process.exit(1);
  }

  // Start listening
  const server = app.listen(PORT, () => {
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

  // Graceful shutdown handler
  const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    server.close(async () => {
      console.log('HTTP server closed.');
      
      try {
        // Close database connections
        await sequelize.close();
        console.log('Database connections closed.');
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  // Handle shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

