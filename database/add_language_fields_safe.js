require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

/**
 * Safe migration script to add language fields
 * This script checks if columns exist before adding them
 */
async function addLanguageFields() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'camino_db',
    multipleStatements: true,
  });

  try {
    console.log('🔄 Starting language fields migration...\n');

    // Helper function to check if column exists
    async function columnExists(tableName, columnName) {
      const [rows] = await connection.execute(
        `SELECT COUNT(*) as count 
         FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = ? 
         AND TABLE_NAME = ? 
         AND COLUMN_NAME = ?`,
        [process.env.DB_NAME || 'camino_db', tableName, columnName]
      );
      return rows[0].count > 0;
    }

    // Helper function to add column if it doesn't exist
    async function addColumnIfNotExists(tableName, columnDef, afterColumn) {
      const columnName = columnDef.match(/`(\w+)`/)?.[1];
      if (!columnName) {
        console.error(`Invalid column definition: ${columnDef}`);
        return;
      }

      const exists = await columnExists(tableName, columnName);
      if (exists) {
        console.log(`  ✓ Column ${tableName}.${columnName} already exists`);
        return;
      }

      try {
        const sql = `ALTER TABLE \`${tableName}\` ADD COLUMN ${columnDef}${afterColumn ? ` AFTER \`${afterColumn}\`` : ''}`;
        await connection.execute(sql);
        console.log(`  ✓ Added column ${tableName}.${columnName}`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`  ✓ Column ${tableName}.${columnName} already exists (duplicate detected)`);
        } else {
          throw error;
        }
      }
    }

    // Add language fields to trips table
    console.log('📝 Adding language fields to trips table...');
    await addColumnIfNotExists('trips', '`title_en` VARCHAR(255) NULL', 'title');
    await addColumnIfNotExists('trips', '`title_ar` VARCHAR(255) NULL', 'title_en');
    await addColumnIfNotExists('trips', '`description_en` TEXT NULL', 'description');
    await addColumnIfNotExists('trips', '`description_ar` TEXT NULL', 'description_en');
    await addColumnIfNotExists('trips', '`short_description_en` VARCHAR(500) NULL', 'short_description');
    await addColumnIfNotExists('trips', '`short_description_ar` VARCHAR(500) NULL', 'short_description_en');
    await addColumnIfNotExists('trips', '`meta_title_en` VARCHAR(255) NULL', 'meta_title');
    await addColumnIfNotExists('trips', '`meta_title_ar` VARCHAR(255) NULL', 'meta_title_en');
    await addColumnIfNotExists('trips', '`meta_description_en` TEXT NULL', 'meta_description');
    await addColumnIfNotExists('trips', '`meta_description_ar` TEXT NULL', 'meta_description_en');

    // Add language fields to collections table
    console.log('\n📝 Adding language fields to collections table...');
    await addColumnIfNotExists('collections', '`title_en` VARCHAR(255) NULL', 'title');
    await addColumnIfNotExists('collections', '`title_ar` VARCHAR(255) NULL', 'title_en');
    await addColumnIfNotExists('collections', '`description_en` TEXT NULL', 'description');
    await addColumnIfNotExists('collections', '`description_ar` TEXT NULL', 'description_en');

    // Add language fields to destinations table
    console.log('\n📝 Adding language fields to destinations table...');
    await addColumnIfNotExists('destinations', '`name_en` VARCHAR(255) NULL', 'name');
    await addColumnIfNotExists('destinations', '`name_ar` VARCHAR(255) NULL', 'name_en');
    await addColumnIfNotExists('destinations', '`description_en` TEXT NULL', 'description');
    await addColumnIfNotExists('destinations', '`description_ar` TEXT NULL', 'description_en');

    // Add language fields to journal_articles table
    console.log('\n📝 Adding language fields to journal_articles table...');
    await addColumnIfNotExists('journal_articles', '`title_en` VARCHAR(255) NULL', 'title');
    await addColumnIfNotExists('journal_articles', '`title_ar` VARCHAR(255) NULL', 'title_en');
    await addColumnIfNotExists('journal_articles', '`excerpt_en` TEXT NULL', 'excerpt');
    await addColumnIfNotExists('journal_articles', '`excerpt_ar` TEXT NULL', 'excerpt_en');
    await addColumnIfNotExists('journal_articles', '`content_en` TEXT NULL', 'content');
    await addColumnIfNotExists('journal_articles', '`content_ar` TEXT NULL', 'content_en');

    // Add language fields to trip_stops table
    console.log('\n📝 Adding language fields to trip_stops table...');
    await addColumnIfNotExists('trip_stops', '`city_en` VARCHAR(255) NULL', 'city');
    await addColumnIfNotExists('trip_stops', '`city_ar` VARCHAR(255) NULL', 'city_en');
    await addColumnIfNotExists('trip_stops', '`description_en` TEXT NULL', 'description');
    await addColumnIfNotExists('trip_stops', '`description_ar` TEXT NULL', 'description_en');

    // Add language fields to faqs table
    console.log('\n📝 Adding language fields to faqs table...');
    await addColumnIfNotExists('faqs', '`question_en` TEXT NULL', 'question');
    await addColumnIfNotExists('faqs', '`question_ar` TEXT NULL', 'question_en');
    await addColumnIfNotExists('faqs', '`answer_en` TEXT NULL', 'answer');
    await addColumnIfNotExists('faqs', '`answer_ar` TEXT NULL', 'answer_en');

    console.log('\n✅ Language fields migration completed successfully!');
    console.log('\n💡 Next step: Run "npm run seed" to populate the database with bilingual data.');

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run if called directly
if (require.main === module) {
  addLanguageFields()
    .then(() => {
      console.log('\n✨ Migration script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addLanguageFields;

