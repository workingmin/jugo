package model

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

// WorkType 作品类型
type WorkType string

const (
	WorkTypeNovel      WorkType = "novel"
	WorkTypeScreenplay WorkType = "screenplay"
)

// WorkStatus 作品状态
type WorkStatus string

const (
	WorkStatusDraft     WorkStatus = "draft"
	WorkStatusCompleted WorkStatus = "completed"
	WorkStatusPublished WorkStatus = "published"
)

// WorkMetadata 作品元数据
type WorkMetadata struct {
	Snowflake *SnowflakeData `json:"snowflake,omitempty"`
}

// SnowflakeData 雪花写作法数据
type SnowflakeData struct {
	Step1 string                   `json:"step1,omitempty"` // 核心概括
	Step2 string                   `json:"step2,omitempty"` // 扩展大纲
	Step3 []map[string]interface{} `json:"step3,omitempty"` // 角色设定
	Step4 bool                     `json:"step4,omitempty"` // 是否开始正文创作
}

// Scan 实现 sql.Scanner 接口
func (m *WorkMetadata) Scan(value interface{}) error {
	if value == nil {
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("failed to unmarshal WorkMetadata value")
	}
	return json.Unmarshal(bytes, m)
}

// Value 实现 driver.Valuer 接口
func (m WorkMetadata) Value() (driver.Value, error) {
	return json.Marshal(m)
}

// Work 作品模型
type Work struct {
	BaseModel
	UserID         uint         `gorm:"not null;index" json:"userId"`
	Type           WorkType     `gorm:"type:varchar(20);not null;index" json:"type"`
	Title          string       `gorm:"type:varchar(200);not null" json:"title"`
	Topic          string       `gorm:"type:text" json:"topic"`
	Genre          string       `gorm:"type:varchar(50)" json:"genre"`
	Status         WorkStatus   `gorm:"type:varchar(20);default:'draft';index" json:"status"`
	Words          int          `gorm:"default:0" json:"words"`
	NumChapters    int          `gorm:"default:0" json:"numChapters"`
	WordPerChapter int          `gorm:"default:0" json:"wordPerChapter"`
	CoverImage     string       `gorm:"type:varchar(255)" json:"coverImage,omitempty"`
	Metadata       WorkMetadata `gorm:"type:json" json:"metadata,omitempty"`

	// 关联
	User       User        `gorm:"foreignKey:UserID" json:"-"`
	Chapters   []Chapter   `gorm:"foreignKey:WorkID" json:"-"`
	Characters []Character `gorm:"foreignKey:WorkID" json:"-"`
}

// TableName 指定表名
func (Work) TableName() string {
	return "works"
}
