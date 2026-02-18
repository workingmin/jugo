# Export API Documentation

## Overview

The Export API allows users to export their works in multiple formats: TXT, DOCX, PDF, and EPUB.

**Current Implementation Status:**
- ✅ TXT - Fully implemented
- ⚠️ DOCX - Stub implementation (requires library integration)
- ⚠️ PDF - Stub implementation (requires library integration)
- ⚠️ EPUB - Stub implementation (requires library integration)

## Endpoint

### Export Work
**POST** `/api/v1/works/:id/export`

Export a work in the specified format.

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**
- `id` (integer, required) - Work ID

**Request Body:**
```json
{
  "format": "txt",
  "includeMetadata": true,
  "includeChapters": true,
  "includeCharacters": true
}
```

**Request Fields:**
- `format` (string, required) - Export format: `txt`, `docx`, `pdf`, or `epub`
- `includeMetadata` (boolean, optional) - Include work metadata (default: true)
- `includeChapters` (boolean, optional) - Include chapter content (default: true)
- `includeCharacters` (boolean, optional) - Include character information (default: true)

**Response (Success - 200 OK):**
```json
{
  "code": 200,
  "message": "Export completed successfully",
  "data": {
    "fileName": "我的小说_20240101120000.txt",
    "fileSize": 102400,
    "format": "txt",
    "status": "completed",
    "downloadUrl": "/api/v1/exports/download/我的小说_20240101120000.txt"
  }
}
```

**Response Fields:**
- `fileName` (string) - Generated file name
- `fileSize` (integer) - File size in bytes
- `format` (string) - Export format
- `status` (string) - Export status: `pending`, `processing`, `completed`, `failed`
- `downloadUrl` (string) - Download URL (temporary, for current implementation)
- `taskId` (string, optional) - Task ID for async exports (future implementation)

## Export Formats

### TXT Format
Plain text format with UTF-8 encoding.

**Features:**
- Work title and metadata
- Character list with descriptions
- All chapters with content
- Automatic HTML tag cleaning
- Paragraph indentation
- Export timestamp

**Example Output:**
```
============================================================
我的小说
============================================================

【作品信息】
类型: novel
题材: 科幻
字数: 50000
章节数: 10
创建时间: 2024-01-01 10:00:00

【角色列表】

张三 (protagonist)
主角，一个勇敢的年轻人

============================================================

第1章 开始
------------------------------------------------------------

    这是第一章的内容...

[字数: 5000 | 更新时间: 2024-01-01 12:00:00]

...
```

### DOCX Format
Microsoft Word document format.

**Status:** Not yet implemented
**Error:** Returns "DOCX export not implemented yet"

**Planned Features:**
- Professional document formatting
- Table of contents
- Headers and footers
- Custom styles
- Character profiles section

### PDF Format
Portable Document Format.

**Status:** Not yet implemented
**Error:** Returns "PDF export not implemented yet"

**Planned Features:**
- Professional layout
- Custom fonts (including Chinese font support)
- Page numbers
- Bookmarks for chapters
- Metadata embedding

### EPUB Format
Electronic Publication format for e-readers.

**Status:** Not yet implemented
**Error:** Returns "EPUB export not implemented yet"

**Planned Features:**
- E-reader compatible
- Table of contents
- Chapter navigation
- Metadata support
- Cover image support

## Error Responses

### 400 Bad Request
```json
{
  "code": 400,
  "message": "Invalid request parameters"
}
```

### 400 Unsupported Format
```json
{
  "code": 400,
  "message": "Unsupported export format"
}
```

### 400 Not Implemented
```json
{
  "code": 400,
  "message": "DOCX export not implemented yet"
}
```

### 401 Unauthorized
```json
{
  "code": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "code": 403,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "code": 404,
  "message": "Work not found"
}
```

### 500 Internal Server Error
```json
{
  "code": 500,
  "message": "Failed to export work"
}
```

## Usage Examples

### Export as TXT (cURL)
```bash
curl -X POST https://api.jugo.ai/v1/works/1/export \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "txt",
    "includeMetadata": true,
    "includeChapters": true,
    "includeCharacters": true
  }'
```

### Export as TXT (JavaScript)
```javascript
const response = await fetch('https://api.jugo.ai/v1/works/1/export', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    format: 'txt',
    includeMetadata: true,
    includeChapters: true,
    includeCharacters: true
  })
});

const result = await response.json();
console.log('Download URL:', result.data.downloadUrl);
```

## Implementation Notes

### Current Limitations
1. **File Storage:** Currently returns a temporary download URL. Actual file storage to MinIO/S3 is not yet implemented.
2. **Async Processing:** Large exports are processed synchronously. Async processing with RabbitMQ is planned for future implementation.
3. **Download Endpoint:** The download endpoint referenced in the response is not yet implemented.
4. **Format Support:** Only TXT format is fully functional. DOCX, PDF, and EPUB require additional library integration.

### Future Enhancements
1. **MinIO/S3 Integration:** Upload exported files to object storage
2. **Async Export:** Use RabbitMQ for large file exports
3. **Download Endpoint:** Implement `/api/v1/exports/download/:filename`
4. **Progress Tracking:** WebSocket notifications for export progress
5. **Export History:** Track user's export history
6. **Custom Templates:** Allow users to customize export templates
7. **Batch Export:** Export multiple works at once
8. **Format Options:** Additional format-specific options (font size, page layout, etc.)

### Required Dependencies (for full implementation)
```bash
# DOCX support
go get github.com/nguyenthenguyen/docx

# PDF support
go get github.com/jung-kurt/gofpdf
# or
go get github.com/signintech/gopdf

# EPUB support
go get github.com/bmaupin/go-epub

# MinIO/S3 support
go get github.com/minio/minio-go/v7
```

## Security Considerations

1. **Authorization:** Users can only export their own works
2. **Rate Limiting:** Consider implementing rate limits for export operations
3. **File Size Limits:** Large exports may need size restrictions
4. **Temporary Files:** Implement cleanup for temporary export files
5. **Download Links:** Use signed URLs with expiration for downloads

## Performance Considerations

1. **Large Works:** Works with many chapters may take time to export
2. **Concurrent Exports:** Multiple simultaneous exports may impact server performance
3. **Memory Usage:** Large exports may consume significant memory
4. **Caching:** Consider caching frequently exported works

## Testing

### Test Cases
1. Export TXT format with all options enabled
2. Export TXT format with minimal options
3. Export non-existent work (should return 404)
4. Export another user's work (should return 403)
5. Export with invalid format (should return 400)
6. Export DOCX/PDF/EPUB (should return not implemented error)
7. Export work with no chapters
8. Export work with special characters in title
9. Export work with very long content

### Manual Testing
```bash
# Test TXT export
curl -X POST http://localhost:8080/api/v1/works/1/export \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"format":"txt","includeMetadata":true,"includeChapters":true,"includeCharacters":true}'
```
