const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Destination = sequelize.define('Destination', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  name_en: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  name_ar: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  country_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'countries',
      key: 'id',
    },
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description_ar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(500),
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
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  meta_title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'destinations',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['slug'] },
    { fields: ['country_id'] },
    { fields: ['region'] },
    { fields: ['is_featured'] },
    { fields: ['is_active'] },
  ],
});

Destination.associate = (models) => {
  Destination.belongsTo(models.Country, { foreignKey: 'country_id', as: 'country' });
};

module.exports = Destination;

