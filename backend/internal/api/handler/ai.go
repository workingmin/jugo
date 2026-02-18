package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jugo/backend/internal/dto"
	"github.com/jugo/backend/internal/service"
	"github.com/jugo/backend/pkg/response"
)

// AIHandler AI处理器
type AIHandler struct {
	aiService service.AIService
}

// NewAIHandler 创建AI处理器
func NewAIHandler(aiService service.AIService) *AIHandler {
	return &AIHandler{
		aiService: aiService,
	}
}

// Continue AI续写
func (h *AIHandler) Continue(c *gin.Context) {
	var req dto.ContinueRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request: "+err.Error())
		return
	}

	// 从上下文获取用户ID
	userID, exists := c.Get("userID")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	resp, err := h.aiService.Continue(userID.(uint), &req)
	if err != nil {
		if err == service.ErrWorkNotFound {
			response.Error(c, http.StatusNotFound, "Work not found")
			return
		}
		if err == service.ErrUnauthorized {
			response.Error(c, http.StatusForbidden, "Forbidden")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to create AI task: "+err.Error())
		return
	}

	response.Success(c, resp)
}

// Polish AI润色
func (h *AIHandler) Polish(c *gin.Context) {
	var req dto.PolishRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request: "+err.Error())
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	resp, err := h.aiService.Polish(userID.(uint), &req)
	if err != nil {
		if err == service.ErrWorkNotFound {
			response.Error(c, http.StatusNotFound, "Work not found")
			return
		}
		if err == service.ErrUnauthorized {
			response.Error(c, http.StatusForbidden, "Forbidden")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to create AI task: "+err.Error())
		return
	}

	response.Success(c, resp)
}

// Expand AI扩写
func (h *AIHandler) Expand(c *gin.Context) {
	var req dto.ExpandRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request: "+err.Error())
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	resp, err := h.aiService.Expand(userID.(uint), &req)
	if err != nil {
		if err == service.ErrWorkNotFound {
			response.Error(c, http.StatusNotFound, "Work not found")
			return
		}
		if err == service.ErrUnauthorized {
			response.Error(c, http.StatusForbidden, "Forbidden")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to create AI task: "+err.Error())
		return
	}

	response.Success(c, resp)
}

// Rewrite AI改写
func (h *AIHandler) Rewrite(c *gin.Context) {
	var req dto.RewriteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request: "+err.Error())
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	resp, err := h.aiService.Rewrite(userID.(uint), &req)
	if err != nil {
		if err == service.ErrWorkNotFound {
			response.Error(c, http.StatusNotFound, "Work not found")
			return
		}
		if err == service.ErrUnauthorized {
			response.Error(c, http.StatusForbidden, "Forbidden")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to create AI task: "+err.Error())
		return
	}

	response.Success(c, resp)
}

// GetTaskStatus 获取任务状态
func (h *AIHandler) GetTaskStatus(c *gin.Context) {
	taskIDStr := c.Param("id")
	taskID, err := strconv.ParseUint(taskIDStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid task ID")
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	resp, err := h.aiService.GetTaskStatus(userID.(uint), uint(taskID))
	if err != nil {
		if err == service.ErrAITaskNotFound {
			response.Error(c, http.StatusNotFound, "Task not found")
			return
		}
		if err == service.ErrUnauthorized {
			response.Error(c, http.StatusForbidden, "Forbidden")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to get task status: "+err.Error())
		return
	}

	response.Success(c, resp)
}

// GenerateOutline AI大纲生成
func (h *AIHandler) GenerateOutline(c *gin.Context) {
	var req dto.OutlineRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request: "+err.Error())
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	resp, err := h.aiService.GenerateOutline(userID.(uint), &req)
	if err != nil {
		if err == service.ErrWorkNotFound {
			response.Error(c, http.StatusNotFound, "Work not found")
			return
		}
		if err == service.ErrUnauthorized {
			response.Error(c, http.StatusForbidden, "Forbidden")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to create AI task: "+err.Error())
		return
	}

	response.Success(c, resp)
}

// ConvertNovelToScreenplay 小说转剧本
func (h *AIHandler) ConvertNovelToScreenplay(c *gin.Context) {
	var req dto.NovelToScreenplayRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request: "+err.Error())
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	resp, err := h.aiService.ConvertNovelToScreenplay(userID.(uint), &req)
	if err != nil {
		if err == service.ErrWorkNotFound {
			response.Error(c, http.StatusNotFound, "Work not found")
			return
		}
		if err == service.ErrUnauthorized {
			response.Error(c, http.StatusForbidden, "Forbidden")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to create AI task: "+err.Error())
		return
	}

	response.Success(c, resp)
}

// ConvertScreenplayToNovel 剧本转小说
func (h *AIHandler) ConvertScreenplayToNovel(c *gin.Context) {
	var req dto.ScreenplayToNovelRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request: "+err.Error())
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	resp, err := h.aiService.ConvertScreenplayToNovel(userID.(uint), &req)
	if err != nil {
		if err == service.ErrWorkNotFound {
			response.Error(c, http.StatusNotFound, "Work not found")
			return
		}
		if err == service.ErrUnauthorized {
			response.Error(c, http.StatusForbidden, "Forbidden")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to create AI task: "+err.Error())
		return
	}

	response.Success(c, resp)
}
