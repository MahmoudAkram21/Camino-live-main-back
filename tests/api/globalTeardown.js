module.exports = async () => {
  try {
    const models = require('../../src/models');
    if (models && models.sequelize) {
      await models.sequelize.close();
    }
  } catch {
    // ignore teardown errors
  }
};


