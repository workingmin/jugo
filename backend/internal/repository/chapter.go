package repository

import (
	"errors"

	"github.com/jugo/backend/internal/model"
	"gorm.io/gorm"
)

var (
	ErrChapterNotFound = errors.New("chapter not found")
)

// ChapterRepository 章节仓储接口
type ChapterRepository interface {
	Create(chapter *model.Chapter) error
	FindByID(id uint) (*model.Chapter, error)
	FindByWorkID(workID uint) ([]model.Chapter, error)
	Update(chapter *model.Chapter) error
	Delete(id uint) error
	CountByWorkID(workID uint) (int, error)
	GetTotalWordsByWorkID(workID uint) (int, error)
}

// chapterRepository 章节仓储实现
type chapterRepository struct {
	db *gorm.DB
}

// NewChapterRepository 创建章节仓储
func NewChapterRepository(db *gorm.DB) ChapterRepository {
	return &chapterRepository{db: db}
}

// Create 创建章节
func (r *chapterRepository) Create(chapter *model.Chapter) error {
	return r.db.Create(chapter).Error
}

// FindByID 根据ID查找章节
func (r *chapterRepository) FindByID(id uint) (*model.Chapter, error) {
	var chapter model.Chapter
	err := r.db.First(&chapter, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrChapterNotFound
		}
		return nil, err
	}
	return &chapter, nil
}

// FindByWorkID 根据作品ID查找所有章节
func (r *chapterRepository) FindByWorkID(workID uint) ([]model.Chapter, error) {
	var chapters []model.Chapter
	err := r.db.Where("work_id = ?", workID).Order("order_num ASC").Find(&chapters).Error
	if err != nil {
		return nil, err
	}
	return chapters, nil
}

// Update 更新章节
func (r *chapterRepository) Update(chapter *model.Chapter) error {
	return r.db.Save(chapter).Error
}

// Delete 删除章节
func (r *chapterRepository) Delete(id uint) error {
	return r.db.Delete(&model.Chapter{}, id).Error
}

// CountByWorkID 统计作品的章节数
func (r *chapterRepository) CountByWorkID(workID uint) (int, error) {
	var count int64
	err := r.db.Model(&model.Chapter{}).Where("work_id = ?", workID).Count(&count).Error
	return int(count), err
}

// GetTotalWordsByWorkID 获取作品的总字数
func (r *chapterRepository) GetTotalWordsByWorkID(workID uint) (int, error) {
	var totalWords int
	err := r.db.Model(&model.Chapter{}).
		Where("work_id = ?", workID).
		Select("COALESCE(SUM(words), 0)").
		Scan(&totalWords).Error
	return totalWords, err
}
