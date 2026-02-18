package service

import (
	"errors"
	"strings"

	"github.com/jugo/backend/internal/dto"
	"github.com/jugo/backend/internal/model"
	"github.com/jugo/backend/internal/repository"
)

var (
	ErrChapterNotFound = errors.New("chapter not found")
)

// ChapterService 章节服务接口
type ChapterService interface {
	Create(userID, workID uint, req *dto.CreateChapterRequest) (*dto.ChapterResponse, error)
	GetByID(userID, workID, chapterID uint) (*dto.ChapterResponse, error)
	List(userID, workID uint) (*dto.ChapterListResponse, error)
	Update(userID, workID, chapterID uint, req *dto.UpdateChapterRequest) (*dto.ChapterResponse, error)
	Delete(userID, workID, chapterID uint) error
}

// chapterService 章节服务实现
type chapterService struct {
	workRepo    repository.WorkRepository
	chapterRepo repository.ChapterRepository
}

// NewChapterService 创建章节服务
func NewChapterService(workRepo repository.WorkRepository, chapterRepo repository.ChapterRepository) ChapterService {
	return &chapterService{
		workRepo:    workRepo,
		chapterRepo: chapterRepo,
	}
}

// Create 创建章节
func (s *chapterService) Create(userID, workID uint, req *dto.CreateChapterRequest) (*dto.ChapterResponse, error) {
	// 验证作品权限
	work, err := s.workRepo.FindByID(workID)
	if err != nil {
		return nil, err
	}
	if work.UserID != userID {
		return nil, ErrUnauthorized
	}

	// 计算字数
	words := s.countWords(req.Content)

	// 创建章节
	chapter := &model.Chapter{
		WorkID:   workID,
		Title:    req.Title,
		Content:  req.Content,
		Words:    words,
		OrderNum: req.OrderNum,
		Status:   model.ChapterStatusDraft,
	}

	if err := s.chapterRepo.Create(chapter); err != nil {
		return nil, err
	}

	// 更新作品统计
	if err := s.updateWorkStatistics(workID); err != nil {
		return nil, err
	}

	return s.toChapterResponse(chapter), nil
}

// GetByID 获取章节详情
func (s *chapterService) GetByID(userID, workID, chapterID uint) (*dto.ChapterResponse, error) {
	// 验证作品权限
	work, err := s.workRepo.FindByID(workID)
	if err != nil {
		return nil, err
	}
	if work.UserID != userID {
		return nil, ErrUnauthorized
	}

	// 获取章节
	chapter, err := s.chapterRepo.FindByID(chapterID)
	if err != nil {
		return nil, err
	}

	// 验证章节属于该作品
	if chapter.WorkID != workID {
		return nil, ErrChapterNotFound
	}

	return s.toChapterResponse(chapter), nil
}

// List 获取章节列表
func (s *chapterService) List(userID, workID uint) (*dto.ChapterListResponse, error) {
	// 验证作品权限
	work, err := s.workRepo.FindByID(workID)
	if err != nil {
		return nil, err
	}
	if work.UserID != userID {
		return nil, ErrUnauthorized
	}

	// 获取章节列表
	chapters, err := s.chapterRepo.FindByWorkID(workID)
	if err != nil {
		return nil, err
	}

	// 转换为响应格式
	items := make([]dto.ChapterListItem, len(chapters))
	for i, chapter := range chapters {
		items[i] = dto.ChapterListItem{
			ChapterID: chapter.ID,
			WorkID:    chapter.WorkID,
			Title:     chapter.Title,
			Words:     chapter.Words,
			Order:     chapter.OrderNum,
			Status:    string(chapter.Status),
			CreatedAt: chapter.CreatedAt,
			UpdatedAt: chapter.UpdatedAt,
		}
	}

	return &dto.ChapterListResponse{
		Chapters: items,
	}, nil
}

