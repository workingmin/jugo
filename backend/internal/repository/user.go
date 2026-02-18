package repository

import (
	"errors"

	"github.com/jugo/backend/internal/model"
	"gorm.io/gorm"
)

var (
	ErrUserNotFound   = errors.New("user not found")
	ErrEmailExists    = errors.New("email already exists")
	ErrUsernameExists = errors.New("username already exists")
)

// UserRepository 用户仓储接口
type UserRepository interface {
	Create(user *model.User) error
	FindByID(id uint) (*model.User, error)
	FindByEmail(email string) (*model.User, error)
	FindByUsername(username string) (*model.User, error)
	Update(user *model.User) error
	UpdateRefreshToken(userID uint, refreshToken string) error
	ClearRefreshToken(userID uint) error
}

// userRepository 用户仓储实现
type userRepository struct {
	db *gorm.DB
}

// NewUserRepository 创建用户仓储
func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

// Create 创建用户
func (r *userRepository) Create(user *model.User) error {
	// 检查邮箱是否已存在
	var count int64
	if err := r.db.Model(&model.User{}).Where("email = ?", user.Email).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return ErrEmailExists
	}

	// 检查用户名是否已存在
	if err := r.db.Model(&model.User{}).Where("username = ?", user.Username).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return ErrUsernameExists
	}

	return r.db.Create(user).Error
}

// FindByID 根据ID查找用户
func (r *userRepository) FindByID(id uint) (*model.User, error) {
	var user model.User
	err := r.db.First(&user, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return &user, nil
}

// FindByEmail 根据邮箱查找用户
func (r *userRepository) FindByEmail(email string) (*model.User, error) {
	var user model.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return &user, nil
}

// FindByUsername 根据用户名查找用户
func (r *userRepository) FindByUsername(username string) (*model.User, error) {
	var user model.User
	err := r.db.Where("username = ?", username).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return &user, nil
}

// Update 更新用户
func (r *userRepository) Update(user *model.User) error {
	return r.db.Save(user).Error
}

// UpdateRefreshToken 更新刷新令牌
func (r *userRepository) UpdateRefreshToken(userID uint, refreshToken string) error {
	return r.db.Model(&model.User{}).Where("id = ?", userID).Update("refresh_token", refreshToken).Error
}

// ClearRefreshToken 清除刷新令牌
func (r *userRepository) ClearRefreshToken(userID uint) error {
	return r.db.Model(&model.User{}).Where("id = ?", userID).Update("refresh_token", "").Error
}
