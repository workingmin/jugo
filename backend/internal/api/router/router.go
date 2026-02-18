package router

import (
	"github.com/gin-gonic/gin"
	"github.com/jugo/backend/internal/api/handler"
	"github.com/jugo/backend/internal/api/middleware"
	"go.uber.org/zap"
)

// Setup 设置路由
func Setup(logger *zap.Logger) *gin.Engine {
	r := gin.New()

	// 全局中间件
	r.Use(middleware.RequestID())
	r.Use(middleware.Logger(logger))
	r.Use(middleware.Recovery(logger))
	r.Use(middleware.CORS())

	// 健康检查
	healthHandler := handler.NewHealthHandler()
	r.GET("/health", healthHandler.Check)

	// API v1 路由组（待实现）
	// v1 := r.Group("/api/v1")
	// {
	// 	// 认证相关路由
	// 	auth := v1.Group("/auth")
	// 	{
	// 		auth.POST("/register", authHandler.Register)
	// 		auth.POST("/login", authHandler.Login)
	// 	}
	//
	// 	// 作品相关路由
	// 	works := v1.Group("/works")
	// 	works.Use(middleware.Auth())
	// 	{
	// 		works.GET("", workHandler.List)
	// 		works.POST("", workHandler.Create)
	// 	}
	// }

	return r
}
