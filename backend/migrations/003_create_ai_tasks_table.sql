-- 003_create_ai_tasks_table.sql

-- 创建 ai_tasks 表
CREATE TABLE IF NOT EXISTS ai_tasks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    deleted_at DATETIME(3) NULL,

    user_id BIGINT UNSIGNED NOT NULL,
    work_id BIGINT UNSIGNED NOT NULL,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',

    parameters TEXT,
    result TEXT,
    error TEXT,

    progress INT NOT NULL DEFAULT 0,
    completed_at DATETIME(3) NULL,

    INDEX idx_user_id (user_id),
    INDEX idx_work_id (work_id),
    INDEX idx_status (status),
    INDEX idx_deleted_at (deleted_at),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
