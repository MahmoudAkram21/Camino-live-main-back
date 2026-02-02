const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ContactLead = sequelize.define('ContactLead', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'resolved', 'archived'),
    defaultValue: 'new',
  },
}, {
  tableName: 'contact_leads',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['email'] },
    { fields: ['status'] },
    { fields: ['created_at'] },
  ],
});

module.exports = ContactLead;

