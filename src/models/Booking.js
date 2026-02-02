const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
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
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  booking_reference: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  start_from: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  people: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
  },
  rooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'EUR',
  },
  payment_method: {
    type: DataTypes.ENUM('cash_on_delivery', 'credit_card', 'bank_transfer'),
    defaultValue: 'cash_on_delivery',
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending',
  },
  booking_data: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  customer_info: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'bookings',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['trip_id'] },
    { fields: ['user_id'] },
    { fields: ['booking_reference'] },
    { fields: ['status'] },
    { fields: ['payment_status'] },
    { fields: ['created_at'] },
  ],
});

Booking.associate = (models) => {
  Booking.belongsTo(models.Trip, { foreignKey: 'trip_id', as: 'trip' });
  Booking.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

module.exports = Booking;

