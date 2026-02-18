package dto

import (
	"time"

	"github.com/jugo/backend/internal/model"
)

// CreateWorkRequest 创建作品请求
type CreateWorkRequest struct {
	Type           string `json:"type" binding:"required,oneof=novel screenplay"`
	Title          string `json:"title" binding:"required,min=1,max=200"`
	Topic          string `json:"topic" binding:"omitempty,max=1000"`
	Genre          string `json:"genre" binding:"omitempty,max=50"`
	NumChapters    int    `json:"numChapters" binding:"omitempty,min=0,max=1000"`
	WordPerChapter int    `json:"wordPerChapter" binding:"omitempty,min=0,max=10000"`
}

// UpdateWorkRequest 更新作品请求
type UpdateWorkRequest struct {
	Title          string `json:"title" binding:"omitempty,min=1,max=200"`
	Topic          string `json:"topic" binding:"omitempty,max=1000"`
	Genre          string `json:"genre" binding:"omitempty,max=50"`
	Status         string `json:"status" binding:"omitempty,oneof=draft completed published"`
	NumChapters    int    `json:"numChapters" binding:"omitempty,min=0"`
	WordPerChapter int    `json:"wordPerChapter" binding:"omitempty,min=0"`
	CoverImage     string `json:"coverImage" binding:"omitempty,url"`
	Metadata       string `json:"metadata" binding:"omitempty"` // JSON string
}

// WorkResponse 作品响应
type WorkResponse struct {
	WorkID         uint                `json:"workId"`
	Type           string              `json:"type"`
	Title          string              `json:"title"`
	Topic          string              `json:"topic,omitempty"`
	Genre          string              `json:"genre,omitempty"`
	Status         string              `json:"status"`
	Words          int                 `json:"words"`
	NumChapters    int                 `json:"numChapters"`
	WordPerChapter int                 `json:"wordPerChapter"`
	CoverImage     string              `json:"coverImage,omitempty"`
	Metadata       *model.WorkMetadata `json:"metadata,omitempty"`
	CreatedAt      time.Time           `json:"createdAt"`
	UpdatedAt      time.Time           `json:"updatedAt"`
}

// WorkListItem 作品列表项
type WorkListItem struct {
	WorkID      uint      `json:"workId"`
	Type        string    `json:"type"`
	Title       string    `json:"title"`
	Genre       string    `json:"genre,omitempty"`
	Status      string    `json:"status"`
	Words       int       `json:"words"`
	NumChapters int       `json:"numChapters"`
	CoverImage  string    `json:"coverImage,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// WorkListResponse 作品列表响应
type WorkListResponse struct {
	Works      []WorkListItem `json:"works"`
	Pagination Pagination     `json:"pagination"`
}

// Pagination 分页信息
type Pagination struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	Total      int `json:"total"`
	TotalPages int `json:"totalPages"`
}

// WorkQueryParams 作品查询参数
type WorkQueryParams struct {
	Type   string `form:"type" binding:"omitempty,oneof=novel screenplay all"`
	Status string `form:"status" binding:"omitempty,oneof=draft completed published all"`
	Page   int    `form:"page" binding:"omitempty,min=1"`
	Limit  int    `form:"limit" binding:"omitempty,min=1,max=100"`
	Sort   string `form:"sort" binding:"omitempty,oneof=updatedAt createdAt words title"`
}
