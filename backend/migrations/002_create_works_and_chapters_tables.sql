-- 创建作品表
CREATE TABLE IF NOT EXISTS works (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type VARCHAR(20) NOT NULL COMMENT 'novel, screenplay',
    title VARCHAR(200) NOT NULL,
    topic TEXT,
    genre VARCHAR(50),
    status VARCHAR(20) DEFAULT 'draft' COMMENT 'draft, completed, published',
    words INT DEFAULT 0,
    num_chapters INT DEFAULT 0,
    word_per_chapter INT DEFAULT 0,
    cover_image VARCHAR(255),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_updated_at (updated_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作品表';

-- 创建章节表
CREATE TABLE IF NOT EXISTS chapters (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    work_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT,
    words INT DEFAULT 0,
    order_num INT NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' COMMENT 'draft, completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_work_id (work_id),
    INDEX idx_work_order (work_id, order_num),
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='章节表';
