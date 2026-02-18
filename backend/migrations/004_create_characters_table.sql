-- 创建角色表
CREATE TABLE IF NOT EXISTS characters (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    work_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT '角色名称',
    role VARCHAR(50) COMMENT '角色类型：protagonist, antagonist, supporting',
    description TEXT COMMENT '角色描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_work_id (work_id),
    INDEX idx_name (name),
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';
