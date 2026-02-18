package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jugo/backend/config"
	jwtutil "github.com/jugo/backend/pkg/jwt"
	"github.com/jugo/backend/pkg/response"
)

// Auth JWT认证中间件
func Auth(cfg *config.JWTConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 从请求头获取token
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Unauthorized(c, "Missing authorization header")
			c.Abort()
			return
		}

		// 验证Bearer格式
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.Unauthorized(c, "Invalid authorization header format")
			c.Abort()
			return
		}

		token := parts[1]

		// 解析token
		claims, err := jwtutil.ParseToken(token, cfg)
		if err != nil {
			if err == jwtutil.ErrExpiredToken {
				response.Unauthorized(c, "Token has expired")
			} else {
				response.Unauthorized(c, "Invalid token")
			}
			c.Abort()
			return
		}

		// 将用户信息存入context
		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)
		c.Set("email", claims.Email)

		c.Next()
	}
}

// GetUserID 从context获取用户ID
func GetUserID(c *gin.Context) uint {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0
	}
	return userID.(uint)
}

// GetUsername 从context获取用户名
func GetUsername(c *gin.Context) string {
	username, exists := c.Get("username")
	if !exists {
		return ""
	}
	return username.(string)
}

// GetEmail 从context获取邮箱
func GetEmail(c *gin.Context) string {
	email, exists := c.Get("email")
	if !exists {
		return ""
	}
	return email.(string)
}
