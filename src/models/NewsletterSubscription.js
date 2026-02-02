const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NewsletterSubscription = sequelize.define('NewsletterSubscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  subscribed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  unsubscribed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'newsletter_subscriptions',
  timestamps: false,
  indexes: [
    { fields: ['email'] },
    { fields: ['is_active'] },
  ],
});

module.exports = NewsletterSubscription;

