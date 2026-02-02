const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TripStop = sequelize.define('TripStop', {
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
  city: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  city_en: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  city_ar: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  nights: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  display_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  coordinates_lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  coordinates_lng: {
    type: DataTypes.DECIMAL(11, 8),
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
  // Journey meta used for the Full Itinerary header
  transport_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  departure_time: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  arrival_time: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  date_range: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  travel_class: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  // Stay-specific date range
  stay_date_range: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  recommendations: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'trip_stops',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['trip_id'] },
    { fields: ['display_order'] },
  ],
});

TripStop.associate = (models) => {
  TripStop.belongsTo(models.Trip, { foreignKey: 'trip_id', as: 'trip' });
};

module.exports = TripStop;

