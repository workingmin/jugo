package service

import (
	"errors"
	"time"

	"github.com/jugo/backend/config"
	"github.com/jugo/backend/internal/dto"
	"github.com/jugo/backend/internal/model"
	"github.com/jugo/backend/internal/repository"
	jwtutil "github.com/jugo/backend/pkg/jwt"
	"github.com/jugo/backend/pkg/password"
)

var (
	ErrInvalidCredentials  = errors.New("invalid email or password")
	ErrInvalidRefreshToken = errors.New("invalid refresh token")
)

// UserService 用户服务接口
type UserService interface {
	Register(req *dto.RegisterRequest) (*dto.AuthResponse, error)
	Login(req *dto.LoginRequest) (*dto.AuthResponse, error)
	RefreshToken(req *dto.RefreshTokenRequest) (*dto.TokenResponse, error)
	Logout(userID uint) error
	GetProfile(userID uint) (*dto.UserResponse, error)
	UpdateProfile(userID uint, req *dto.UpdateUserRequest) (*dto.UserResponse, error)
}

// userService 用户服务实现
type userService struct {
	userRepo repository.UserRepository
	cfg      *config.Config
}

// NewUserService 创建用户服务
func NewUserService(userRepo repository.UserRepository, cfg *config.Config) UserService {
	return &userService{
		userRepo: userRepo,
		cfg:      cfg,
	}
}

// Register 用户注册
func (s *userService) Register(req *dto.RegisterRequest) (*dto.AuthResponse, error) {
	// 验证密码强度
	if err := password.Validate(req.Password); err != nil {
		return nil, err
	}

	// 加密密码
	hashedPassword, err := password.Hash(req.Password)
	if err != nil {
		return nil, err
	}

	// 创建用户
	user := &model.User{
		Username: req.Username,
		Email:    req.Email,
		Password: hashedPassword,
		Status:   1,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	// 生成令牌
	token, err := jwtutil.GenerateToken(user.ID, user.Username, user.Email, &s.cfg.JWT)
	if err != nil {
		return nil, err
	}

	refreshToken, err := jwtutil.GenerateRefreshToken(user.ID, user.Username, user.Email, &s.cfg.JWT)
	if err != nil {
		return nil, err
	}

	// 保存刷新令牌
	if err := s.userRepo.UpdateRefreshToken(user.ID, refreshToken); err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		UserID:       user.ID,
		Username:     user.Username,
		Email:        user.Email,
		Token:        token,
		RefreshToken: refreshToken,
		ExpiresIn:    s.cfg.JWT.ExpireHours * 3600,
	}, nil
}

// Login 用户登录
func (s *userService) Login(req *dto.LoginRequest) (*dto.AuthResponse, error) {
	// 查找用户
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	// 验证密码
	if err := password.Verify(user.Password, req.Password); err != nil {
		return nil, ErrInvalidCredentials
	}

	// 检查用户状态
	if user.Status != 1 {
		return nil, errors.New("user account is disabled")
	}

	// 生成令牌
	token, err := jwtutil.GenerateToken(user.ID, user.Username, user.Email, &s.cfg.JWT)
	if err != nil {
		return nil, err
	}

	refreshToken, err := jwtutil.GenerateRefreshToken(user.ID, user.Username, user.Email, &s.cfg.JWT)
	if err != nil {
		return nil, err
	}

	// 更新刷新令牌和最后登录时间
	if err := s.userRepo.UpdateRefreshToken(user.ID, refreshToken); err != nil {
		return nil, err
	}

	now := time.Now()
	user.LastLoginAt = &now
	if err := s.userRepo.Update(user); err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		UserID:       user.ID,
		Username:     user.Username,
		Email:        user.Email,
		Token:        token,
		RefreshToken: refreshToken,
		ExpiresIn:    s.cfg.JWT.ExpireHours * 3600,
	}, nil
}

// RefreshToken 刷新令牌
func (s *userService) RefreshToken(req *dto.RefreshTokenRequest) (*dto.TokenResponse, error) {
	// 解析刷新令牌
	claims, err := jwtutil.ParseToken(req.RefreshToken, &s.cfg.JWT)
	if err != nil {
		return nil, ErrInvalidRefreshToken
	}

	// 查找用户
	user, err := s.userRepo.FindByID(claims.UserID)
	if err != nil {
		return nil, err
	}

	// 验证刷新令牌是否匹配
	if user.RefreshToken != req.RefreshToken {
		return nil, ErrInvalidRefreshToken
	}

	// 生成新令牌
	token, err := jwtutil.GenerateToken(user.ID, user.Username, user.Email, &s.cfg.JWT)
	if err != nil {
		return nil, err
	}

	refreshToken, err := jwtutil.GenerateRefreshToken(user.ID, user.Username, user.Email, &s.cfg.JWT)
	if err != nil {
		return nil, err
	}

	// 更新刷新令牌
	if err := s.userRepo.UpdateRefreshToken(user.ID, refreshToken); err != nil {
		return nil, err
	}

	return &dto.TokenResponse{
		Token:        token,
		RefreshToken: refreshToken,
		ExpiresIn:    s.cfg.JWT.ExpireHours * 3600,
	}, nil
}

// Logout 用户登出
func (s *userService) Logout(userID uint) error {
	return s.userRepo.ClearRefreshToken(userID)
}

// GetProfile 获取用户信息
func (s *userService) GetProfile(userID uint) (*dto.UserResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}

	return &dto.UserResponse{
		UserID:    user.ID,
		Username:  user.Username,
		Email:     user.Email,
		Avatar:    user.Avatar,
		CreatedAt: user.CreatedAt,
	}, nil
}

// UpdateProfile 更新用户信息
func (s *userService) UpdateProfile(userID uint, req *dto.UpdateUserRequest) (*dto.UserResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}

	// 更新字段
	if req.Username != "" {
		user.Username = req.Username
	}
	if req.Avatar != "" {
		user.Avatar = req.Avatar
	}

	if err := s.userRepo.Update(user); err != nil {
		return nil, err
	}

	return &dto.UserResponse{
		UserID:    user.ID,
		Username:  user.Username,
		Email:     user.Email,
		Avatar:    user.Avatar,
		CreatedAt: user.CreatedAt,
	}, nil
}
