package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jugo/backend/config"
	"github.com/jugo/backend/internal/api/router"
	"github.com/jugo/backend/internal/pkg"
	"github.com/jugo/backend/pkg/logger"
)

func main() {
	// 加载配置
	cfg, err := config.Load("config/config.yaml")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 初始化日志
	if err := logger.InitLogger(&cfg.Log); err != nil {
		log.Fatalf("Failed to init logger: %v", err)
	}
	defer logger.Sync()

	zapLogger := logger.GetLogger()
	zapLogger.Info("Starting JUGO Backend Server...")

	// 初始化数据库
	if err := pkg.InitDB(&cfg.Database); err != nil {
		zapLogger.Fatal(fmt.Sprintf("Failed to init database: %v", err))
	}
	defer pkg.CloseDB()
	zapLogger.Info("Database connected successfully")

	// 初始化Redis
	if err := pkg.InitRedis(&cfg.Redis); err != nil {
		zapLogger.Fatal(fmt.Sprintf("Failed to init redis: %v", err))
	}
	defer pkg.CloseRedis()
	zapLogger.Info("Redis connected successfully")

	// 设置路由
	r := router.Setup(zapLogger)

	// 创建HTTP服务器
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.Server.Port),
		Handler:      r,
		ReadTimeout:  time.Duration(cfg.Server.ReadTimeout) * time.Second,
		WriteTimeout: time.Duration(cfg.Server.WriteTimeout) * time.Second,
	}

	// 启动服务器
	go func() {
		zapLogger.Info(fmt.Sprintf("Server listening on port %d", cfg.Server.Port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			zapLogger.Fatal(fmt.Sprintf("Failed to start server: %v", err))
		}
	}()

	// 优雅关闭
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	zapLogger.Info("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		zapLogger.Fatal(fmt.Sprintf("Server forced to shutdown: %v", err))
	}

	zapLogger.Info("Server exited")
}
