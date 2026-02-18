# JUGO（AI小说剧本创作平台）后端设计方案稿

## 文档信息

- **项目名称**：JUGO AI 写作平台
- **文档版本**：v1.0
- **编写日期**：2024
- **技术栈**：Golang + MySQL + Redis + RabbitMQ

---

## 一、系统概述

### 1.1 项目背景

JUGO 是一个基于 AI 的智能写作平台，支持小说和剧本两种创作模式，提供 AI 辅助创作、格式转换、实时协作等功能。本文档描述后端系统的技术架构和实现方案。

### 1.2 技术选型

| 技术组件 | 选型 | 版本 | 说明 |
|---------|------|------|------|
| 开发语言 | Golang | 1.21+ | 高性能、并发友好 |
| Web 框架 | Gin | latest | 轻量级、高性能 |
| ORM | GORM | latest | 功能完善、易用 |
| 数据库 | MySQL | 8.0+ | 成熟稳定、生态完善 |
| 缓存 | Redis | 7+ | 高性能 KV 存储 |
| 消息队列 | RabbitMQ | latest | 可靠的消息传递 |
| 对象存储 | MinIO/S3 | latest | 文件存储 |
| AI 服务 | Claude API + DeepSeek API | latest | 混合模型架构：Claude Sonnet 4.5 (主力) + DeepSeek V3 (辅助) |

### 1.3 系统特性

- **RESTful API**：标准化的 HTTP 接口设计
- **WebSocket**：实时通信和进度推送
- **异步任务**：AI 功能采用消息队列异步处理
- **分层架构**：Handler → Service → Repository 清晰分层
- **安全性**：JWT 认证、速率限制、数据加密
- **可扩展性**：微服务架构、水平扩展

---

## 二、系统架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                         客户端层                              │
│                  (Web / Mobile / Desktop)                    │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS / WebSocket
┌────────────────────┴────────────────────────────────────────┐
│                      API Gateway                             │
│              (Nginx / Kong / API Gateway)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                      应用服务层                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  API Server  │  │  WebSocket   │  │  AI Worker   │      │
│  │   (Gin)      │  │    Server    │  │   (Queue)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                      数据存储层                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    MySQL     │  │    Redis     │  │  RabbitMQ    │      │
│  │   (主库)      │  │   (缓存)      │  │  (消息队列)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   MinIO/S3   │  │  Claude API  │                        │
│  │  (对象存储)    │  │  DeepSeek API│                        │
│  │              │  │  (AI服务)     │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 项目目录结构

```
backend/
├── cmd/
│   └── api/
│       └── main.go                 # 应用入口
├── internal/
│   ├── api/
│   │   ├── handler/               # HTTP 处理器
│   │   ├── middleware/            # 中间件
│   │   ├── router/                # 路由配置
│   │   └── websocket/             # WebSocket 处理
│   ├── service/                   # 业务逻辑层
│   ├── repository/                # 数据访问层
│   ├── model/                     # 数据模型
│   ├── dto/                       # 数据传输对象
│   ├── queue/                     # 消息队列
│   └── pkg/                       # 内部工具包
├── pkg/                           # 公共工具包
├── config/                        # 配置文件
├── migrations/                    # 数据库迁移
├── scripts/                       # 脚本
├── tests/                         # 测试
├── docs/                          # 文档
├── Dockerfile
├── docker-compose.yml
├── Makefile
└── go.mod
```

### 2.3 分层架构

