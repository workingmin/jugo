package repository

import (
	"errors"

	"github.com/jugo/backend/internal/model"
	"gorm.io/gorm"
)

var (
	ErrCharacterNotFound = errors.New("character not found")
)

// CharacterRepository 角色仓储接口
type CharacterRepository interface {
	Create(character *model.Character) error
	FindByID(id uint) (*model.Character, error)
	FindByWorkID(workID uint) ([]model.Character, error)
	Update(character *model.Character) error
	Delete(id uint) error
	CountByWorkID(workID uint) (int, error)
}

// characterRepository 角色仓储实现
type characterRepository struct {
	db *gorm.DB
}

// NewCharacterRepository 创建角色仓储
func NewCharacterRepository(db *gorm.DB) CharacterRepository {
	return &characterRepository{db: db}
}

// Create 创建角色
func (r *characterRepository) Create(character *model.Character) error {
	return r.db.Create(character).Error
}

// FindByID 根据ID查找角色
func (r *characterRepository) FindByID(id uint) (*model.Character, error) {
	var character model.Character
	err := r.db.First(&character, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrCharacterNotFound
		}
		return nil, err
	}
	return &character, nil
}

// FindByWorkID 根据作品ID查找所有角色
func (r *characterRepository) FindByWorkID(workID uint) ([]model.Character, error) {
	var characters []model.Character
	err := r.db.Where("work_id = ?", workID).Order("created_at ASC").Find(&characters).Error
	if err != nil {
		return nil, err
	}
	return characters, nil
}

// Update 更新角色
func (r *characterRepository) Update(character *model.Character) error {
	return r.db.Save(character).Error
}

// Delete 删除角色
func (r *characterRepository) Delete(id uint) error {
	return r.db.Delete(&model.Character{}, id).Error
}

// CountByWorkID 统计作品的角色数
func (r *characterRepository) CountByWorkID(workID uint) (int, error) {
	var count int64
	err := r.db.Model(&model.Character{}).Where("work_id = ?", workID).Count(&count).Error
	return int(count), err
}
