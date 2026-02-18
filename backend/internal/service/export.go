package service

import (
	"errors"
	"fmt"
	"time"

	"github.com/jugo/backend/internal/dto"
	"github.com/jugo/backend/internal/repository"
	"github.com/jugo/backend/pkg/export"
)

var (
	ErrUnsupportedFormat = errors.New("unsupported export format")
)

// ExportService 导出服务接口
type ExportService interface {
	Export(userID, workID uint, req *dto.ExportRequest) (*dto.ExportResponse, error)
}

// exportService 导出服务实现
type exportService struct {
	workRepo      repository.WorkRepository
	chapterRepo   repository.ChapterRepository
	characterRepo repository.CharacterRepository
}

// NewExportService 创建导出服务
func NewExportService(
	workRepo repository.WorkRepository,
	chapterRepo repository.ChapterRepository,
	characterRepo repository.CharacterRepository,
) ExportService {
	return &exportService{
		workRepo:      workRepo,
		chapterRepo:   chapterRepo,
		characterRepo: characterRepo,
	}
}

// Export 导出作品
func (s *exportService) Export(userID, workID uint, req *dto.ExportRequest) (*dto.ExportResponse, error) {
	// 验证作品权限
	work, err := s.workRepo.FindByID(workID)
	if err != nil {
		return nil, err
	}
	if work.UserID != userID {
		return nil, ErrUnauthorized
	}

	// 准备导出数据
	exportData := &export.ExportData{
		Work:     work,
		Metadata: make(map[string]interface{}),
	}

	// 加载章节
	if req.IncludeChapters {
		chapters, err := s.chapterRepo.FindByWorkID(workID)
		if err != nil {
			return nil, err
		}
		exportData.Chapters = chapters
	}

	// 加载角色
	if req.IncludeCharacters {
		characters, err := s.characterRepo.FindByWorkID(workID)
		if err != nil {
			return nil, err
		}
		exportData.Characters = characters
	}

	// 添加元数据
	if req.IncludeMetadata {
		exportData.Metadata["exportTime"] = time.Now()
		exportData.Metadata["format"] = req.Format
	}

	// 选择生成器
	generator, err := s.getGenerator(req.Format)
	if err != nil {
		return nil, err
	}

	// 生成文件
	fileContent, err := generator.Generate(exportData)
	if err != nil {
		return nil, err
	}

	// 生成文件名
	fileName := s.generateFileName(work.Title, generator.GetFileExtension())

	// TODO: 上传到对象存储并获取下载链接
	// 目前返回临时响应，实际应该上传到MinIO/S3
	response := &dto.ExportResponse{
		FileName:    fileName,
		FileSize:    int64(len(fileContent)),
		Format:      string(req.Format),
		Status:      "completed",
		DownloadURL: fmt.Sprintf("/api/v1/exports/download/%s", fileName), // 临时URL
	}

	return response, nil
}

// getGenerator 根据格式获取生成器
func (s *exportService) getGenerator(format dto.ExportFormat) (export.Generator, error) {
	switch format {
	case dto.ExportFormatTXT:
		return export.NewTXTGenerator(), nil
	case dto.ExportFormatDOCX:
		return export.NewDOCXGenerator(), nil
	case dto.ExportFormatPDF:
		return export.NewPDFGenerator(), nil
	case dto.ExportFormatEPUB:
		return export.NewEPUBGenerator(), nil
	default:
		return nil, ErrUnsupportedFormat
	}
}

// generateFileName 生成文件名
func (s *exportService) generateFileName(title string, extension string) string {
	// 清理文件名中的特殊字符
	safeTitle := title
	if len(safeTitle) > 50 {
		safeTitle = safeTitle[:50]
	}

	timestamp := time.Now().Format("20060102150405")
	return fmt.Sprintf("%s_%s%s", safeTitle, timestamp, extension)
}
