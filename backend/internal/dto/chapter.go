package dto

import "time"

// CreateChapterRequest 创建章节请求
type CreateChapterRequest struct {
	Title    string `json:"title" binding:"required,min=1,max=200"`
	Content  string `json:"content" binding:"omitempty"`
	OrderNum int    `json:"order" binding:"required,min=1"`
}

// UpdateChapterRequest 更新章节请求
type UpdateChapterRequest struct {
	Title    string `json:"title" binding:"omitempty,min=1,max=200"`
	Content  string `json:"content" binding:"omitempty"`
	OrderNum int    `json:"order" binding:"omitempty,min=1"`
	Status   string `json:"status" binding:"omitempty,oneof=draft completed"`
}

// ChapterResponse 章节响应
type ChapterResponse struct {
	ChapterID uint      `json:"chapterId"`
	WorkID    uint      `json:"workId"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Words     int       `json:"words"`
	Order     int       `json:"order"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// ChapterListItem 章节列表项
type ChapterListItem struct {
	ChapterID uint      `json:"chapterId"`
	WorkID    uint      `json:"workId"`
	Title     string    `json:"title"`
	Words     int       `json:"words"`
	Order     int       `json:"order"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// ChapterListResponse 章节列表响应
type ChapterListResponse struct {
	Chapters []ChapterListItem `json:"chapters"`
}
