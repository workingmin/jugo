package websocket

import "time"

// MessageType 消息类型
type MessageType string

const (
	MessageTypeAutosave    MessageType = "autosave"
	MessageTypeAutosaveAck MessageType = "autosave_ack"
	MessageTypeAIProgress  MessageType = "ai_progress"
	MessageTypePing        MessageType = "ping"
	MessageTypePong        MessageType = "pong"
	MessageTypeError       MessageType = "error"
)

// Message WebSocket消息
type Message struct {
	Type      MessageType `json:"type"`
	WorkID    uint        `json:"workId,omitempty"`
	ChapterID uint        `json:"chapterId,omitempty"`
	Content   string      `json:"content,omitempty"`
	Timestamp string      `json:"timestamp,omitempty"`
	Success   bool        `json:"success,omitempty"`
	SavedAt   *time.Time  `json:"savedAt,omitempty"`
	Words     int         `json:"words,omitempty"`
	TaskID    string      `json:"taskId,omitempty"`
	Progress  int         `json:"progress,omitempty"`
	Message   string      `json:"message,omitempty"`
	Error     string      `json:"error,omitempty"`
}
