package dto

// ExportFormat 导出格式
type ExportFormat string

const (
	ExportFormatTXT  ExportFormat = "txt"
	ExportFormatDOCX ExportFormat = "docx"
	ExportFormatPDF  ExportFormat = "pdf"
	ExportFormatEPUB ExportFormat = "epub"
)

// ExportRequest 导出请求
type ExportRequest struct {
	Format            ExportFormat `json:"format" binding:"required,oneof=txt docx pdf epub"`
	IncludeMetadata   bool         `json:"includeMetadata"`   // 是否包含元数据
	IncludeChapters   bool         `json:"includeChapters"`   // 是否包含章节
	IncludeCharacters bool         `json:"includeCharacters"` // 是否包含角色信息
}

// ExportResponse 导出响应
type ExportResponse struct {
	TaskID      string `json:"taskId,omitempty"`      // 任务ID（异步导出时使用）
	DownloadURL string `json:"downloadUrl,omitempty"` // 下载链接（同步导出时使用）
	FileName    string `json:"fileName"`              // 文件名
	FileSize    int64  `json:"fileSize"`              // 文件大小（字节）
	Format      string `json:"format"`                // 导出格式
	Status      string `json:"status"`                // 状态：pending, processing, completed, failed
}
