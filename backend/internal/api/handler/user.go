package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/jugo/backend/internal/dto"
	"github.com/jugo/backend/internal/service"
	"github.com/jugo/backend/pkg/response"
)

// UserHandler 用户处理器
type UserHandler struct {
	userService service.UserService
}

// NewUserHandler 创建用户处理器
func NewUserHandler(userService service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

// GetProfile 获取用户信息
func (h *UserHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return
	}

	userResp, err := h.userService.GetProfile(userID.(uint))
	if err != nil {
		response.InternalServerError(c, "Failed to get user profile")
		return
	}

	response.Success(c, userResp)
}

// UpdateProfile 更新用户信息
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "Unauthorized")
		return
	}

	var req dto.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request parameters")
		return
	}

	userResp, err := h.userService.UpdateProfile(userID.(uint), &req)
	if err != nil {
		response.InternalServerError(c, "Failed to update user profile")
		return
	}

	response.SuccessWithMessage(c, "Profile updated successfully", userResp)
}
