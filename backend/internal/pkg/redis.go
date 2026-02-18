package pkg

import (
	"context"
	"fmt"

	"github.com/jugo/backend/config"
	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client

// InitRedis 初始化Redis连接
func InitRedis(cfg *config.RedisConfig) error {
	rdb = redis.NewClient(&redis.Options{
		Addr:         fmt.Sprintf("%s:%d", cfg.Host, cfg.Port),
		Password:     cfg.Password,
		DB:           cfg.DB,
		PoolSize:     cfg.PoolSize,
		MinIdleConns: cfg.MinIdleConns,
	})

	// 测试连接
	ctx := context.Background()
	if err := rdb.Ping(ctx).Err(); err != nil {
		return fmt.Errorf("failed to connect redis: %w", err)
	}

	return nil
}

// GetRedis 获取Redis客户端
func GetRedis() *redis.Client {
	return rdb
}

// CloseRedis 关闭Redis连接
func CloseRedis() error {
	if rdb != nil {
		return rdb.Close()
	}
	return nil
}
