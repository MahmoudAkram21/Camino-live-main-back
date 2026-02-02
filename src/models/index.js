const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');

const models = {};

// Read all model files
const modelFiles = fs.readdirSync(__dirname).filter(
  (file) => file.endsWith('.js') && file !== 'index.js'
);

// Import all models
modelFiles.forEach((file) => {
  const model = require(path.join(__dirname, file));
  const modelName = model.name || file.replace('.js', '');
  models[modelName] = model;
});

// Define associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = require('sequelize');

module.exports = models;