```
┌─────────────────────────────────────────────────────────────┐
│                      Handler Layer                           │
│              (HTTP 请求处理、参数验证、响应封装)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                      Service Layer                           │
│              (业务逻辑、事务管理、数据组装)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                    Repository Layer                          │
│              (数据访问、CRUD 操作、查询封装)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                      Model Layer                             │
│              (数据模型、ORM 映射、关系定义)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、数据库设计

### 3.1 ER 图

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Users    │       │    Works    │       │  Chapters   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │───┐   │ id (PK)     │───┐   │ id (PK)     │
│ username    │   └──→│ user_id(FK) │   └──→│ work_id(FK) │
│ email       │       │ type        │       │ title       │
│ password    │       │ title       │       │ content     │
│ avatar      │       │ status      │       │ words       │
└─────────────┘       │ words       │       │ order_num   │
                      └─────────────┘       └─────────────┘
                            │
                            │
                      ┌─────┴─────┐
                      │           │
              ┌───────┴──────┐  ┌┴────────────┐
              │   Scenes     │  │ Characters  │
              ├──────────────┤  ├─────────────┤
              │ id (PK)      │  │ id (PK)     │
              │ work_id (FK) │  │ work_id(FK) │
              │ title        │  │ name        │
              │ content      │  │ role        │
              │ duration     │  │ description │
              └──────────────┘  └─────────────┘
```

### 3.2 核心表结构

#### 3.2.1 用户表 (users)

