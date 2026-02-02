const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Country = sequelize.define('Country', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(3),
    allowNull: false,
    unique: true,
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  flag_image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  coordinates_lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  coordinates_lng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'countries',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['region'] },
    { fields: ['is_active'] },
    { fields: ['code'] },
  ],
});

Country.associate = (models) => {
  Country.hasMany(models.Destination, { foreignKey: 'country_id', as: 'destinations' });
  Country.hasMany(models.Trip, { foreignKey: 'country_id', as: 'trips' });
};

module.exports = Country;

