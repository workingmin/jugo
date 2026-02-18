package service

import (
	"encoding/json"
	"errors"
	"math"

	"github.com/jugo/backend/internal/dto"
	"github.com/jugo/backend/internal/model"
	"github.com/jugo/backend/internal/repository"
)

var (
	ErrWorkNotFound      = errors.New("work not found")
	ErrUnauthorized      = errors.New("unauthorized to access this work")
	ErrInvalidWorkType   = errors.New("invalid work type")
	ErrInvalidWorkStatus = errors.New("invalid work status")
)

// WorkService 作品服务接口
type WorkService interface {
	Create(userID uint, req *dto.CreateWorkRequest) (*dto.WorkResponse, error)
	GetByID(userID, workID uint) (*dto.WorkResponse, error)
	List(userID uint, params *dto.WorkQueryParams) (*dto.WorkListResponse, error)
	Update(userID, workID uint, req *dto.UpdateWorkRequest) (*dto.WorkResponse, error)
	Delete(userID, workID uint) error
}

// workService 作品服务实现
type workService struct {
	workRepo    repository.WorkRepository
	chapterRepo repository.ChapterRepository
}

// NewWorkService 创建作品服务
func NewWorkService(workRepo repository.WorkRepository, chapterRepo repository.ChapterRepository) WorkService {
	return &workService{
		workRepo:    workRepo,
		chapterRepo: chapterRepo,
	}
}

// Create 创建作品
func (s *workService) Create(userID uint, req *dto.CreateWorkRequest) (*dto.WorkResponse, error) {
	// 验证作品类型
	workType := model.WorkType(req.Type)
	if workType != model.WorkTypeNovel && workType != model.WorkTypeScreenplay {
		return nil, ErrInvalidWorkType
	}

	// 创建作品
	work := &model.Work{
		UserID:         userID,
		Type:           workType,
		Title:          req.Title,
		Topic:          req.Topic,
		Genre:          req.Genre,
		Status:         model.WorkStatusDraft,
		NumChapters:    req.NumChapters,
		WordPerChapter: req.WordPerChapter,
	}

	if err := s.workRepo.Create(work); err != nil {
		return nil, err
	}

	return s.toWorkResponse(work), nil
}

// GetByID 获取作品详情
func (s *workService) GetByID(userID, workID uint) (*dto.WorkResponse, error) {
	work, err := s.workRepo.FindByID(workID)
	if err != nil {
		return nil, err
	}

	// 验证权限
	if work.UserID != userID {
		return nil, ErrUnauthorized
	}

	return s.toWorkResponse(work), nil
}

// List 获取作品列表
func (s *workService) List(userID uint, params *dto.WorkQueryParams) (*dto.WorkListResponse, error) {
	works, total, err := s.workRepo.FindByUserID(userID, params)
	if err != nil {
		return nil, err
	}

	// 转换为响应格式
	items := make([]dto.WorkListItem, len(works))
	for i, work := range works {
		items[i] = dto.WorkListItem{
			WorkID:      work.ID,
			Type:        string(work.Type),
			Title:       work.Title,
			Genre:       work.Genre,
			Status:      string(work.Status),
			Words:       work.Words,
			NumChapters: work.NumChapters,
			CoverImage:  work.CoverImage,
			CreatedAt:   work.CreatedAt,
			UpdatedAt:   work.UpdatedAt,
		}
	}

	// 计算分页信息
	totalPages := int(math.Ceil(float64(total) / float64(params.Limit)))

	return &dto.WorkListResponse{
		Works: items,
		Pagination: dto.Pagination{
			Page:       params.Page,
			Limit:      params.Limit,
			Total:      total,
			TotalPages: totalPages,
		},
	}, nil
}

// Update 更新作品
func (s *workService) Update(userID, workID uint, req *dto.UpdateWorkRequest) (*dto.WorkResponse, error) {
	work, err := s.workRepo.FindByID(workID)
	if err != nil {
		return nil, err
	}

	// 验证权限
	if work.UserID != userID {
		return nil, ErrUnauthorized
	}

	// 更新字段
	if req.Title != "" {
		work.Title = req.Title
	}
	if req.Topic != "" {
		work.Topic = req.Topic
	}
	if req.Genre != "" {
		work.Genre = req.Genre
	}
	if req.Status != "" {
		status := model.WorkStatus(req.Status)
		if status != model.WorkStatusDraft && status != model.WorkStatusCompleted && status != model.WorkStatusPublished {
			return nil, ErrInvalidWorkStatus
		}
		work.Status = status
	}
	if req.NumChapters > 0 {
		work.NumChapters = req.NumChapters
	}
	if req.WordPerChapter > 0 {
		work.WordPerChapter = req.WordPerChapter
	}
	if req.CoverImage != "" {
		work.CoverImage = req.CoverImage
	}
	if req.Metadata != "" {
		var metadata model.WorkMetadata
		if err := json.Unmarshal([]byte(req.Metadata), &metadata); err == nil {
			work.Metadata = metadata
		}
	}

	if err := s.workRepo.Update(work); err != nil {
		return nil, err
	}

	return s.toWorkResponse(work), nil
}

// Delete 删除作品
func (s *workService) Delete(userID, workID uint) error {
	work, err := s.workRepo.FindByID(workID)
	if err != nil {
		return err
	}

	// 验证权限
	if work.UserID != userID {
		return ErrUnauthorized
	}

	// 删除作品（数据库外键会级联删除章节）
	return s.workRepo.Delete(workID)
}

// toWorkResponse 转换为作品响应
func (s *workService) toWorkResponse(work *model.Work) *dto.WorkResponse {
	return &dto.WorkResponse{
		WorkID:         work.ID,
		Type:           string(work.Type),
		Title:          work.Title,
		Topic:          work.Topic,
		Genre:          work.Genre,
		Status:         string(work.Status),
		Words:          work.Words,
		NumChapters:    work.NumChapters,
		WordPerChapter: work.WordPerChapter,
		CoverImage:     work.CoverImage,
		Metadata:       &work.Metadata,
		CreatedAt:      work.CreatedAt,
		UpdatedAt:      work.UpdatedAt,
	}
}
