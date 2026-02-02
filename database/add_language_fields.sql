-- ============================================
-- Migration: Add Language Fields (English & Arabic)
-- Add title_en, title_ar, description_en, description_ar, etc. to all tables
-- Run this script to add language support to existing database
-- ============================================

-- Add language fields to trips table
ALTER TABLE `trips` 
ADD COLUMN `title_en` VARCHAR(255) NULL AFTER `title`,
ADD COLUMN `title_ar` VARCHAR(255) NULL AFTER `title_en`,
ADD COLUMN `description_en` TEXT NULL AFTER `description`,
ADD COLUMN `description_ar` TEXT NULL AFTER `description_en`,
ADD COLUMN `short_description_en` VARCHAR(500) NULL AFTER `short_description`,
ADD COLUMN `short_description_ar` VARCHAR(500) NULL AFTER `short_description_en`;

-- Add language fields to collections table
ALTER TABLE `collections` 
ADD COLUMN `title_en` VARCHAR(255) NULL AFTER `title`,
ADD COLUMN `title_ar` VARCHAR(255) NULL AFTER `title_en`,
ADD COLUMN `description_en` TEXT NULL AFTER `description`,
ADD COLUMN `description_ar` TEXT NULL AFTER `description_en`;

-- Add language fields to destinations table
ALTER TABLE `destinations` 
ADD COLUMN `name_en` VARCHAR(255) NULL AFTER `name`,
ADD COLUMN `name_ar` VARCHAR(255) NULL AFTER `name_en`,
ADD COLUMN `description_en` TEXT NULL AFTER `description`,
ADD COLUMN `description_ar` TEXT NULL AFTER `description_en`;

-- Add language fields to journal_articles table
ALTER TABLE `journal_articles` 
ADD COLUMN `title_en` VARCHAR(255) NULL AFTER `title`,
ADD COLUMN `title_ar` VARCHAR(255) NULL AFTER `title_en`,
ADD COLUMN `excerpt_en` TEXT NULL AFTER `excerpt`,
ADD COLUMN `excerpt_ar` TEXT NULL AFTER `excerpt_en`,
ADD COLUMN `content_en` TEXT NULL AFTER `content`,
ADD COLUMN `content_ar` TEXT NULL AFTER `content_en`;

-- Add language fields to trip_stops table
ALTER TABLE `trip_stops` 
ADD COLUMN `city_en` VARCHAR(255) NULL AFTER `city`,
ADD COLUMN `city_ar` VARCHAR(255) NULL AFTER `city_en`,
ADD COLUMN `description_en` TEXT NULL AFTER `description`,
ADD COLUMN `description_ar` TEXT NULL AFTER `description_en`;

-- Add language fields to faqs table
ALTER TABLE `faqs` 
ADD COLUMN `question_en` TEXT NULL AFTER `question`,
ADD COLUMN `question_ar` TEXT NULL AFTER `question_en`,
ADD COLUMN `answer_en` TEXT NULL AFTER `answer`,
ADD COLUMN `answer_ar` TEXT NULL AFTER `answer_en`;
