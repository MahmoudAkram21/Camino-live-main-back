require('dotenv').config();
const { sequelize } = require('../../config/database');
const models = require('../../models');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

// Import individual seeders
const seedUsers = require('./seedUsers');
const seedCountries = require('./seedCountries');
const seedDestinations = require('./seedDestinations');
const seedCollections = require('./seedCollections');
const seedTrips = require('./seedTrips');
const seedJournal = require('./seedJournal');
const seedFAQs = require('./seedFAQs');
const seedReviews = require('./seedReviews');
const seedSettings = require('./seedSettings');

const runSeeders = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Sync models (optional - only if tables don't exist)
    // await sequelize.sync({ force: false, alter: true });
    
    // Clear existing data (optional - uncomment if you want to reset)
    // console.log('🗑️  Clearing existing data...');
    // await clearAllData();
    // console.log('✅ Data cleared\n');

    // Run seeders in order (due to foreign key dependencies)
    console.log('👤 Seeding users...');
    const users = await seedUsers(models);
    console.log(`✅ Created ${users.length} users\n`);

    console.log('🌍 Seeding countries...');
    const countries = await seedCountries(models);
    console.log(`✅ Created ${countries.length} countries\n`);

    console.log('📍 Seeding destinations...');
    const destinations = await seedDestinations(models, countries);
    console.log(`✅ Created ${destinations.length} destinations\n`);

    console.log('📚 Seeding collections...');
    const collections = await seedCollections(models);
    console.log(`✅ Created ${collections.length} collections\n`);

    console.log('✈️  Seeding trips...');
    const trips = await seedTrips(models, countries, collections, users);
    console.log(`✅ Created ${trips.length} trips\n`);

    console.log('📰 Seeding journal articles...');
    const articles = await seedJournal(models, users);
    console.log(`✅ Created ${articles.length} journal articles\n`);

    console.log('❓ Seeding FAQs...');
    const faqs = await seedFAQs(models);
    console.log(`✅ Created ${faqs.length} FAQs\n`);

    console.log('⭐ Seeding reviews...');
    const reviews = await seedReviews(models, trips, users);
    console.log(`✅ Created ${reviews.length} reviews\n`);

    console.log('⚙️  Seeding site settings...');
    const settings = await seedSettings(models);
    console.log(`✅ Created ${settings.length} site settings\n`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Countries: ${countries.length}`);
    console.log(`   - Destinations: ${destinations.length}`);
    console.log(`   - Collections: ${collections.length}`);
    console.log(`   - Trips: ${trips.length}`);
    console.log(`   - Journal Articles: ${articles.length}`);
    console.log(`   - FAQs: ${faqs.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
    console.log(`   - Settings: ${settings.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

// Optional: Clear all data function
const clearAllData = async () => {
  // Note: Order matters due to foreign keys
  await models.Review.destroy({ where: {}, force: true });
  await models.TripStop.destroy({ where: {}, force: true });
  await models.TripImage.destroy({ where: {}, force: true });
  await models.BookingDraft.destroy({ where: {}, force: true });
  await models.Trip.destroy({ where: {}, force: true });
  await models.JournalArticle.destroy({ where: {}, force: true });
  await models.Destination.destroy({ where: {}, force: true });
  await models.Collection.destroy({ where: {}, force: true });
  await models.FAQ.destroy({ where: {}, force: true });
  await models.NewsletterSubscription.destroy({ where: {}, force: true });
  await models.ContactLead.destroy({ where: {}, force: true });
  await models.SiteSetting.destroy({ where: {}, force: true });
  await models.Country.destroy({ where: {}, force: true });
  await models.User.destroy({ where: {}, force: true });
};

// Run if called directly
if (require.main === module) {
  runSeeders();
}

module.exports = runSeeders;

