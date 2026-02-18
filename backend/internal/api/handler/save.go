package handler

import (
	"errors"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jugo/backend/internal/dto"
	"github.com/jugo/backend/internal/repository"
	"github.com/jugo/backend/internal/service"
	"github.com/jugo/backend/pkg/response"
)

// SaveHandler 保存处理器
type SaveHandler struct {
	saveService service.SaveService
}

// NewSaveHandler 创建保存处理器
func NewSaveHandler(saveService service.SaveService) *SaveHandler {
	return &SaveHandler{
		saveService: saveService,
	}
}

// AutoSave 自动保存
func (h *SaveHandler) AutoSave(c *gin.Context) {
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

	var req dto.AutoSaveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	saveResp, err := h.saveService.AutoSave(userID.(uint), uint(workID), &req)
	if err != nil {
		if errors.Is(err, repository.ErrWorkNotFound) {
			response.NotFound(c, "Work not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		if errors.Is(err, service.ErrChapterNotFound) {
			response.NotFound(c, "Chapter not found")
			return
		}
		response.InternalServerError(c, "Failed to auto-save")
		return
	}

	response.SuccessWithMessage(c, "Auto-save successful", saveResp)
}

// ManualSave 手动保存
func (h *SaveHandler) ManualSave(c *gin.Context) {
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

	var req dto.SaveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	saveResp, err := h.saveService.ManualSave(userID.(uint), uint(workID), &req)
	if err != nil {
		if errors.Is(err, repository.ErrWorkNotFound) {
			response.NotFound(c, "Work not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		if errors.Is(err, service.ErrChapterNotFound) {
			response.NotFound(c, "Chapter not found")
			return
		}
		response.InternalServerError(c, "Failed to save")
		return
	}

	response.SuccessWithMessage(c, "Save successful", saveResp)
}
