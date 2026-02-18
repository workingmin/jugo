package model

import (
	"time"

	"gorm.io/gorm"
)

// AITaskType AI任务类型
type AITaskType string

const (
	AITaskTypeContinue          AITaskType = "continue"            // 续写
	AITaskTypePolish            AITaskType = "polish"              // 润色
	AITaskTypeExpand            AITaskType = "expand"              // 扩写
	AITaskTypeRewrite           AITaskType = "rewrite"             // 改写
	AITaskTypeOutline           AITaskType = "outline"             // 大纲生成
	AITaskTypeNovelToScreenplay AITaskType = "novel_to_screenplay" // 小说转剧本
	AITaskTypeScreenplayToNovel AITaskType = "screenplay_to_novel" // 剧本转小说
)

// AITaskStatus AI任务状态
type AITaskStatus string

const (
	AITaskStatusPending    AITaskStatus = "pending"    // 等待中
	AITaskStatusProcessing AITaskStatus = "processing" // 处理中
	AITaskStatusCompleted  AITaskStatus = "completed"  // 已完成
	AITaskStatusFailed     AITaskStatus = "failed"     // 失败
)

// AITask AI任务模型
type AITask struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// 基本信息
	UserID uint         `gorm:"not null;index" json:"userId"`
	WorkID uint         `gorm:"not null;index" json:"workId"`
	Type   AITaskType   `gorm:"type:varchar(20);not null" json:"type"`
	Status AITaskStatus `gorm:"type:varchar(20);not null;default:'pending'" json:"status"`

	// 任务参数（JSON格式存储）
	Parameters string `gorm:"type:text" json:"parameters"`

	// 任务结果
	Result string `gorm:"type:text" json:"result"`
	Error  string `gorm:"type:text" json:"error"`

	// 进度信息
	Progress int `gorm:"default:0" json:"progress"` // 0-100

	// 完成时间
	CompletedAt *time.Time `json:"completedAt,omitempty"`

	// 关联
	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Work *Work `gorm:"foreignKey:WorkID" json:"work,omitempty"`
}
