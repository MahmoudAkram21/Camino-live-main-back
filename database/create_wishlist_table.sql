-- ============================================
-- Create wishlist table
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;

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

