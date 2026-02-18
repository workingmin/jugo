package router

import (
	"github.com/gin-gonic/gin"
	"github.com/jugo/backend/config"
	"github.com/jugo/backend/internal/api/handler"
	"github.com/jugo/backend/internal/api/middleware"
	"github.com/jugo/backend/internal/api/websocket"
	"github.com/jugo/backend/internal/repository"
	"github.com/jugo/backend/internal/service"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

// Setup 设置路由
func Setup(logger *zap.Logger, db *gorm.DB, cfg *config.Config) *gin.Engine {
	r := gin.New()

	// 全局中间件
	r.Use(middleware.RequestID())
	r.Use(middleware.Logger(logger))
	r.Use(middleware.Recovery(logger))
	r.Use(middleware.CORS())

	// 健康检查
	healthHandler := handler.NewHealthHandler()
	r.GET("/health", healthHandler.Check)

	// 初始化仓储和服务
	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepo, cfg)

	workRepo := repository.NewWorkRepository(db)
	chapterRepo := repository.NewChapterRepository(db)
	characterRepo := repository.NewCharacterRepository(db)
	aiTaskRepo := repository.NewAITaskRepository(db)
	workService := service.NewWorkService(workRepo, chapterRepo)
	chapterService := service.NewChapterService(workRepo, chapterRepo)
	characterService := service.NewCharacterService(workRepo, characterRepo)
	exportService := service.NewExportService(workRepo, chapterRepo, characterRepo)
	saveService := service.NewSaveService(workRepo, chapterRepo)
	aiService := service.NewAIService(aiTaskRepo, workRepo, cfg)

	// 初始化处理器
	authHandler := handler.NewAuthHandler(userService)
	userHandler := handler.NewUserHandler(userService)
	workHandler := handler.NewWorkHandler(workService)
	chapterHandler := handler.NewChapterHandler(chapterService)
	characterHandler := handler.NewCharacterHandler(characterService)
	exportHandler := handler.NewExportHandler(exportService)
	saveHandler := handler.NewSaveHandler(saveService)
	aiHandler := handler.NewAIHandler(aiService)

	// 初始化 WebSocket Handler
	wsHandler := websocket.NewHandler(saveService, cfg)

	// API v1 路由组
	v1 := r.Group("/api/v1")
	{
		// 认证相关路由（无需认证）
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.RefreshToken)
			auth.POST("/logout", middleware.Auth(&cfg.JWT), authHandler.Logout)
		}

		// 用户相关路由（需要认证）
		users := v1.Group("/users")
		users.Use(middleware.Auth(&cfg.JWT))
		{
			users.GET("/me", userHandler.GetProfile)
			users.PATCH("/me", userHandler.UpdateProfile)
		}

		// 作品相关路由（需要认证）
		works := v1.Group("/works")
		works.Use(middleware.Auth(&cfg.JWT))
		{
			works.POST("", workHandler.Create)
			works.GET("", workHandler.List)
			works.GET("/:id", workHandler.GetByID)
			works.PATCH("/:id", workHandler.Update)
			works.DELETE("/:id", workHandler.Delete)

			// 章节相关路由
			works.POST("/:workId/chapters", chapterHandler.Create)
			works.GET("/:workId/chapters", chapterHandler.List)
			works.GET("/:workId/chapters/:id", chapterHandler.GetByID)
			works.PATCH("/:workId/chapters/:id", chapterHandler.Update)
			works.DELETE("/:workId/chapters/:id", chapterHandler.Delete)

			// 角色相关路由
			works.POST("/:workId/characters", characterHandler.Create)
			works.GET("/:workId/characters", characterHandler.List)

			// 导出相关路由
			works.POST("/:id/export", exportHandler.Export)

			// 保存相关路由
			works.POST("/:workId/autosave", saveHandler.AutoSave)
			works.POST("/:workId/save", saveHandler.ManualSave)
		}

		// 角色相关路由（需要认证）
		characters := v1.Group("/characters")
		characters.Use(middleware.Auth(&cfg.JWT))
		{
			characters.GET("/:id", characterHandler.GetByID)
			characters.PATCH("/:id", characterHandler.Update)
			characters.DELETE("/:id", characterHandler.Delete)
		}

		// AI相关路由（需要认证）
		ai := v1.Group("/ai")
		ai.Use(middleware.Auth(&cfg.JWT))
		{
			ai.POST("/continue", aiHandler.Continue)
			ai.POST("/polish", aiHandler.Polish)
			ai.POST("/expand", aiHandler.Expand)
			ai.POST("/rewrite", aiHandler.Rewrite)
			ai.POST("/outline", aiHandler.GenerateOutline)
			ai.POST("/convert/novel-to-screenplay", aiHandler.ConvertNovelToScreenplay)
			ai.POST("/convert/screenplay-to-novel", aiHandler.ConvertScreenplayToNovel)
			ai.GET("/tasks/:id", aiHandler.GetTaskStatus)
		}
	}

	// WebSocket 路由（需要认证，通过query参数传递token）
	r.GET("/ws", wsHandler.HandleConnection)

	return r
}
