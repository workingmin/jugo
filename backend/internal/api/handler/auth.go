package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jugo/backend/internal/dto"
	"github.com/jugo/backend/internal/repository"
	"github.com/jugo/backend/internal/service"
	"github.com/jugo/backend/pkg/password"
	"github.com/jugo/backend/pkg/response"
)

// AuthHandler 认证处理器
type AuthHandler struct {
	userService service.UserService
}

// NewAuthHandler 创建认证处理器
func NewAuthHandler(userService service.UserService) *AuthHandler {
	return &AuthHandler{
		userService: userService,
	}
}

// Register 用户注册
func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	authResp, err := h.userService.Register(&req)
	if err != nil {
		if errors.Is(err, repository.ErrEmailExists) {
			response.Error(c, http.StatusConflict, "Email already exists")
			return
		}
		if errors.Is(err, repository.ErrUsernameExists) {
			response.Error(c, http.StatusConflict, "Username already exists")
			return
		}
		if errors.Is(err, password.ErrPasswordTooShort) {
			response.BadRequest(c, "Password must be at least 6 characters")
			return
		}
		response.InternalServerError(c, "Failed to register user")
		return
	}

	response.SuccessWithMessage(c, "Registration successful", authResp)
}

// Login 用户登录
func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	authResp, err := h.userService.Login(&req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) {
			response.Unauthorized(c, "Invalid email or password")
			return
		}
		response.InternalServerError(c, "Failed to login")
		return
	}

	response.SuccessWithMessage(c, "Login successful", authResp)
}

// RefreshToken 刷新令牌
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req dto.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	tokenResp, err := h.userService.RefreshToken(&req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidRefreshToken) {
			response.Unauthorized(c, "Invalid refresh token")
			return
		}
		response.InternalServerError(c, "Failed to refresh token")
		return
	}

	response.Success(c, tokenResp)
}

// Logout 用户登出
func (h *AuthHandler) Logout(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return
	}

	if err := h.userService.Logout(userID.(uint)); err != nil {
		response.InternalServerError(c, "Failed to logout")
		return
	}

	response.SuccessWithMessage(c, "Logout successful", nil)
}