```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

#### 3.2.2 作品表 (works)

```sql
CREATE TABLE works (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(20) NOT NULL,  -- 'novel' or 'screenplay'
    title VARCHAR(200) NOT NULL,
    topic TEXT,
    genre VARCHAR(50),
    status VARCHAR(20) DEFAULT 'draft',
    words INTEGER DEFAULT 0,
    num_chapters INTEGER,
    word_per_chapter INTEGER,
    num_scenes INTEGER,
    target_duration INTEGER,
    cover_image VARCHAR(255),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_works_user_id ON works(user_id);
CREATE INDEX idx_works_type ON works(type);
CREATE INDEX idx_works_status ON works(status);
CREATE INDEX idx_works_updated_at ON works(updated_at DESC);
```

#### 3.2.3 章节表 (chapters)

```sql
CREATE TABLE chapters (
    id VARCHAR(36) PRIMARY KEY,
    work_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    words INTEGER DEFAULT 0,
    order_num INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
);

CREATE INDEX idx_chapters_work_id ON chapters(work_id);
CREATE INDEX idx_chapters_order ON chapters(work_id, order_num);
```

#### 3.2.4 AI 任务表 (ai_tasks)

```sql
CREATE TABLE ai_tasks (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    work_id VARCHAR(36),
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    input JSON,
    result JSON,
    error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE SET NULL
);

CREATE INDEX idx_ai_tasks_user_id ON ai_tasks(user_id);
CREATE INDEX idx_ai_tasks_status ON ai_tasks(status);
```

### 3.3 数据库优化策略

1. **索引优化**
   - 为高频查询字段创建索引
   - 使用复合索引优化多条件查询
   - 定期分析和优化索引

2. **查询优化**
   - 避免 N+1 查询问题
   - 使用 JOIN 代替多次查询
   - 合理使用 LIMIT 和 OFFSET

3. **连接池配置**
   - 最大连接数：100
   - 最小空闲连接：10
   - 连接超时：30s

---

## 四、核心模块设计

### 4.1 认证授权模块

#### 4.1.1 JWT 认证流程

```
┌──────┐                ┌──────┐                ┌──────┐
│Client│                │Server│                │Redis │
└──┬───┘                └──┬───┘                └──┬───┘
   │  POST /auth/login    │                        │
   │─────────────────────>│                        │
   │                      │  验证用户名密码          │
   │                      │                        │
   │                      │  生成 JWT Token        │
   │                      │                        │
   │                      │  存储 Token 到 Redis   │
   │                      │───────────────────────>│
   │  返回 Token          │                        │
   │<─────────────────────│                        │
   │                      │                        │
   │  GET /api/works      │                        │
   │  Header: Bearer Token│                        │
   │─────────────────────>│                        │
   │                      │  验证 Token            │
   │                      │───────────────────────>│
   │                      │  Token 有效            │
   │                      │<───────────────────────│
   │  返回数据             │                        │
   │<─────────────────────│                        │
```

#### 4.1.2 JWT 实现

```go
type Claims struct {
    UserID string `json:"user_id"`
    Email  string `json:"email"`
    jwt.RegisteredClaims
}

func GenerateToken(userID, email string) (string, error) {
    claims := Claims{
        UserID: userID,
        Email:  email,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(config.JWTSecret))
}
```

### 4.2 AI 功能模块

#### 4.2.1 混合模型架构

**模型选择策略**

采用 **Claude Sonnet 4.5** (主力) + **DeepSeek V3** (辅助) 的混合架构，根据任务类型智能选择模型：

| 任务类型 | 使用模型 | 理由 |
|---------|---------|------|
| 大纲生成 | Claude Sonnet 4.5 | 需要创意和结构化能力 |
| 章节初稿 | DeepSeek V3 | 成本低，快速生成 |
| 内容润色 | Claude Sonnet 4.5 | 提升质量，优化表达 |
| 一致性检查 | Claude Sonnet 4.5 | 利用200K上下文窗口 |
| 剧本转换 | Claude Sonnet 4.5 | 格式严格，需要精确控制 |
| 续写/扩写 | DeepSeek V3 | 大量生成，成本优先 |

**模型配置**

```go
type AIModelConfig struct {
    Claude struct {
        APIKey     string
        Model      string // "claude-sonnet-4.5"
        MaxTokens  int    // 4096
        Temperature float64 // 0.7
    }
    DeepSeek struct {
        APIKey     string
        Model      string // "deepseek-chat"
        MaxTokens  int    // 4096
        Temperature float64 // 0.7
    }
}

// 根据任务类型选择模型
func SelectModel(taskType string) string {
    highQualityTasks := []string{"outline", "polish", "consistency_check", "screenplay_format"}
    for _, t := range highQualityTasks {
        if t == taskType {
            return "claude-sonnet-4.5"
        }
    }
    return "deepseek-v3"
}
```

**成本优化**

- Claude Sonnet 4.5: 用于关键任务（约30%的请求）
- DeepSeek V3: 用于大量生成任务（约70%的请求）
- 预估成本降低60-70%，同时保持高质量输出

#### 4.2.2 异步任务处理流程

```
┌──────┐         ┌──────┐         ┌─────────┐         ┌────────┐
│Client│         │ API  │         │RabbitMQ │         │ Worker │
└──┬───┘         └──┬───┘         └────┬────┘         └───┬────┘
   │ POST /ai/    │                    │                   │
   │ continue     │                    │                   │
   │─────────────>│                    │                   │
   │              │ 创建任务记录         │                   │
   │              │                    │                   │
   │              │ 发送消息到队列       │                   │
   │              │───────────────────>│                   │
   │ 返回 taskId  │                    │                   │
   │<─────────────│                    │                   │
   │              │                    │ 消费消息           │
   │              │                    │──────────────────>│
   │              │                    │                   │
   │              │                    │                   │ 调用 AI API
   │              │                    │                   │
   │              │                    │                   │ 更新进度
   │              │                    │                   │
   │ GET /ai/     │                    │                   │
   │ tasks/:id    │                    │                   │
   │─────────────>│                    │                   │
   │ 返回进度      │                    │                   │
   │<─────────────│                    │                   │
```

#### 4.2.3 任务队列实现

```go
// 生产者
func PublishAITask(task *model.AITask) error {
    body, _ := json.Marshal(task)
    return channel.Publish(
        "",           // exchange
        "ai_tasks",   // routing key
        false,        // mandatory
        false,        // immediate
        amqp.Publishing{
            ContentType: "application/json",
            Body:        body,
        },
    )
}

// 消费者
func ConsumeAITasks() {
    msgs, _ := channel.Consume("ai_tasks", "", false, false, false, false, nil)

    for msg := range msgs {
        var task model.AITask
        json.Unmarshal(msg.Body, &task)

        // 处理 AI 任务
        processAITask(&task)

        msg.Ack(false)
    }
}
```

### 4.3 WebSocket 实时通信

#### 4.3.1 Hub 模式

```go
type Hub struct {
    clients    map[*Client]bool
    broadcast  chan []byte
    register   chan *Client
    unregister chan *Client
}

func (h *Hub) Run() {
    for {
        select {
        case client := <-h.register:
            h.clients[client] = true
        case client := <-h.unregister:
            if _, ok := h.clients[client]; ok {
                delete(h.clients, client)
                close(client.send)
            }
        case message := <-h.broadcast:
            for client := range h.clients {
                select {
                case client.send <- message:
                default:
                    close(client.send)
                    delete(h.clients, client)
                }
            }
        }
    }
}
```

### 4.4 速率限制

#### 4.4.1 Redis 滑动窗口

```go
func RateLimitMiddleware(redis *redis.Client) gin.HandlerFunc {
    return func(c *gin.Context) {
        userID := c.GetString("user_id")
        key := fmt.Sprintf("ratelimit:%s", userID)

        count, err := redis.Incr(c, key).Result()
        if err != nil {
            c.AbortWithStatusJSON(500, gin.H{"error": "Internal error"})
            return
        }

        if count == 1 {
            redis.Expire(c, key, time.Minute)
        }

        if count > 100 {
            c.AbortWithStatusJSON(429, gin.H{"error": "Too many requests"})
            return
        }

        c.Next()
    }
}
```

---

## 五、API 接口设计

### 5.1 接口规范

- **Base URL**: `https://api.jugo.ai/v1`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

### 5.2 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 业务数据
  }
}
```

### 5.3 核心接口列表

| 模块 | 接口 | 方法 | 说明 |
|------|------|------|------|
| 认证 | /auth/register | POST | 用户注册 |
| 认证 | /auth/login | POST | 用户登录 |
| 认证 | /auth/refresh | POST | 刷新令牌 |
| 用户 | /users/me | GET | 获取用户信息 |
| 作品 | /works | GET | 获取作品列表 |
| 作品 | /works | POST | 创建作品 |
| 作品 | /works/:id | GET | 获取作品详情 |
| 作品 | /works/:id | PATCH | 更新作品 |
| 作品 | /works/:id | DELETE | 删除作品 |
| 章节 | /works/:id/chapters | GET | 获取章节列表 |
| 章节 | /works/:id/chapters | POST | 创建章节 |
| AI | /ai/continue | POST | AI 续写 |
| AI | /ai/convert/novel-to-screenplay | POST | 小说转剧本 |
| AI | /ai/tasks/:id | GET | 获取任务状态 |
| 导出 | /works/:id/export | POST | 导出作品 |

详细 API 文档参见：[JUGO后端API设计方案.md](./JUGO后端API设计方案.md)

---

## 六、安全设计

### 6.1 认证安全

- **JWT 令牌**：24 小时有效期
- **Refresh Token**：30 天有效期
- **密码加密**：bcrypt 算法
- **令牌存储**：Redis 黑名单机制

### 6.2 数据安全

- **HTTPS 强制**：所有 API 必须使用 HTTPS
- **敏感数据加密**：密码、密钥等敏感信息加密存储
- **SQL 注入防护**：使用 ORM 参数化查询
- **XSS 防护**：输入验证和输出转义

### 6.3 访问控制

- **速率限制**：
  - 普通用户：100 请求/分钟
  - VIP 用户：500 请求/分钟
  - AI 功能：10 请求/分钟

- **权限控制**：
  - 用户只能访问自己的作品
  - 管理员可以访问所有资源

---

## 七、性能优化

### 7.1 缓存策略

| 数据类型 | 缓存时间 | 更新策略 |
|---------|---------|---------|
| 用户信息 | 1 小时 | 更新时失效 |
| 作品列表 | 5 分钟 | 更新时失效 |
| 热点数据 | 30 分钟 | LRU 淘汰 |

### 7.2 数据库优化

- **读写分离**：主库写入，从库读取
- **连接池**：复用数据库连接
- **慢查询优化**：监控并优化慢查询
- **分页查询**：避免全表扫描

### 7.3 并发优化

- **Goroutine 池**：限制并发数量
- **异步处理**：耗时操作异步化
- **消息队列**：削峰填谷

---

## 八、部署方案

### 8.1 Docker 部署

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis
      - rabbitmq

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: jugo_db
      MYSQL_USER: jugo
      MYSQL_PASSWORD: password
      MYSQL_ROOT_PASSWORD: rootpassword
    volumes:
      - mysql_data:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

volumes:
  mysql_data:
```

