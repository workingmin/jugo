package repository

import (
	"github.com/jugo/backend/internal/model"
	"gorm.io/gorm"
)

// AITaskRepository AI任务仓储接口
type AITaskRepository interface {
	Create(task *model.AITask) error
	FindByID(id uint) (*model.AITask, error)
	FindByUserID(userID uint, limit, offset int) ([]*model.AITask, error)
	Update(task *model.AITask) error
	UpdateStatus(id uint, status model.AITaskStatus, progress int) error
	UpdateResult(id uint, result string) error
	UpdateError(id uint, errorMsg string) error
	CountByUserID(userID uint) (int64, error)
}

// aiTaskRepository AI任务仓储实现
type aiTaskRepository struct {
	db *gorm.DB
}

// NewAITaskRepository 创建AI任务仓储
func NewAITaskRepository(db *gorm.DB) AITaskRepository {
	return &aiTaskRepository{db: db}
}

// Create 创建AI任务
func (r *aiTaskRepository) Create(task *model.AITask) error {
	return r.db.Create(task).Error
}

// FindByID 根据ID查找AI任务
func (r *aiTaskRepository) FindByID(id uint) (*model.AITask, error) {
	var task model.AITask
	err := r.db.First(&task, id).Error
	if err != nil {
		return nil, err
	}
	return &task, nil
}

// FindByUserID 根据用户ID查找AI任务列表
func (r *aiTaskRepository) FindByUserID(userID uint, limit, offset int) ([]*model.AITask, error) {
	var tasks []*model.AITask
	err := r.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&tasks).Error
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

// Update 更新AI任务
func (r *aiTaskRepository) Update(task *model.AITask) error {
	return r.db.Save(task).Error
}

// UpdateStatus 更新任务状态和进度
func (r *aiTaskRepository) UpdateStatus(id uint, status model.AITaskStatus, progress int) error {
	return r.db.Model(&model.AITask{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":   status,
			"progress": progress,
		}).Error
}

// UpdateResult 更新任务结果
func (r *aiTaskRepository) UpdateResult(id uint, result string) error {
	return r.db.Model(&model.AITask{}).
		Where("id = ?", id).
		Update("result", result).Error
}

// UpdateError 更新任务错误信息
func (r *aiTaskRepository) UpdateError(id uint, errorMsg string) error {
	return r.db.Model(&model.AITask{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status": model.AITaskStatusFailed,
			"error":  errorMsg,
		}).Error
}

// CountByUserID 统计用户的AI任务数量
func (r *aiTaskRepository) CountByUserID(userID uint) (int64, error) {
	var count int64
	err := r.db.Model(&model.AITask{}).
		Where("user_id = ?", userID).
		Count(&count).Error
	return count, err
}
