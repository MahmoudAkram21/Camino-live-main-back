const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BookingDraft = sequelize.define('BookingDraft', {
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
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
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
  filters: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'confirmed', 'cancelled'),
    defaultValue: 'draft',
  },
}, {
  tableName: 'booking_drafts',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['trip_id'] },
    { fields: ['user_id'] },
    { fields: ['status'] },
  ],
});

BookingDraft.associate = (models) => {
  BookingDraft.belongsTo(models.Trip, { foreignKey: 'trip_id', as: 'trip' });
  BookingDraft.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

module.exports = BookingDraft;

