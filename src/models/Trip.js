const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trip = sequelize.define('Trip', {
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
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  title_en: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  title_ar: {
    type: DataTypes.STRING(255),
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
  short_description: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  short_description_en: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  short_description_ar: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  hero_image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  price_from: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'EUR',
  },
  duration_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  country_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'countries',
      key: 'id',
    },
  },
  pace: {
    type: DataTypes.ENUM('relaxed', 'moderate', 'active'),
    allowNull: true,
  },
  collection_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'collections',
      key: 'id',
    },
  },
  co2_emissions: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  co2_unit: {
    type: DataTypes.STRING(10),
    defaultValue: 'kg',
  },
  route_cities: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  included_items: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  practical_info: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_trending: {
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
  meta_title_en: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  meta_title_ar: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  meta_description_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  meta_description_ar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  booking_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'trips',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['slug'] },
    { fields: ['country_id'] },
    { fields: ['collection_id'] },
    { fields: ['is_featured'] },
    { fields: ['is_trending'] },
    { fields: ['is_active'] },
    { fields: ['region'] },
    { fields: ['pace'] },
  ],
});

Trip.associate = (models) => {
  Trip.belongsTo(models.Country, { foreignKey: 'country_id', as: 'country' });
  Trip.belongsTo(models.Collection, { foreignKey: 'collection_id', as: 'collection' });
  Trip.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
  Trip.hasMany(models.TripImage, { foreignKey: 'trip_id', as: 'images' });
  Trip.hasMany(models.TripStop, { foreignKey: 'trip_id', as: 'stops' });
  Trip.hasMany(models.Review, { foreignKey: 'trip_id', as: 'reviews' });
  Trip.hasMany(models.BookingDraft, { foreignKey: 'trip_id', as: 'bookingDrafts' });
  Trip.hasMany(models.Wishlist, { foreignKey: 'trip_id', as: 'wishlists' });
};

module.exports = Trip;

