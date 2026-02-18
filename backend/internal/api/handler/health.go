package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jugo/backend/internal/pkg"
	"github.com/jugo/backend/pkg/response"
)

// HealthHandler 健康检查处理器
type HealthHandler struct{}

// NewHealthHandler 创建健康检查处理器
func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

// Check 健康检查
func (h *HealthHandler) Check(c *gin.Context) {
	// 检查数据库连接
	db := pkg.GetDB()
	sqlDB, err := db.DB()
	if err != nil {
		response.Error(c, http.StatusServiceUnavailable, "database connection failed")
		return
	}

	if err := sqlDB.Ping(); err != nil {
		response.Error(c, http.StatusServiceUnavailable, "database ping failed")
		return
	}

	// 检查Redis连接
	redis := pkg.GetRedis()
	if err := redis.Ping(c.Request.Context()).Err(); err != nil {
		response.Error(c, http.StatusServiceUnavailable, "redis connection failed")
		return
	}

	response.Success(c, gin.H{
		"status":   "healthy",
		"database": "connected",
		"redis":    "connected",
	})
}