### 8.2 CI/CD 流程

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   Git    │────>│  Build   │────>│   Test   │────>│  Deploy  │
│  Push    │     │  Docker  │     │  Unit    │     │   Prod   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

---

## 九、监控和运维

### 9.1 日志系统

- **日志级别**：Debug, Info, Warn, Error
- **日志格式**：JSON 结构化日志
- **日志存储**：ELK Stack (Elasticsearch + Logstash + Kibana)

### 9.2 监控指标

| 指标类型 | 监控项 | 告警阈值 |
|---------|-------|---------|
| 性能 | API 响应时间 | > 1s |
| 性能 | 数据库查询时间 | > 500ms |
| 可用性 | 错误率 | > 1% |
| 资源 | CPU 使用率 | > 80% |
| 资源 | 内存使用率 | > 85% |
| 业务 | AI 任务失败率 | > 5% |

### 9.3 备份策略

- **数据库备份**：每日全量备份 + 实时增量备份
- **文件备份**：对象存储自动备份
- **备份保留**：30 天

---

## 十、开发计划

### 10.1 开发阶段

| 阶段 | 内容 | 工期 | 优先级 |
|------|------|------|--------|
| 阶段 1 | 项目初始化、基础设施 | 5 天 | P0 |
| 阶段 2 | 认证授权、用户管理 | 7 天 | P0 |
| 阶段 3 | 作品管理、章节管理 | 12 天 | P0 |
| 阶段 4 | 内容保存、WebSocket | 7 天 | P0 |
| 阶段 5 | AI 功能（续写、润色、扩写、改写） | 10 天 | P0 |
| 阶段 6 | AI 功能（大纲生成、格式转换） | 5 天 | P0 |
| 阶段 7 | 角色管理 | 3 天 | P0 |
| 阶段 8 | 导出功能（TXT/DOCX/PDF/EPUB） | 5 天 | P1 |
| 阶段 9 | 测试、优化 | 10 天 | P0 |
| 阶段 10 | 部署、文档 | 5 天 | P0 |

