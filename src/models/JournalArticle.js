const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JournalArticle = sequelize.define('JournalArticle', {
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
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  excerpt_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  excerpt_ar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  content_ar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  author_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  published_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  meta_title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: 'journal_articles',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['slug'] },
    { fields: ['category'] },
    { fields: ['is_published'] },
    { fields: ['is_featured'] },
    { fields: ['published_at'] },
    { fields: ['author_id'] },
  ],
});

JournalArticle.associate = (models) => {
  JournalArticle.belongsTo(models.User, { foreignKey: 'author_id', as: 'author' });
  JournalArticle.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
};

module.exports = JournalArticle;

