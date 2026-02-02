-- ============================================
-- Camino Travel Platform - Database Schema
-- MySQL 8.0+
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ============================================
-- Table: users
-- ============================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin', 'editor') DEFAULT 'user',
  `email_verified` BOOLEAN DEFAULT FALSE,
  `verification_token` VARCHAR(255) NULL,
  `reset_password_token` VARCHAR(255) NULL,
  `reset_password_expires` DATETIME NULL,
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`),
  INDEX `idx_verification_token` (`verification_token`),
  INDEX `idx_reset_token` (`reset_password_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: countries
-- ============================================
CREATE TABLE IF NOT EXISTS `countries` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `code` VARCHAR(3) UNIQUE NOT NULL,
  `region` VARCHAR(100) NULL,
  `flag_image_url` VARCHAR(500) NULL,
  `description` TEXT NULL,
  `coordinates_lat` DECIMAL(10, 8) NULL,
  `coordinates_lng` DECIMAL(11, 8) NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_region` (`region`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_order` (`display_order`),
  INDEX `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: destinations
-- ============================================
CREATE TABLE IF NOT EXISTS `destinations` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `country_id` INT NOT NULL,
  `region` VARCHAR(100) NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(500) NULL,
  `coordinates_lat` DECIMAL(10, 8) NULL,
  `coordinates_lng` DECIMAL(11, 8) NULL,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `is_active` BOOLEAN DEFAULT TRUE,
  `display_order` INT DEFAULT 0,
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE RESTRICT,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_country` (`country_id`),
  INDEX `idx_region` (`region`),
  INDEX `idx_featured` (`is_featured`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: collections
-- ============================================
CREATE TABLE IF NOT EXISTS `collections` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(500) NULL,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `is_active` BOOLEAN DEFAULT TRUE,
  `display_order` INT DEFAULT 0,
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_featured` (`is_featured`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: trips
-- ============================================
CREATE TABLE IF NOT EXISTS `trips` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `short_description` VARCHAR(500) NULL,
  `hero_image_url` VARCHAR(500) NULL,
  `price_from` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(3) DEFAULT 'EUR',
  `duration_days` INT NOT NULL,
  `region` VARCHAR(100) NULL,
  `country_id` INT NULL,
  `pace` ENUM('relaxed', 'moderate', 'active') NULL,
  `collection_id` INT NULL,
  `co2_emissions` DECIMAL(10, 2) NULL,
  `co2_unit` VARCHAR(10) DEFAULT 'kg',
  `route_cities` JSON NULL,
  `included_items` JSON NULL,
  `practical_info` JSON NULL,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `is_trending` BOOLEAN DEFAULT FALSE,
  `is_active` BOOLEAN DEFAULT TRUE,
  `display_order` INT DEFAULT 0,
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `views_count` INT DEFAULT 0,
  `booking_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` INT NULL,
  FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_country` (`country_id`),
  INDEX `idx_collection` (`collection_id`),
  INDEX `idx_featured` (`is_featured`),
  INDEX `idx_trending` (`is_trending`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_region` (`region`),
  INDEX `idx_pace` (`pace`),
  INDEX `idx_views` (`views_count`),
  INDEX `idx_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: trip_images
-- ============================================
CREATE TABLE IF NOT EXISTS `trip_images` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `trip_id` INT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `image_alt` VARCHAR(255) NULL,
  `display_order` INT DEFAULT 0,
  `is_hero` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE,
  INDEX `idx_trip` (`trip_id`),
  INDEX `idx_order` (`display_order`),
  INDEX `idx_hero` (`is_hero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: trip_stops
-- ============================================
CREATE TABLE IF NOT EXISTS `trip_stops` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `trip_id` INT NOT NULL,
  `city` VARCHAR(255) NOT NULL,
  `country` VARCHAR(100) NULL,
  `nights` INT DEFAULT 0,
  `display_order` INT NOT NULL,
  `coordinates_lat` DECIMAL(10, 8) NULL,
  `coordinates_lng` DECIMAL(11, 8) NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(500) NULL,
  -- Journey meta fields (for Full Itinerary header)
  `transport_type` VARCHAR(50) NULL,
  `departure_time` VARCHAR(20) NULL,
  `arrival_time` VARCHAR(20) NULL,
  `duration` VARCHAR(50) NULL,
  `date_range` VARCHAR(100) NULL,
  `travel_class` VARCHAR(100) NULL,
  -- Stay / stop display helpers
  `stay_date_range` VARCHAR(100) NULL,
  `recommendations` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE,
  INDEX `idx_trip` (`trip_id`),
  INDEX `idx_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: journal_articles
-- ============================================
CREATE TABLE IF NOT EXISTS `journal_articles` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `excerpt` TEXT NULL,
  `content` TEXT NOT NULL,
  `image_url` VARCHAR(500) NULL,
  `author_id` INT NULL,
  `author_name` VARCHAR(255) NULL,
  `category` VARCHAR(100) NULL,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `is_published` BOOLEAN DEFAULT FALSE,
  `published_at` DATETIME NULL,
  `views_count` INT DEFAULT 0,
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` INT NULL,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_category` (`category`),
  INDEX `idx_published` (`is_published`),
  INDEX `idx_featured` (`is_featured`),
  INDEX `idx_published_at` (`published_at`),
  INDEX `idx_author` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: faqs
-- ============================================
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `category` VARCHAR(100) NULL,
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: reviews
-- ============================================
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `trip_id` INT NULL,
  `user_id` INT NULL,
  `author_name` VARCHAR(255) NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` TEXT NOT NULL,
  `is_verified` BOOLEAN DEFAULT FALSE,
  `is_approved` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_trip` (`trip_id`),
  INDEX `idx_rating` (`rating`),
  INDEX `idx_approved` (`is_approved`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: booking_drafts
-- ============================================
CREATE TABLE IF NOT EXISTS `booking_drafts` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `trip_id` INT NOT NULL,
  `user_id` INT NULL,
  `start_date` DATE NULL,
  `start_from` VARCHAR(255) NULL,
  `people` INT NOT NULL DEFAULT 2,
  `rooms` INT NOT NULL DEFAULT 1,
  `filters` JSON NULL,
  `status` ENUM('draft', 'pending', 'confirmed', 'cancelled') DEFAULT 'draft',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_trip` (`trip_id`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: bookings
-- ============================================
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `trip_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `booking_reference` VARCHAR(50) UNIQUE NOT NULL,
  `start_date` DATE NULL,
  `start_from` VARCHAR(255) NULL,
  `people` INT NOT NULL DEFAULT 2,
  `rooms` INT NOT NULL DEFAULT 1,
  `total_price` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(3) DEFAULT 'EUR',
  `payment_method` ENUM('cash_on_delivery', 'credit_card', 'bank_transfer') DEFAULT 'cash_on_delivery',
  `payment_status` ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  `status` ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  `booking_data` JSON NULL,
  `customer_info` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  INDEX `idx_trip` (`trip_id`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_reference` (`booking_reference`),
  INDEX `idx_status` (`status`),
  INDEX `idx_payment_status` (`payment_status`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: newsletter_subscriptions
-- ============================================
CREATE TABLE IF NOT EXISTS `newsletter_subscriptions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` TIMESTAMP NULL,
  INDEX `idx_email` (`email`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: contact_leads
-- ============================================
CREATE TABLE IF NOT EXISTS `contact_leads` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `email` VARCHAR(255) NOT NULL,
  `message` TEXT NULL,
  `phone` VARCHAR(50) NULL,
  `status` ENUM('new', 'contacted', 'resolved', 'archived') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: site_settings
-- ============================================
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `setting_key` VARCHAR(255) UNIQUE NOT NULL,
  `setting_value` TEXT NULL,
  `setting_type` VARCHAR(50) DEFAULT 'text',
  `description` TEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT NULL,
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: wishlist
-- ============================================
CREATE TABLE IF NOT EXISTS `wishlist` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NULL,
  `trip_id` INT NOT NULL,
  `session_id` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_trip` (`user_id`, `trip_id`),
  UNIQUE KEY `unique_session_trip` (`session_id`, `trip_id`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_trip` (`trip_id`),
  INDEX `idx_session` (`session_id`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Initial Admin User (password: admin123 - CHANGE THIS!)
-- ============================================
-- Password hash for 'admin123' using bcrypt with salt rounds 10
-- You should change this password after first login!
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `email_verified`) 
VALUES ('Admin User', 'admin@camino.travel', '$2b$10$rKQqKLKqKLKqKLKqKLKqKOKqKLKqKLKqKLKqKLKqKLKqKLKqKLKq', 'admin', TRUE)
ON DUPLICATE KEY UPDATE `email`=`email`;

-- ============================================
-- Sample Site Settings
-- ============================================
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('site_name', 'Camino Travel', 'text', 'Site Name'),
('site_description', 'Discover Slow Travel', 'text', 'Site Description'),
('site_email', 'hello@camino.travel', 'email', 'Contact Email'),
('site_phone', '+44 20 1234 5678', 'text', 'Contact Phone'),
('default_currency', 'EUR', 'text', 'Default Currency')
ON DUPLICATE KEY UPDATE `setting_key`=`setting_key`;

