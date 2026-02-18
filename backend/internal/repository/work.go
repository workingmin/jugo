package repository

import (
	"errors"

	"github.com/jugo/backend/internal/dto"
	"github.com/jugo/backend/internal/model"
	"gorm.io/gorm"
)

var (
	ErrWorkNotFound = errors.New("work not found")
)

// WorkRepository 作品仓储接口
type WorkRepository interface {
	Create(work *model.Work) error
	FindByID(id uint) (*model.Work, error)
	FindByUserID(userID uint, params *dto.WorkQueryParams) ([]model.Work, int, error)
	Update(work *model.Work) error
	Delete(id uint) error
	UpdateStatistics(workID uint, words, numChapters int) error
}

// workRepository 作品仓储实现
type workRepository struct {
	db *gorm.DB
}

// NewWorkRepository 创建作品仓储
func NewWorkRepository(db *gorm.DB) WorkRepository {
	return &workRepository{db: db}
}

// Create 创建作品
func (r *workRepository) Create(work *model.Work) error {
	return r.db.Create(work).Error
}

// FindByID 根据ID查找作品
func (r *workRepository) FindByID(id uint) (*model.Work, error) {
	var work model.Work
	err := r.db.First(&work, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrWorkNotFound
		}
		return nil, err
	}
	return &work, nil
}

// FindByUserID 根据用户ID查找作品（支持过滤和排序）
func (r *workRepository) FindByUserID(userID uint, params *dto.WorkQueryParams) ([]model.Work, int, error) {
	var works []model.Work
	var total int64

	// 设置默认值
	if params.Page == 0 {
		params.Page = 1
	}
	if params.Limit == 0 {
		params.Limit = 20
	}
	if params.Sort == "" {
		params.Sort = "updatedAt"
	}

	// 构建查询
	query := r.db.Model(&model.Work{}).Where("user_id = ?", userID)

	// 类型过滤
	if params.Type != "" && params.Type != "all" {
		query = query.Where("type = ?", params.Type)
	}

	// 状态过滤
	if params.Status != "" && params.Status != "all" {
		query = query.Where("status = ?", params.Status)
	}

	// 获取总数
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 排序
	var orderBy string
	switch params.Sort {
	case "createdAt":
		orderBy = "created_at DESC"
	case "words":
		orderBy = "words DESC"
	case "title":
		orderBy = "title ASC"
	default: // updatedAt
		orderBy = "updated_at DESC"
	}

	// 分页查询
	offset := (params.Page - 1) * params.Limit
	err := query.Order(orderBy).Limit(params.Limit).Offset(offset).Find(&works).Error
	if err != nil {
		return nil, 0, err
	}

	return works, int(total), nil
}

// Update 更新作品
func (r *workRepository) Update(work *model.Work) error {
	return r.db.Save(work).Error
}

// Delete 删除作品
func (r *workRepository) Delete(id uint) error {
	return r.db.Delete(&model.Work{}, id).Error
}

// UpdateStatistics 更新统计信息
func (r *workRepository) UpdateStatistics(workID uint, words, numChapters int) error {
	return r.db.Model(&model.Work{}).Where("id = ?", workID).
		Updates(map[string]interface{}{
			"words":        words,
			"num_chapters": numChapters,
		}).Error
}
