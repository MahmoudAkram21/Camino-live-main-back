const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Wishlist = sequelize.define('Wishlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  trip_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trips',
      key: 'id',
    },
  },
  session_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'wishlist',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['trip_id'] },
    { fields: ['session_id'] },
    { fields: ['created_at'] },
  ],
});

Wishlist.associate = (models) => {
  Wishlist.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  Wishlist.belongsTo(models.Trip, { foreignKey: 'trip_id', as: 'trip' });
};

module.exports = Wishlist;

