package export

import (
	"errors"
)

// DOCXGenerator DOCX格式生成器
type DOCXGenerator struct{}

// NewDOCXGenerator 创建DOCX生成器
func NewDOCXGenerator() Generator {
	return &DOCXGenerator{}
}

// Generate 生成DOCX文件内容
func (g *DOCXGenerator) Generate(data *ExportData) ([]byte, error) {
	// TODO: 实现DOCX生成逻辑
	// 需要集成 github.com/nguyenthenguyen/docx 或类似库
	return nil, errors.New("DOCX export not implemented yet")
}

// GetFileExtension 获取文件扩展名
func (g *DOCXGenerator) GetFileExtension() string {
	return ".docx"
}

// GetMimeType 获取MIME类型
func (g *DOCXGenerator) GetMimeType() string {
	return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}
