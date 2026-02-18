# JUGO Backend

JUGO（AI小说剧本创作平台）后端服务

## 技术栈

- **语言**: Go 1.21+
- **框架**: Gin
- **ORM**: GORM
- **数据库**: MySQL 8.0+
- **缓存**: Redis 7+
- **消息队列**: RabbitMQ
- **对象存储**: MinIO/S3
- **AI服务**: Claude API + DeepSeek API

## 项目结构

```
backend/
├── cmd/
│   └── api/              # 应用入口
├── internal/
│   ├── api/
│   │   ├── handler/      # HTTP处理器
│   │   ├── middleware/   # 中间件
│   │   ├── router/       # 路由配置
│   │   └── websocket/    # WebSocket处理
│   ├── service/          # 业务逻辑层
│   ├── repository/       # 数据访问层
│   ├── model/            # 数据模型
│   ├── dto/              # 数据传输对象
│   ├── queue/            # 消息队列
│   └── pkg/              # 内部工具包
├── pkg/                  # 公共工具包
├── config/               # 配置文件
├── migrations/           # 数据库迁移
├── scripts/              # 脚本
├── tests/                # 测试
├── docs/                 # 文档
├── Dockerfile
├── docker-compose.yml
├── Makefile
└── go.mod
```

## 快速开始

### 前置要求

- Go 1.21+
- Docker & Docker Compose
- Make

### 1. 克隆项目

```bash
git clone <repository-url>
cd jugo/backend
```

### 2. 安装依赖

```bash
make deps
```

### 3. 启动基础设施

```bash
make docker-up
```

这将启动以下服务：
- MySQL (端口 3306)
- Redis (端口 6379)
- RabbitMQ (端口 5672, 管理界面 15672)
- MinIO (端口 9000, 控制台 9001)

### 4. 配置

复制配置文件并根据需要修改：

```bash
cp config/config.yaml config/config.local.yaml
# 编辑 config.local.yaml 设置你的配置
```

### 5. 运行应用

```bash
make run
```

应用将在 `http://localhost:8080` 启动

### 6. 健康检查

```bash
curl http://localhost:8080/health
```

## 开发

### 构建

```bash
make build
```

### 运行测试

```bash
make test
```

### 代码格式化

```bash
make fmt
```

### 代码检查

```bash
make lint
```

## Docker

### 构建镜像

```bash
make docker-build
```

### 运行容器

```bash
make docker-run
```

## API文档

API文档请参考：[JUGO后端API设计方案.md](../docs/JUGO后端API设计方案.md)

## 开发计划

当前处于 **阶段1：项目初始化、基础设施**

已完成：
- ✅ 项目结构初始化
- ✅ Go模块配置
- ✅ 配置管理系统
- ✅ 数据库连接（MySQL/GORM）
- ✅ Redis连接
- ✅ 核心中间件（日志、CORS、错误恢复、请求ID）
- ✅ 基础路由和健康检查
- ✅ 公共工具包（响应封装、日志）
- ✅ Docker容器化
- ✅ Makefile和脚本

待实现：
- ⏳ 认证授权、用户管理
- ⏳ 作品管理、章节管理
- ⏳ 内容保存、WebSocket
- ⏳ AI功能
- ⏳ 导出功能
- ⏳ 角色管理

## 贡献

请参考项目贡献指南

## 许可证

[待定]
