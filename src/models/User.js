const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'editor'),
    defaultValue: 'user',
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verification_token: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  reset_password_token: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  reset_password_expires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['email'] },
    { fields: ['role'] },
  ],
});

User.associate = (models) => {
  User.hasMany(models.Trip, { foreignKey: 'created_by', as: 'trips' });
  User.hasMany(models.JournalArticle, { foreignKey: 'author_id', as: 'articles' });
  User.hasMany(models.JournalArticle, { foreignKey: 'created_by', as: 'createdArticles' });
  User.hasMany(models.Review, { foreignKey: 'user_id', as: 'reviews' });
  User.hasMany(models.BookingDraft, { foreignKey: 'user_id', as: 'bookings' });
};

module.exports = User;

