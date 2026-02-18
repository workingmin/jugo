package service

import (
	"errors"
	"strings"
	"time"

	"github.com/jugo/backend/internal/dto"
	"github.com/jugo/backend/internal/repository"
)

var (
	ErrInvalidSaveType = errors.New("invalid save type")
)

// SaveService 保存服务接口
type SaveService interface {
	AutoSave(userID, workID uint, req *dto.AutoSaveRequest) (*dto.SaveResponse, error)
	ManualSave(userID, workID uint, req *dto.SaveRequest) (*dto.SaveResponse, error)
}

// saveService 保存服务实现
type saveService struct {
	workRepo    repository.WorkRepository
	chapterRepo repository.ChapterRepository
}

// NewSaveService 创建保存服务
func NewSaveService(workRepo repository.WorkRepository, chapterRepo repository.ChapterRepository) SaveService {
	return &saveService{
		workRepo:    workRepo,
		chapterRepo: chapterRepo,
	}
}

// AutoSave 自动保存
func (s *saveService) AutoSave(userID, workID uint, req *dto.AutoSaveRequest) (*dto.SaveResponse, error) {
	// 验证作品权限
	work, err := s.workRepo.FindByID(workID)
	if err != nil {
		return nil, err
	}
	if work.UserID != userID {
		return nil, ErrUnauthorized
	}

	// 根据类型保存
	if req.Type == "chapter" {
		return s.saveChapter(workID, req.ID, req.Content)
	}

	return nil, ErrInvalidSaveType
}

// ManualSave 手动保存
func (s *saveService) ManualSave(userID, workID uint, req *dto.SaveRequest) (*dto.SaveResponse, error) {
	// 验证作品权限
	work, err := s.workRepo.FindByID(workID)
	if err != nil {
		return nil, err
	}
	if work.UserID != userID {
		return nil, ErrUnauthorized
	}

	// 根据类型保存
	if req.Type == "chapter" {
		return s.saveChapter(workID, req.ID, req.Content)
	}

	return nil, ErrInvalidSaveType
}

// saveChapter 保存章节
func (s *saveService) saveChapter(workID, chapterID uint, content string) (*dto.SaveResponse, error) {
	// 获取章节
	chapter, err := s.chapterRepo.FindByID(chapterID)
	if err != nil {
		return nil, err
	}

	// 验证章节属于该作品
	if chapter.WorkID != workID {
		return nil, ErrChapterNotFound
	}

	// 更新内容和字数
	chapter.Content = content
	chapter.Words = s.countWords(content)

	if err := s.chapterRepo.Update(chapter); err != nil {
		return nil, err
	}

	// 更新作品统计
	if err := s.updateWorkStatistics(workID); err != nil {
		return nil, err
	}

	return &dto.SaveResponse{
		SavedAt: time.Now(),
		Words:   chapter.Words,
	}, nil
}

// updateWorkStatistics 更新作品统计信息
func (s *saveService) updateWorkStatistics(workID uint) error {
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
func (s *saveService) countWords(content string) int {
	// 简单去除HTML标签
	text := content
	text = strings.ReplaceAll(text, "<p>", "")
	text = strings.ReplaceAll(text, "</p>", "")
	text = strings.ReplaceAll(text, "<br>", "")
	text = strings.ReplaceAll(text, "<br/>", "")
	text = strings.ReplaceAll(text, "&nbsp;", " ")

	// 去除空格后计算长度
	text = strings.TrimSpace(text)
	return len([]rune(text))
}
