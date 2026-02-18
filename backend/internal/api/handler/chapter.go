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

// ChapterHandler 章节处理器
type ChapterHandler struct {
	chapterService service.ChapterService
}

// NewChapterHandler 创建章节处理器
func NewChapterHandler(chapterService service.ChapterService) *ChapterHandler {
	return &ChapterHandler{
		chapterService: chapterService,
	}
}

// Create 创建章节
func (h *ChapterHandler) Create(c *gin.Context) {
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

	var req dto.CreateChapterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	chapterResp, err := h.chapterService.Create(userID.(uint), uint(workID), &req)
	if err != nil {
		if errors.Is(err, repository.ErrWorkNotFound) {
			response.NotFound(c, "Work not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		response.InternalServerError(c, "Failed to create chapter")
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"code":    201,
		"message": "Chapter created successfully",
		"data":    chapterResp,
	})
}

// List 获取章节列表
func (h *ChapterHandler) List(c *gin.Context) {
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

	listResp, err := h.chapterService.List(userID.(uint), uint(workID))
	if err != nil {
		if errors.Is(err, repository.ErrWorkNotFound) {
			response.NotFound(c, "Work not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		response.InternalServerError(c, "Failed to get chapters")
		return
	}

	response.Success(c, listResp)
}

// GetByID 获取章节详情
func (h *ChapterHandler) GetByID(c *gin.Context) {
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

	chapterID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid chapter ID")
		return
	}

	chapterResp, err := h.chapterService.GetByID(userID.(uint), uint(workID), uint(chapterID))
	if err != nil {
		if errors.Is(err, repository.ErrWorkNotFound) || errors.Is(err, service.ErrChapterNotFound) {
			response.NotFound(c, "Chapter not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		response.InternalServerError(c, "Failed to get chapter")
		return
	}

	response.Success(c, chapterResp)
}

// Update 更新章节
func (h *ChapterHandler) Update(c *gin.Context) {
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

	chapterID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid chapter ID")
		return
	}

	var req dto.UpdateChapterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	chapterResp, err := h.chapterService.Update(userID.(uint), uint(workID), uint(chapterID), &req)
	if err != nil {
		if errors.Is(err, repository.ErrWorkNotFound) || errors.Is(err, service.ErrChapterNotFound) {
			response.NotFound(c, "Chapter not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		response.InternalServerError(c, "Failed to update chapter")
		return
	}

	response.SuccessWithMessage(c, "Chapter updated successfully", chapterResp)
}

// Delete 删除章节
func (h *ChapterHandler) Delete(c *gin.Context) {
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

	chapterID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid chapter ID")
		return
	}

	err = h.chapterService.Delete(userID.(uint), uint(workID), uint(chapterID))
	if err != nil {
		if errors.Is(err, repository.ErrWorkNotFound) || errors.Is(err, service.ErrChapterNotFound) {
			response.NotFound(c, "Chapter not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		response.InternalServerError(c, "Failed to delete chapter")
		return
	}

	response.SuccessWithMessage(c, "Chapter deleted successfully", nil)
}
