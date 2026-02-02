/**
 * Script to check and fix active trips
 * 
 * Usage:
 * node database/fixActiveTrips.js [action] [tripId]
 * 
 * Actions:
 * - check: Show all active trips
 * - deactivate-all: Set all trips to inactive
 * - activate-one <tripId>: Set only the specified trip to active
 * 
 * Example:
 * node database/fixActiveTrips.js check
 * node database/fixActiveTrips.js deactivate-all
 * node database/fixActiveTrips.js activate-one 1
 */

require('dotenv').config();
const { sequelize } = require('../src/config/database');
const models = require('../src/models');

async function checkActiveTrips() {
  try {
    const trips = await models.Trip.findAll({
      where: { is_active: true },
      attributes: ['id', 'slug', 'title', 'is_active'],
      order: [['id', 'ASC']],
    });

    console.log('\n✅ Active Trips:');
    console.log('─'.repeat(60));
    if (trips.length === 0) {
      console.log('No active trips found.');
    } else {
      trips.forEach(trip => {
        console.log(`ID: ${trip.id} | Slug: ${trip.slug} | Title: ${trip.title}`);
      });
      console.log(`\nTotal: ${trips.length} active trip(s)`);
    }
    console.log('─'.repeat(60));
  } catch (error) {
    console.error('Error checking trips:', error);
  }
}

async function deactivateAllTrips() {
  try {
    const result = await models.Trip.update(
      { is_active: false },
      { where: {} }
    );

    console.log(`\n✅ Deactivated ${result[0]} trip(s)`);
  } catch (error) {
    console.error('Error deactivating trips:', error);
  }
}

async function activateOnlyOne(tripId) {
  try {
    // First, deactivate all
    await models.Trip.update(
      { is_active: false },
      { where: {} }
    );

    // Then activate only the specified trip
    const trip = await models.Trip.findByPk(tripId);
    if (!trip) {
      console.error(`\n❌ Trip with ID ${tripId} not found`);
      return;
    }

    trip.is_active = true;
    await trip.save();

    console.log(`\n✅ Activated only trip ID ${tripId}: ${trip.title}`);
    console.log(`   All other trips have been deactivated.`);
  } catch (error) {
    console.error('Error activating trip:', error);
  }
}

async function main() {
  const action = process.argv[2];
  const tripId = process.argv[3];

  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    switch (action) {
      case 'check':
        await checkActiveTrips();
        break;
      case 'deactivate-all':
        await deactivateAllTrips();
        break;
      case 'activate-one':
        if (!tripId) {
          console.error('❌ Please provide a trip ID: node database/fixActiveTrips.js activate-one <tripId>');
          process.exit(1);
        }
        await activateOnlyOne(parseInt(tripId));
        break;
      default:
        console.log('Usage:');
        console.log('  node database/fixActiveTrips.js check              - Show all active trips');
        console.log('  node database/fixActiveTrips.js deactivate-all     - Set all trips to inactive');
        console.log('  node database/fixActiveTrips.js activate-one <id>  - Activate only the specified trip');
        process.exit(1);
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await sequelize.close();
    process.exit(1);
  }
}

main();

