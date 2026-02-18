package export

import (
	"bytes"
	"fmt"
	"strings"
	"time"
)

// TXTGenerator TXT格式生成器
type TXTGenerator struct{}

// NewTXTGenerator 创建TXT生成器
func NewTXTGenerator() Generator {
	return &TXTGenerator{}
}

// Generate 生成TXT文件内容
func (g *TXTGenerator) Generate(data *ExportData) ([]byte, error) {
	var buf bytes.Buffer

	// 写入标题
	buf.WriteString(strings.Repeat("=", 60))
	buf.WriteString("\n")
	buf.WriteString(fmt.Sprintf("%s\n", data.Work.Title))
	buf.WriteString(strings.Repeat("=", 60))
	buf.WriteString("\n\n")

	// 写入元数据
	if data.Metadata != nil {
		buf.WriteString("【作品信息】\n")
		buf.WriteString(fmt.Sprintf("类型: %s\n", data.Work.Type))
		if data.Work.Genre != "" {
			buf.WriteString(fmt.Sprintf("题材: %s\n", data.Work.Genre))
		}
		if data.Work.Topic != "" {
			buf.WriteString(fmt.Sprintf("主题: %s\n", data.Work.Topic))
		}
		buf.WriteString(fmt.Sprintf("字数: %d\n", data.Work.Words))
		buf.WriteString(fmt.Sprintf("章节数: %d\n", data.Work.NumChapters))
		buf.WriteString(fmt.Sprintf("创建时间: %s\n", data.Work.CreatedAt.Format("2006-01-02 15:04:05")))
		buf.WriteString("\n")
	}

	// 写入角色信息
	if len(data.Characters) > 0 {
		buf.WriteString("【角色列表】\n")
		for _, char := range data.Characters {
			buf.WriteString(fmt.Sprintf("\n%s", char.Name))
			if char.Role != "" {
				buf.WriteString(fmt.Sprintf(" (%s)", char.Role))
			}
			buf.WriteString("\n")
			if char.Description != "" {
				buf.WriteString(fmt.Sprintf("%s\n", char.Description))
			}
		}
		buf.WriteString("\n")
	}

	buf.WriteString(strings.Repeat("=", 60))
	buf.WriteString("\n\n")

	// 写入章节内容
	for i, chapter := range data.Chapters {
		// 章节标题
		buf.WriteString(fmt.Sprintf("第%d章 %s\n", i+1, chapter.Title))
		buf.WriteString(strings.Repeat("-", 60))
		buf.WriteString("\n\n")

		// 章节内容
		content := g.cleanContent(chapter.Content)
		buf.WriteString(content)
		buf.WriteString("\n\n")

		// 章节信息
		buf.WriteString(fmt.Sprintf("[字数: %d | 更新时间: %s]\n",
			chapter.Words,
			chapter.UpdatedAt.Format("2006-01-02 15:04:05")))
		buf.WriteString("\n\n")
	}

	// 写入结尾
	buf.WriteString(strings.Repeat("=", 60))
	buf.WriteString("\n")
	buf.WriteString(fmt.Sprintf("导出时间: %s\n", time.Now().Format("2006-01-02 15:04:05")))
	buf.WriteString(strings.Repeat("=", 60))
	buf.WriteString("\n")

	return buf.Bytes(), nil
}

// GetFileExtension 获取文件扩展名
func (g *TXTGenerator) GetFileExtension() string {
	return ".txt"
}

// GetMimeType 获取MIME类型
func (g *TXTGenerator) GetMimeType() string {
	return "text/plain; charset=utf-8"
}

// cleanContent 清理HTML标签和格式化内容
func (g *TXTGenerator) cleanContent(content string) string {
	// 简单的HTML标签清理
	content = strings.ReplaceAll(content, "<p>", "")
	content = strings.ReplaceAll(content, "</p>", "\n")
	content = strings.ReplaceAll(content, "<br>", "\n")
	content = strings.ReplaceAll(content, "<br/>", "\n")
	content = strings.ReplaceAll(content, "<br />", "\n")
	content = strings.ReplaceAll(content, "&nbsp;", " ")
	content = strings.ReplaceAll(content, "&lt;", "<")
	content = strings.ReplaceAll(content, "&gt;", ">")
	content = strings.ReplaceAll(content, "&amp;", "&")
	content = strings.ReplaceAll(content, "&quot;", "\"")

	// 移除多余的空行
	lines := strings.Split(content, "\n")
	var cleaned []string
	prevEmpty := false
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			if !prevEmpty {
				cleaned = append(cleaned, "")
				prevEmpty = true
			}
		} else {
			cleaned = append(cleaned, "    "+line) // 添加段落缩进
			prevEmpty = false
		}
	}

	return strings.Join(cleaned, "\n")
}
