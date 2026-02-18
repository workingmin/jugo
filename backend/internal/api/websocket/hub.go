package websocket

import (
	"encoding/json"
	"log"
	"sync"
)

// BroadcastMessage 广播消息
type BroadcastMessage struct {
	client  *Client
	message []byte
}

// Hub WebSocket连接管理中心
type Hub struct {
	// 已注册的客户端
	clients map[*Client]bool

	// 按用户ID索引的客户端
	userClients map[uint]*Client

	// 广播消息通道
	broadcast chan *BroadcastMessage

	// 注册客户端通道
	register chan *Client

	// 注销客户端通道
	unregister chan *Client

	// 消息处理器
	messageHandler MessageHandler

	// 互斥锁
	mu sync.RWMutex
}

// MessageHandler 消息处理器接口
type MessageHandler interface {
	HandleMessage(client *Client, msg *Message) error
}

// NewHub 创建新的Hub
func NewHub(handler MessageHandler) *Hub {
	return &Hub{
		clients:        make(map[*Client]bool),
		userClients:    make(map[uint]*Client),
		broadcast:      make(chan *BroadcastMessage),
		register:       make(chan *Client),
		unregister:     make(chan *Client),
		messageHandler: handler,
	}
}

// Run 运行Hub
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.userClients[client.userID] = client
			h.mu.Unlock()
			log.Printf("Client registered: userID=%d", client.userID)

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				delete(h.userClients, client.userID)
				close(client.send)
				log.Printf("Client unregistered: userID=%d", client.userID)
			}
			h.mu.Unlock()

		case broadcastMsg := <-h.broadcast:
			// 解析消息
			var msg Message
			if err := json.Unmarshal(broadcastMsg.message, &msg); err != nil {
				log.Printf("Failed to unmarshal message: %v", err)
				continue
			}

			// 处理消息
			if h.messageHandler != nil {
				if err := h.messageHandler.HandleMessage(broadcastMsg.client, &msg); err != nil {
					log.Printf("Failed to handle message: %v", err)
					// 发送错误响应
					errorMsg := &Message{
						Type:  MessageTypeError,
						Error: err.Error(),
					}
					broadcastMsg.client.SendMessage(errorMsg)
				}
			}
		}
	}
}

// SendToUser 发送消息给指定用户
func (h *Hub) SendToUser(userID uint, msg *Message) error {
	h.mu.RLock()
	client, ok := h.userClients[userID]
	h.mu.RUnlock()

	if !ok {
		return nil // 用户不在线，忽略
	}

	return client.SendMessage(msg)
}

// GetClientCount 获取在线客户端数量
func (h *Hub) GetClientCount() int {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return len(h.clients)
}
