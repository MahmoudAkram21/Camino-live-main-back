require('dotenv').config();
const { sequelize } = require('../src/config/database');
const models = require('../src/models');

/**
 * Clear existing trips, destinations, collections, journal articles, and FAQs
 * Then run migration and seed
 */
async function clearAndReseed() {
  try {
    console.log('🗑️  Clearing existing data...\n');

    // Clear in correct order (respecting foreign keys)
    console.log('  - Deleting reviews...');
    await models.Review.destroy({ where: {}, force: true });

    console.log('  - Deleting bookings...');
    await models.Booking.destroy({ where: {}, force: true });

    console.log('  - Deleting booking drafts...');
    await models.BookingDraft.destroy({ where: {}, force: true });

    console.log('  - Deleting trip stops...');
    await models.TripStop.destroy({ where: {}, force: true });

    console.log('  - Deleting trip images...');
    await models.TripImage.destroy({ where: {}, force: true });

    console.log('  - Deleting trips...');
    await models.Trip.destroy({ where: {}, force: true });

    console.log('  - Deleting journal articles...');
    await models.JournalArticle.destroy({ where: {}, force: true });

    console.log('  - Deleting destinations...');
    await models.Destination.destroy({ where: {}, force: true });

    console.log('  - Deleting collections...');
    await models.Collection.destroy({ where: {}, force: true });

    console.log('  - Deleting FAQs...');
    await models.FAQ.destroy({ where: {}, force: true });

    console.log('\n✅ All data cleared successfully!\n');

    // Run migration to add language fields
    console.log('🔄 Running migration to add language fields...\n');
    const addLanguageFields = require('./add_language_fields_safe');
    await addLanguageFields();

    // Run seeders
    console.log('\n🌱 Running seeders...\n');
    const runSeeders = require('../src/database/seeders/runSeeders');
    await runSeeders();

    console.log('\n🎉 Complete! Database cleared, migrated, and seeded with bilingual data.');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  clearAndReseed();
}

module.exports = clearAndReseed;

