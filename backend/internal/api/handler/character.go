package handler

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jugo/backend/internal/dto"
	"github.com/jugo/backend/internal/repository"
	"github.com/jugo/backend/internal/service"
	"github.com/jugo/backend/pkg/response"
)

// CharacterHandler 角色处理器
type CharacterHandler struct {
	characterService service.CharacterService
}

// NewCharacterHandler 创建角色处理器
func NewCharacterHandler(characterService service.CharacterService) *CharacterHandler {
	return &CharacterHandler{
		characterService: characterService,
	}
}

// Create 创建角色
func (h *CharacterHandler) Create(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return
	}

	workID, err := strconv.ParseUint(c.Param("workId"), 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid work ID")
		return
	}

	var req dto.CreateCharacterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	characterResp, err := h.characterService.Create(userID.(uint), uint(workID), &req)
	if err != nil {
		if errors.Is(err, repository.ErrWorkNotFound) {
			response.NotFound(c, "Work not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		response.InternalServerError(c, "Failed to create character")
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"code":    201,
		"message": "Character created successfully",
		"data":    characterResp,
	})
}

// List 获取角色列表
func (h *CharacterHandler) List(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return
	}

	workID, err := strconv.ParseUint(c.Param("workId"), 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid work ID")
		return
	}

	listResp, err := h.characterService.List(userID.(uint), uint(workID))
	if err != nil {
		if errors.Is(err, repository.ErrWorkNotFound) {
			response.NotFound(c, "Work not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		response.InternalServerError(c, "Failed to get characters")
		return
	}

	response.Success(c, listResp)
}

// GetByID 获取角色详情
func (h *CharacterHandler) GetByID(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return
	}

	characterID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid character ID")
		return
	}

	characterResp, err := h.characterService.GetByID(userID.(uint), uint(characterID))
	if err != nil {
		if errors.Is(err, repository.ErrCharacterNotFound) || errors.Is(err, service.ErrCharacterNotFound) {
			response.NotFound(c, "Character not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		response.InternalServerError(c, "Failed to get character")
		return
	}

	response.Success(c, characterResp)
}

// Update 更新角色
func (h *CharacterHandler) Update(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return
	}

	characterID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid character ID")
		return
	}

	var req dto.UpdateCharacterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	characterResp, err := h.characterService.Update(userID.(uint), uint(characterID), &req)
	if err != nil {
		if errors.Is(err, repository.ErrCharacterNotFound) || errors.Is(err, service.ErrCharacterNotFound) {
			response.NotFound(c, "Character not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		response.InternalServerError(c, "Failed to update character")
		return
	}

	response.SuccessWithMessage(c, "Character updated successfully", characterResp)
}

// Delete 删除角色
func (h *CharacterHandler) Delete(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return
	}

	characterID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid character ID")
		return
	}

	err = h.characterService.Delete(userID.(uint), uint(characterID))
	if err != nil {
		if errors.Is(err, repository.ErrCharacterNotFound) || errors.Is(err, service.ErrCharacterNotFound) {
			response.NotFound(c, "Character not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		response.InternalServerError(c, "Failed to delete character")
		return
	}

	response.SuccessWithMessage(c, "Character deleted successfully", nil)
}
