package model

import (
	"time"
)

// BaseModel 基础模型
type BaseModel struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// User 用户模型（示例）
type User struct {
	BaseModel
	Username string `gorm:"uniqueIndex;size:50;not null" json:"username"`
	Email    string `gorm:"uniqueIndex;size:100;not null" json:"email"`
	Password string `gorm:"size:255;not null" json:"-"`
	Avatar   string `gorm:"size:255" json:"avatar"`
	Status   int    `gorm:"default:1" json:"status"` // 1:正常 0:禁用
}

// TableName 指定表名
func (User) TableName() string {
	return "users"
}
