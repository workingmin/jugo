package websocket

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/jugo/backend/config"
	"github.com/jugo/backend/internal/dto"
	"github.com/jugo/backend/internal/service"
	jwtutil "github.com/jugo/backend/pkg/jwt"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // 允许所有来源（生产环境应该限制）
	},
}

// Handler WebSocket处理器
type Handler struct {
	hub         *Hub
	saveService service.SaveService
	cfg         *config.Config
}

// NewHandler 创建WebSocket处理器
func NewHandler(saveService service.SaveService, cfg *config.Config) *Handler {
	handler := &Handler{
		saveService: saveService,
		cfg:         cfg,
	}
	handler.hub = NewHub(handler)
	go handler.hub.Run()
	return handler
}

// HandleConnection 处理WebSocket连接
func (h *Handler) HandleConnection(c *gin.Context) {
	// 从query参数获取token
	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
		return
	}

	// 验证token
	claims, err := jwtutil.ParseToken(token, &h.cfg.JWT)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// 升级HTTP连接为WebSocket
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("Failed to upgrade connection: %v", err)
		return
	}

	// 创建客户端
	client := NewClient(h.hub, conn, claims.UserID)

	// 注册客户端
	h.hub.register <- client

	// 启动读写协程
	go client.writePump()
	go client.readPump()
}

// HandleMessage 实现MessageHandler接口
func (h *Handler) HandleMessage(client *Client, msg *Message) error {
	switch msg.Type {
	case MessageTypeAutosave:
		return h.handleAutosave(client, msg)
	case MessageTypePing:
		return h.handlePing(client)
	default:
		log.Printf("Unknown message type: %s", msg.Type)
		return nil
	}
}

// handleAutosave 处理自动保存消息
func (h *Handler) handleAutosave(client *Client, msg *Message) error {
	// 调用保存服务
	saveResp, err := h.saveService.AutoSave(client.userID, msg.WorkID, &dto.AutoSaveRequest{
		Type:      "chapter",
		ID:        msg.ChapterID,
		Content:   msg.Content,
		Timestamp: msg.Timestamp,
	})

	if err != nil {
		// 发送错误响应
		errorMsg := &Message{
			Type:    MessageTypeAutosaveAck,
			Success: false,
			Error:   err.Error(),
		}
		return client.SendMessage(errorMsg)
	}

	// 发送成功响应
	ackMsg := &Message{
		Type:    MessageTypeAutosaveAck,
		Success: true,
		SavedAt: &saveResp.SavedAt,
		Words:   saveResp.Words,
	}
	return client.SendMessage(ackMsg)
}

// handlePing 处理ping消息
func (h *Handler) handlePing(client *Client) error {
	pongMsg := &Message{
		Type:      MessageTypePong,
		Timestamp: time.Now().Format(time.RFC3339),
	}
	return client.SendMessage(pongMsg)
}

// GetHub 获取Hub实例
func (h *Handler) GetHub() *Hub {
	return h.hub
}
