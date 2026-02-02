require('dotenv').config();
const path = require('path');
const fs = require('fs');

/**
 * Migration Runner
 * Executes all migration files in order
 */
async function runMigrations() {
  console.log('🔄 Starting database migrations...\n');

  try {
    // Get migrations directory
    const migrationsDir = __dirname;
    
    // Get all migration files (sorted alphabetically to ensure order)
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js') && file !== 'runMigrations.js')
      .sort();

    if (migrationFiles.length === 0) {
      console.log('ℹ️  No migration files found.');
      console.log('💡 To create a migration, add a .js file in src/database/migrations/\n');
      return;
    }

    console.log(`📋 Found ${migrationFiles.length} migration(s) to run:\n`);

    // Run each migration
    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      console.log(`  → Running: ${file}`);
      
      try {
        const migration = require(migrationPath);
        
        // Support both default export and direct function export
        const migrationFn = migration.default || migration;
        
        if (typeof migrationFn === 'function') {
          await migrationFn();
          console.log(`  ✓ Completed: ${file}\n`);
        } else {
          console.log(`  ⚠️  Skipped: ${file} (not a function)\n`);
        }
      } catch (error) {
        console.error(`  ❌ Error in ${file}:`, error.message);
        throw error;
      }
    }

    console.log('✅ All migrations completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration runner failed:', error);
      process.exit(1);
    });
}

module.exports = runMigrations;
