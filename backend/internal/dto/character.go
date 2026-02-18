package dto

import "time"

// CreateCharacterRequest 创建角色请求
type CreateCharacterRequest struct {
	Name        string `json:"name" binding:"required,min=1,max=100"`
	Role        string `json:"role" binding:"omitempty,oneof=protagonist antagonist supporting"`
	Description string `json:"description" binding:"omitempty,max=5000"`
}

// UpdateCharacterRequest 更新角色请求
type UpdateCharacterRequest struct {
	Name        string `json:"name" binding:"omitempty,min=1,max=100"`
	Role        string `json:"role" binding:"omitempty,oneof=protagonist antagonist supporting"`
	Description string `json:"description" binding:"omitempty,max=5000"`
}

// CharacterResponse 角色响应
type CharacterResponse struct {
	CharacterID uint      `json:"characterId"`
	WorkID      uint      `json:"workId"`
	Name        string    `json:"name"`
	Role        string    `json:"role"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// CharacterListItem 角色列表项
type CharacterListItem struct {
	CharacterID uint      `json:"characterId"`
	WorkID      uint      `json:"workId"`
	Name        string    `json:"name"`
	Role        string    `json:"role"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// CharacterListResponse 角色列表响应
type CharacterListResponse struct {
	Characters []CharacterListItem `json:"characters"`
}
