package export

import (
	"errors"
)

// EPUBGenerator EPUB格式生成器
type EPUBGenerator struct{}

// NewEPUBGenerator 创建EPUB生成器
func NewEPUBGenerator() Generator {
	return &EPUBGenerator{}
}

// Generate 生成EPUB文件内容
func (g *EPUBGenerator) Generate(data *ExportData) ([]byte, error) {
	// TODO: 实现EPUB生成逻辑
	// 需要集成 github.com/bmaupin/go-epub 或类似库
	return nil, errors.New("EPUB export not implemented yet")
}

// GetFileExtension 获取文件扩展名
func (g *EPUBGenerator) GetFileExtension() string {
	return ".epub"
}

// GetMimeType 获取MIME类型
func (g *EPUBGenerator) GetMimeType() string {
	return "application/epub+zip"
}