// Update 更新章节
func (s *chapterService) Update(userID, workID, chapterID uint, req *dto.UpdateChapterRequest) (*dto.ChapterResponse, error) {
	// 验证作品权限
	work, err := s.workRepo.FindByID(workID)
	if err != nil {
		return nil, err
	}
	if work.UserID != userID {
		return nil, ErrUnauthorized
	}

	// 获取章节
	chapter, err := s.chapterRepo.FindByID(chapterID)
	if err != nil {
		return nil, err
	}

	// 验证章节属于该作品
	if chapter.WorkID != workID {
		return nil, ErrChapterNotFound
	}

	// 更新字段
	needUpdateStats := false
	if req.Title != "" {
		chapter.Title = req.Title
	}
	if req.Content != "" {
		chapter.Content = req.Content
		chapter.Words = s.countWords(req.Content)
		needUpdateStats = true
	}
	if req.OrderNum > 0 {
		chapter.OrderNum = req.OrderNum
	}
	if req.Status != "" {
		status := model.ChapterStatus(req.Status)
		if status == model.ChapterStatusDraft || status == model.ChapterStatusCompleted {
			chapter.Status = status
		}
	}

	if err := s.chapterRepo.Update(chapter); err != nil {
		return nil, err
	}

	// 如果内容变化，更新作品统计
	if needUpdateStats {
		if err := s.updateWorkStatistics(workID); err != nil {
			return nil, err
		}
	}

	return s.toChapterResponse(chapter), nil
}

// Delete 删除章节
func (s *chapterService) Delete(userID, workID, chapterID uint) error {
	// 验证作品权限
	work, err := s.workRepo.FindByID(workID)
	if err != nil {
		return err
	}
	if work.UserID != userID {
		return ErrUnauthorized
	}

	// 获取章节
	chapter, err := s.chapterRepo.FindByID(chapterID)
	if err != nil {
		return err
	}

	// 验证章节属于该作品
	if chapter.WorkID != workID {
		return ErrChapterNotFound
	}

	// 删除章节
	if err := s.chapterRepo.Delete(chapterID); err != nil {
		return err
	}

	// 更新作品统计
	return s.updateWorkStatistics(workID)
}

// updateWorkStatistics 更新作品统计信息
func (s *chapterService) updateWorkStatistics(workID uint) error {
	// 统计章节数
	numChapters, err := s.chapterRepo.CountByWorkID(workID)
	if err != nil {
		return err
	}

	// 统计总字数
	totalWords, err := s.chapterRepo.GetTotalWordsByWorkID(workID)
	if err != nil {
		return err
	}

	// 更新作品
	return s.workRepo.UpdateStatistics(workID, totalWords, numChapters)
}

// countWords 计算字数（简单实现：去除HTML标签后计算字符数）
func (s *chapterService) countWords(content string) int {
	// 简单去除HTML标签
	text := content
	// 这里可以使用更复杂的HTML解析，暂时简单处理
	text = strings.ReplaceAll(text, "<p>", "")
	text = strings.ReplaceAll(text, "</p>", "")
	text = strings.ReplaceAll(text, "<br>", "")
	text = strings.ReplaceAll(text, "<br/>", "")
	text = strings.ReplaceAll(text, "&nbsp;", " ")

	// 去除空格后计算长度
	text = strings.TrimSpace(text)
	return len([]rune(text))
}

// toChapterResponse 转换为章节响应
func (s *chapterService) toChapterResponse(chapter *model.Chapter) *dto.ChapterResponse {
	return &dto.ChapterResponse{
		ChapterID: chapter.ID,
		WorkID:    chapter.WorkID,
		Title:     chapter.Title,
		Content:   chapter.Content,
		Words:     chapter.Words,
		Order:     chapter.OrderNum,
		Status:    string(chapter.Status),
		CreatedAt: chapter.CreatedAt,
		UpdatedAt: chapter.UpdatedAt,
	}
}