**总计**：约 69 个工作日（3-4 个月）

### 10.2 团队配置

- **后端开发**：2-3 人
- **测试工程师**：1 人
- **DevOps 工程师**：1 人（兼职）

---

## 十一、风险评估

### 11.1 技术风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| AI API 不稳定 | 高 | 中 | 实现重试机制、降级方案 |
| 数据库性能瓶颈 | 高 | 低 | 读写分离、缓存优化 |
| 并发量过大 | 中 | 中 | 负载均衡、水平扩展 |

### 11.2 业务风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| AI 成本过高 | 高 | 中 | 实现配额管理、优化 Prompt |
| 用户数据安全 | 高 | 低 | 加密存储、定期审计 |

---

## 十二、附录

### 12.1 参考文档

- [JUGO后端API设计方案.md](./JUGO后端API设计方案.md)
- [JUGO前端设计方案稿.md](./JUGO前端设计方案稿.md)
- [Standard Go Project Layout](https://github.com/golang-standards/project-layout)

### 12.2 技术文档

- [Gin Framework](https://gin-gonic.com/)
- [GORM](https://gorm.io/)
- [MySQL](https://www.mysql.com/)
- [Redis](https://redis.io/)
- [RabbitMQ](https://www.rabbitmq.com/)

---

**文档结束**
