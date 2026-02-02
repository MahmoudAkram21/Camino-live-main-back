const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TripImage = sequelize.define('TripImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  trip_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trips',
      key: 'id',
    },
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  image_alt: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_hero: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'trip_images',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['trip_id'] },
    { fields: ['display_order'] },
  ],
});

TripImage.associate = (models) => {
  TripImage.belongsTo(models.Trip, { foreignKey: 'trip_id', as: 'trip' });
};

module.exports = TripImage;

