-- Run after 02_posts. Ensure you are in gossip_db: USE gossip_db;
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
