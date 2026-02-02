const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FAQ = sequelize.define('FAQ', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  question_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  question_ar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answer_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  answer_ar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'faqs',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['category'] },
    { fields: ['is_active'] },
    { fields: ['display_order'] },
  ],
});

module.exports = FAQ;

