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

// WorkHandler 作品处理器
type WorkHandler struct {
	workService service.WorkService
}

// NewWorkHandler 创建作品处理器
func NewWorkHandler(workService service.WorkService) *WorkHandler {
	return &WorkHandler{
		workService: workService,
	}
}

// Create 创建作品
func (h *WorkHandler) Create(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return
	}

	var req dto.CreateWorkRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	workResp, err := h.workService.Create(userID.(uint), &req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidWorkType) {
			response.BadRequest(c, "Invalid work type")
			return
		}
		response.InternalServerError(c, "Failed to create work")
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"code":    201,
		"message": "Work created successfully",
		"data":    workResp,
	})
}

// List 获取作品列表
func (h *WorkHandler) List(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return
	}

	var params dto.WorkQueryParams
	if err := c.ShouldBindQuery(&params); err != nil {
		response.BadRequest(c, "Invalid query parameters")
		return
	}

	listResp, err := h.workService.List(userID.(uint), &params)
	if err != nil {
		response.InternalServerError(c, "Failed to get works")
		return
	}

	response.Success(c, listResp)
}

// GetByID 获取作品详情
func (h *WorkHandler) GetByID(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return
	}

	workID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid work ID")
		return
	}

	workResp, err := h.workService.GetByID(userID.(uint), uint(workID))
	if err != nil {
		if errors.Is(err, repository.ErrWorkNotFound) {
			response.NotFound(c, "Work not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		response.InternalServerError(c, "Failed to get work")
		return
	}

	response.Success(c, workResp)
}

// Update 更新作品
func (h *WorkHandler) Update(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return
	}

	workID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid work ID")
		return
	}

	var req dto.UpdateWorkRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	workResp, err := h.workService.Update(userID.(uint), uint(workID), &req)
	if err != nil {
		if errors.Is(err, repository.ErrWorkNotFound) {
			response.NotFound(c, "Work not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		if errors.Is(err, service.ErrInvalidWorkStatus) {
			response.BadRequest(c, "Invalid work status")
			return
		}
		response.InternalServerError(c, "Failed to update work")
		return
	}

	response.SuccessWithMessage(c, "Work updated successfully", workResp)
}

// Delete 删除作品
func (h *WorkHandler) Delete(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return
	}

	workID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid work ID")
		return
	}

	err = h.workService.Delete(userID.(uint), uint(workID))
	if err != nil {
		if errors.Is(err, repository.ErrWorkNotFound) {
			response.NotFound(c, "Work not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		response.InternalServerError(c, "Failed to delete work")
		return
	}

	response.SuccessWithMessage(c, "Work deleted successfully", nil)
}
