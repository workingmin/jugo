# JUGO后端API设计方案

## 概述

本文档定义 JUGO AI 写作平台的后端 API 接口设计，基于 RESTful 架构风格。

**基础信息**：
- Base URL: `https://api.jugo.ai/v1`
- 认证方式: JWT Bearer Token
- 数据格式: JSON
- 字符编码: UTF-8

---

## 1. 认证模块 (Authentication)

### 1.1 用户注册
```http
POST /auth/register
```

**请求体**：
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username"
}
```

**响应**：
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "usr_123456",
    "email": "user@example.com",
    "username": "username",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

### 1.2 用户登录
```http
POST /auth/login
```

**请求体**：
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "userId": "usr_123456",
    "email": "user@example.com",
    "username": "username",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 86400
  }
}
```

### 1.3 刷新令牌
```http
POST /auth/refresh
```

**请求体**：
```json
{
  "refreshToken": "refresh_token_here"
}
```

### 1.4 登出
```http
POST /auth/logout
```

---

## 2. 用户模块 (User)

### 2.1 获取用户信息
```http
GET /users/me
```

**响应**：
```json
{
  "code": 200,
  "data": {
    "userId": "usr_123456",
    "username": "username",
    "email": "user@example.com",
    "avatar": "https://cdn.jugo.ai/avatars/123.jpg",
    "createdAt": "2024-01-01T00:00:00Z",
    "stats": {
      "totalWorks": 15,
      "totalWords": 250000,
      "totalChapters": 120
    }
  }
}
```

### 2.2 更新用户信息
```http
PATCH /users/me
```

**请求体**：
```json
{
  "username": "new_username",
  "avatar": "https://cdn.jugo.ai/avatars/new.jpg"
}
```

---

## 3. 作品模块 (Works)

### 3.1 获取作品列表
```http
GET /works?type={type}&status={status}&page={page}&limit={limit}&sort={sort}
```

**查询参数**：
- `type`: 作品类型 (`novel` | `screenplay` | `all`)
- `status`: 状态 (`draft` | `completed` | `all`)
- `page`: 页码（默认 1）
- `limit`: 每页数量（默认 20）
- `sort`: 排序方式 (`updatedAt` | `createdAt` | `words` | `title`)

**响应**：
```json
{
  "code": 200,
  "data": {
    "works": [
      {
        "workId": "wrk_123456",
        "type": "novel",
        "title": "都市修仙传",
        "genre": "都市",
        "status": "draft",
        "words": 32000,
        "chapters": 20,
        "coverImage": "https://cdn.jugo.ai/covers/123.jpg",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "totalPages": 1
    }
  }
}
```

### 3.2 创建作品
```http
POST /works
```

**请求体**：
```json
{
  "type": "novel",
  "title": "都市修仙传",
  "topic": "一个普通程序员意外获得修仙系统",
  "genre": "都市",
  "numChapters": 20,
  "wordPerChapter": 1500
}
```

