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

// ExportHandler 导出处理器
type ExportHandler struct {
	exportService service.ExportService
}

// NewExportHandler 创建导出处理器
func NewExportHandler(exportService service.ExportService) *ExportHandler {
	return &ExportHandler{
		exportService: exportService,
	}
}

// Export 导出作品
func (h *ExportHandler) Export(c *gin.Context) {
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

	var req dto.ExportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	// 设置默认值
	if !req.IncludeChapters && !req.IncludeMetadata && !req.IncludeCharacters {
		req.IncludeChapters = true
		req.IncludeMetadata = true
		req.IncludeCharacters = true
	}

	exportResp, err := h.exportService.Export(userID.(uint), uint(workID), &req)
	if err != nil {
		if errors.Is(err, repository.ErrWorkNotFound) {
			response.NotFound(c, "Work not found")
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			response.Forbidden(c, "Access denied")
			return
		}
		if errors.Is(err, service.ErrUnsupportedFormat) {
			response.BadRequest(c, "Unsupported export format")
			return
		}
		// 检查是否是未实现的格式
		if err.Error() == "DOCX export not implemented yet" ||
			err.Error() == "PDF export not implemented yet" ||
			err.Error() == "EPUB export not implemented yet" {
			response.BadRequest(c, err.Error())
			return
		}
		response.InternalServerError(c, "Failed to export work")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "Export completed successfully",
		"data":    exportResp,
	})
}
