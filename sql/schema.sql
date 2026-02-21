-- Run once to create database and tables.
--
-- Option A - Command line (recommended; runs all statements):
--   mysql -u root -p < sql/schema.sql
--
-- Option B - GUI client: run each block below separately in order.
--   First: create DB and use it. Then: 01_admins, then 02_posts, then 03_reactions.

CREATE DATABASE IF NOT EXISTS gossip_db;
USE gossip_db;

-- 1) Admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2) Posts table
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  title VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  media_url VARCHAR(1000),
  media_type ENUM('image', 'video') DEFAULT 'image',
  thumbs_up_count INT DEFAULT 0,
  thumbs_down_count INT DEFAULT 0,
  heart_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
  INDEX idx_created_at (created_at DESC)
);

-- 3) Reactions table
CREATE TABLE IF NOT EXISTS reactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_identifier VARCHAR(255) NOT NULL COMMENT 'device_id or user_id from app',
  reaction_type ENUM('thumbs_up', 'thumbs_down', 'heart') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_post (post_id, user_identifier),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id)
);
