package export

import (
	"github.com/jugo/backend/internal/model"
)

// ExportData 导出数据结构
type ExportData struct {
	Work       *model.Work
	Chapters   []model.Chapter
	Characters []model.Character
	Metadata   map[string]interface{}
}

// Generator 文件生成器接口
type Generator interface {
	// Generate 生成文件内容
	Generate(data *ExportData) ([]byte, error)

	// GetFileExtension 获取文件扩展名
	GetFileExtension() string

	// GetMimeType 获取MIME类型
	GetMimeType() string
}
