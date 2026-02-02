const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SiteSetting = sequelize.define('SiteSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  setting_key: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  setting_value: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  setting_type: {
    type: DataTypes.STRING(50),
    defaultValue: 'text',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'site_settings',
  timestamps: true,
  underscored: true,
  createdAt: false,
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['setting_key'] },
  ],
});

SiteSetting.associate = (models) => {
  SiteSetting.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updater' });
};

module.exports = SiteSetting;

