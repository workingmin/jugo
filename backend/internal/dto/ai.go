package dto

import "time"

// ContinueRequest AI续写请求
type ContinueRequest struct {
	WorkID  uint   `json:"workId" binding:"required"`
	Type    string `json:"type" binding:"required,oneof=novel screenplay"` // novel or screenplay
	Context string `json:"context" binding:"required"`                     // 前文内容
	Length  int    `json:"length" binding:"required,min=100,max=5000"`     // 续写长度
	Style   string `json:"style"`                                          // 风格要求
}

// PolishRequest AI润色请求
type PolishRequest struct {
	WorkID  uint   `json:"workId" binding:"required"`
	Content string `json:"content" binding:"required"` // 需要润色的内容
	Style   string `json:"style"`                      // 风格要求
}

// ExpandRequest AI扩写请求
type ExpandRequest struct {
	WorkID  uint   `json:"workId" binding:"required"`
	Content string `json:"content" binding:"required"`        // 需要扩写的内容
	Length  int    `json:"length" binding:"required,min=100"` // 扩写后的目标长度
	Focus   string `json:"focus"`                             // 扩写重点
}

// RewriteRequest AI改写请求
type RewriteRequest struct {
	WorkID  uint   `json:"workId" binding:"required"`
	Content string `json:"content" binding:"required"` // 需要改写的内容
	Style   string `json:"style"`                      // 改写风格
	Tone    string `json:"tone"`                       // 改写语气
}

// AITaskResponse AI任务响应
type AITaskResponse struct {
	TaskID        uint   `json:"taskId"`
	Status        string `json:"status"`
	EstimatedTime int    `json:"estimatedTime,omitempty"` // 预计完成时间（秒）
}

// TaskStatusResponse 任务状态响应
type TaskStatusResponse struct {
	TaskID      uint       `json:"taskId"`
	Status      string     `json:"status"`
	Progress    int        `json:"progress"` // 0-100
	Result      string     `json:"result,omitempty"`
	Error       string     `json:"error,omitempty"`
	CreatedAt   time.Time  `json:"createdAt"`
	CompletedAt *time.Time `json:"completedAt,omitempty"`
}

// OutlineRequest AI大纲生成请求
type OutlineRequest struct {
	WorkID      uint   `json:"workId" binding:"required"`
	Topic       string `json:"topic" binding:"required,min=5,max=500"`       // 主题
	Genre       string `json:"genre" binding:"required"`                     // 类型（都市、玄幻、科幻等）
	NumChapters int    `json:"numChapters" binding:"required,min=1,max=100"` // 章节数量
	Style       string `json:"style"`                                        // 风格要求
}

// NovelToScreenplayRequest 小说转剧本请求
type NovelToScreenplayRequest struct {
	WorkID         uint `json:"workId" binding:"required"`
	TargetDuration int  `json:"targetDuration,omitempty"` // 目标时长（分钟）
	NumScenes      int  `json:"numScenes,omitempty"`      // 场景数量
}

// ScreenplayToNovelRequest 剧本转小说请求
type ScreenplayToNovelRequest struct {
	WorkID         uint `json:"workId" binding:"required"`
	NumChapters    int  `json:"numChapters,omitempty"`    // 章节数
	WordPerChapter int  `json:"wordPerChapter,omitempty"` // 每章字数
}
