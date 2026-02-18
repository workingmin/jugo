package export

import (
	"errors"
)

// PDFGenerator PDF格式生成器
type PDFGenerator struct{}

// NewPDFGenerator 创建PDF生成器
func NewPDFGenerator() Generator {
	return &PDFGenerator{}
}

// Generate 生成PDF文件内容
func (g *PDFGenerator) Generate(data *ExportData) ([]byte, error) {
	// TODO: 实现PDF生成逻辑
	// 需要集成 github.com/jung-kurt/gofpdf 或 github.com/signintech/gopdf
	return nil, errors.New("PDF export not implemented yet")
}

// GetFileExtension 获取文件扩展名
func (g *PDFGenerator) GetFileExtension() string {
	return ".pdf"
}

// GetMimeType 获取MIME类型
func (g *PDFGenerator) GetMimeType() string {
	return "application/pdf"
}
