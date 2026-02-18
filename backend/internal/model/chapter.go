package model

// ChapterStatus 章节状态
type ChapterStatus string

const (
	ChapterStatusDraft     ChapterStatus = "draft"
	ChapterStatusCompleted ChapterStatus = "completed"
)

// Chapter 章节模型
type Chapter struct {
	BaseModel
	WorkID   uint          `gorm:"not null;index" json:"workId"`
	Title    string        `gorm:"type:varchar(200);not null" json:"title"`
	Content  string        `gorm:"type:longtext" json:"content"`
	Words    int           `gorm:"default:0" json:"words"`
	OrderNum int           `gorm:"not null;index:idx_work_order" json:"order"`
	Status   ChapterStatus `gorm:"type:varchar(20);default:'draft'" json:"status"`

	// 关联
	Work Work `gorm:"foreignKey:WorkID" json:"-"`
}

// TableName 指定表名
func (Chapter) TableName() string {
	return "chapters"
}
