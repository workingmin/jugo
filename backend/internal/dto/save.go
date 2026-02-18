package dto

import "time"

// AutoSaveRequest 自动保存请求
type AutoSaveRequest struct {
	Type      string `json:"type" binding:"required,oneof=chapter scene"`
	ID        uint   `json:"id" binding:"required"`
	Content   string `json:"content" binding:"required"`
	Timestamp string `json:"timestamp" binding:"omitempty"`
}

// SaveRequest 手动保存请求
type SaveRequest struct {
	Type    string `json:"type" binding:"required,oneof=chapter scene"`
	ID      uint   `json:"id" binding:"required"`
	Content string `json:"content" binding:"required"`
}

// SaveResponse 保存响应
type SaveResponse struct {
	SavedAt time.Time `json:"savedAt"`
	Words   int       `json:"words"`
	Version int       `json:"version,omitempty"` // 预留版本号字段
}
