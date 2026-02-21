-- Run after 01_admins. Ensure you are in gossip_db: USE gossip_db;
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