**响应**：
```json
{
  "code": 201,
  "message": "作品创建成功",
  "data": {
    "workId": "wrk_123456",
    "type": "novel",
    "title": "都市修仙传",
    "status": "draft",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 3.3 获取作品详情
```http
GET /works/{workId}
```

**响应**：
```json
{
  "code": 200,
  "data": {
    "workId": "wrk_123456",
    "type": "novel",
    "title": "都市修仙传",
    "topic": "一个普通程序员意外获得修仙系统",
    "genre": "都市",
    "status": "draft",
    "words": 32000,
    "numChapters": 20,
    "wordPerChapter": 1500,
    "coverImage": "https://cdn.jugo.ai/covers/123.jpg",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "metadata": {
      "snowflake": {
        "step1": "核心概括",
        "step2": "扩展描述",
        "step3": []
      }
    }
  }
}
```

### 3.4 更新作品信息
```http
PATCH /works/{workId}
```

**请求体**：
```json
{
  "title": "新标题",
  "topic": "新主题",
  "genre": "玄幻",
  "status": "completed"
}
```

### 3.5 删除作品
```http
DELETE /works/{workId}
```

**响应**：
```json
{
  "code": 200,
  "message": "作品已删除"
}
```

---

## 4. 章节/场景模块

### 4.1 获取章节列表（小说）
```http
GET /works/{workId}/chapters
```

**响应**：
```json
{
  "code": 200,
  "data": {
    "chapters": [
      {
        "chapterId": "ch_123456",
        "workId": "wrk_123456",
        "title": "第一章：觉醒",
        "content": "<p>章节内容...</p>",
        "words": 1600,
        "order": 1,
        "status": "draft",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### 4.2 创建章节
```http
POST /works/{workId}/chapters
```

**请求体**：
```json
{
  "title": "第一章：觉醒",
  "content": "<p>章节内容...</p>",
  "order": 1
}
```

### 4.3 更新章节
```http
PATCH /works/{workId}/chapters/{chapterId}
```

**请求体**：
```json
{
  "title": "第一章：觉醒（修改）",
  "content": "<p>更新后的内容...</p>"
}
```

### 4.4 删除章节
```http
DELETE /works/{workId}/chapters/{chapterId}
```

### 4.5 获取场景列表（剧本）
```http
GET /works/{workId}/scenes
```

**响应**：
```json
{
  "code": 200,
  "data": {
    "scenes": [
      {
        "sceneId": "sc_123456",
        "workId": "wrk_123456",
        "title": "场景1：咖啡厅-白天-内景",
        "content": "场景内容...",
        "duration": 3,
        "order": 1,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### 4.6 创建场景
```http
POST /works/{workId}/scenes
```

### 4.7 更新场景
```http
PATCH /works/{workId}/scenes/{sceneId}
```

### 4.8 删除场景
```http
DELETE /works/{workId}/scenes/{sceneId}
```

---

## 5. 内容保存模块

### 5.1 自动保存
```http
POST /works/{workId}/autosave
```

**请求体**：
```json
{
  "type": "chapter",
  "id": "ch_123456",
  "content": "<p>内容...</p>",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**响应**：
```json
{
  "code": 200,
  "message": "自动保存成功",
  "data": {
    "savedAt": "2024-01-15T10:30:00Z",
    "version": 15
  }
}
```

### 5.2 手动保存
```http
POST /works/{workId}/save
```

**请求体**：
```json
{
  "type": "chapter",
  "id": "ch_123456",
  "content": "<p>内容...</p>"
}
```

---

## 6. AI 功能模块

### 6.1 AI 续写
```http
POST /ai/continue
```

**请求体**：
```json
{
  "workId": "wrk_123456",
  "type": "novel",
  "context": "<p>前文内容...</p>",
  "length": 500,
  "style": "轻松幽默"
}
```

**响应**：
```json
{
  "code": 200,
  "data": {
    "taskId": "task_123456",
    "status": "processing",
    "estimatedTime": 30
  }
}
```

### 6.2 AI 润色
```http
POST /ai/polish
```

**请求体**：
```json
{
  "workId": "wrk_123456",
  "content": "<p>需要润色的内容...</p>",
  "style": "优雅"
}
```

### 6.3 AI 扩写
```http
POST /ai/expand
```

### 6.4 AI 改写
```http
POST /ai/rewrite
```

### 6.5 AI 大纲生成
```http
POST /ai/outline
```

**请求体**：
```json
{
  "workId": "wrk_123456",
  "topic": "一个普通程序员意外获得修仙系统",
  "genre": "都市",
  "numChapters": 20
}
```

**响应**：
```json
{
  "code": 200,
  "data": {
    "taskId": "task_123456",
    "status": "processing"
  }
}
```

### 6.6 获取 AI 任务状态
```http
GET /ai/tasks/{taskId}
```

**响应**：
```json
{
  "code": 200,
  "data": {
    "taskId": "task_123456",
    "status": "completed",
    "progress": 100,
    "result": {
      "content": "生成的内容...",
      "metadata": {}
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "completedAt": "2024-01-15T10:32:00Z"
  }
}
```

### 6.7 小说转剧本
```http
POST /ai/convert/novel-to-screenplay
```

**请求体**：
```json
{
  "workId": "wrk_123456",
  "options": {
    "targetDuration": 60,
    "numScenes": 15
  }
}
```

**响应**：
```json
{
  "code": 200,
  "data": {
    "taskId": "task_123456",
    "status": "processing",
    "estimatedTime": 120
  }
}
```

### 6.8 剧本转小说
```http
POST /ai/convert/screenplay-to-novel
```

**请求体**：
```json
{
  "workId": "wrk_123456",
  "options": {
    "numChapters": 20,
    "wordPerChapter": 1500
  }
}
```

---

## 7. 角色管理模块

### 7.1 获取角色列表
```http
GET /works/{workId}/characters
```

**响应**：
```json
{
  "code": 200,
  "data": {
    "characters": [
      {
        "characterId": "char_123456",
        "name": "李明",
        "role": "主角",
        "age": 28,
        "description": "普通程序员，意外获得修仙系统",
        "appearances": 15,
        "traits": ["聪明", "勇敢", "善良"],
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 7.2 创建角色
```http
POST /works/{workId}/characters
```

**请求体**：
```json
{
  "name": "李明",
  "role": "主角",
  "age": 28,
  "description": "普通程序员",
  "traits": ["聪明", "勇敢"]
}
```

### 7.3 更新角色
```http
PATCH /works/{workId}/characters/{characterId}
```

### 7.4 删除角色
```http
DELETE /works/{workId}/characters/{characterId}
```

---

## 8. 导出模块

### 8.1 导出作品
```http
POST /works/{workId}/export
```

**请求体**：
```json
{
  "format": "docx",
  "options": {
    "includeChapters": [1, 2, 3],
    "includeCover": true
  }
}
```

**响应**：
```json
{
  "code": 200,
  "data": {
    "taskId": "export_123456",
    "status": "processing"
  }
}
```

### 8.2 获取导出任务状态
```http
GET /exports/{taskId}
```

**响应**：
```json
{
  "code": 200,
  "data": {
    "taskId": "export_123456",
    "status": "completed",
    "downloadUrl": "https://cdn.jugo.ai/exports/123456.docx",
    "expiresAt": "2024-01-16T10:30:00Z"
  }
}
```

### 8.3 下载导出文件
```http
GET /exports/{taskId}/download
```

---

## 9. WebSocket 实时通信

> **说明**：素材库模块已移除，因其未在 web-prototype 中实现。

### 9.1 连接
```
ws://api.jugo.ai/v1/ws?token={jwt_token}
```

### 9.2 消息格式

**客户端 → 服务器**：
```json
{
  "type": "autosave",
  "workId": "wrk_123456",
  "chapterId": "ch_123456",
  "content": "<p>内容...</p>",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**服务器 → 客户端**：
```json
{
  "type": "autosave_ack",
  "success": true,
  "savedAt": "2024-01-15T10:30:00Z"
}
```

**AI 任务进度推送**：
```json
{
  "type": "ai_progress",
  "taskId": "task_123456",
  "progress": 50,
  "message": "正在生成大纲..."
}
```

---

## 10. 错误响应格式

```json
{
  "code": 400,
  "message": "请求参数错误",
  "errors": [
    {
      "field": "title",
      "message": "标题不能为空"
    }
  ]
}
```

**常见错误码**：
- `400`: 请求参数错误
- `401`: 未授权（未登录或 token 过期）
- `403`: 禁止访问（权限不足）
- `404`: 资源不存在
- `409`: 资源冲突
- `429`: 请求过于频繁
- `500`: 服务器内部错误
- `503`: 服务暂时不可用

---

## 12. 分页规范

所有列表接口统一使用以下分页参数：

**请求参数**：
- `page`: 页码（从 1 开始）
- `limit`: 每页数量（默认 20，最大 100）

**响应格式**：
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 13. 速率限制

- 普通用户：100 请求/分钟
- VIP 用户：500 请求/分钟
- AI 功能：10 请求/分钟

**响应头**：
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642234567
```

---

## 14. 版本控制

API 版本通过 URL 路径指定：
- v1: `https://api.jugo.ai/v1`
- v2: `https://api.jugo.ai/v2`（未来）

---

## 15. 安全性

### 15.1 认证
- 使用 JWT Bearer Token
- Token 有效期：24 小时
- Refresh Token 有效期：30 天

### 15.2 HTTPS
- 所有 API 请求必须使用 HTTPS

### 15.3 CORS
- 允许的域名：`https://jugo.ai`, `https://www.jugo.ai`

### 15.4 内容安全
- 所有用户输入进行 XSS 过滤
- SQL 注入防护
- 文件上传大小限制：10MB

---

## 附录：数据模型

### Work（作品）
```typescript
interface Work {
  workId: string;
  userId: string;
  type: 'novel' | 'screenplay';
  title: string;
  topic: string;
  genre: string;
  status: 'draft' | 'completed' | 'published';
  words: number;
  numChapters?: number;
  wordPerChapter?: number;
  numScenes?: number;
  targetDuration?: number;
  coverImage?: string;
  metadata: object;
  createdAt: string;
  updatedAt: string;
}
```

### Chapter（章节）
```typescript
interface Chapter {
  chapterId: string;
  workId: string;
  title: string;
  content: string;
  words: number;
  order: number;
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
}
```

### Scene（场景）
```typescript
interface Scene {
  sceneId: string;
  workId: string;
  title: string;
  content: string;
  duration: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

### Character（角色）
```typescript
interface Character {
  characterId: string;
  workId: string;
  name: string;
  role: string;
  age?: number;
  description: string;
  appearances: number;
  traits: string[];
  createdAt: string;
  updatedAt: string;
}
```
