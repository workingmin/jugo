.PHONY: help build run test clean docker-up docker-down migrate-up migrate-down

# 默认目标
help:
	@echo "JUGO Backend Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make build        - Build the application"
	@echo "  make run          - Run the application"
	@echo "  make test         - Run tests"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make docker-up    - Start Docker services"
	@echo "  make docker-down  - Stop Docker services"
	@echo "  make deps         - Install dependencies"
	@echo "  make fmt          - Format code"
	@echo "  make lint         - Run linter"

# 构建应用
build:
	@echo "Building application..."
	@go build -o bin/jugo-api cmd/api/main.go

# 运行应用
run:
	@echo "Running application..."
	@go run cmd/api/main.go

# 运行测试
test:
	@echo "Running tests..."
	@go test -v ./...

# 清理构建产物
clean:
	@echo "Cleaning..."
	@rm -rf bin/
	@rm -rf logs/

# 启动Docker服务
docker-up:
	@echo "Starting Docker services..."
	@docker-compose up -d

# 停止Docker服务
docker-down:
	@echo "Stopping Docker services..."
	@docker-compose down

# 安装依赖
deps:
	@echo "Installing dependencies..."
	@go mod download
	@go mod tidy

# 格式化代码
fmt:
	@echo "Formatting code..."
	@go fmt ./...

# 运行linter
lint:
	@echo "Running linter..."
	@golangci-lint run

# 数据库迁移
migrate-up:
	@echo "Running migrations..."
	@bash scripts/migrate.sh

migrate-down:
	@echo "Rolling back migrations..."
	@echo "TODO: Implement migration rollback"

# 构建Docker镜像
docker-build:
	@echo "Building Docker image..."
	@docker build -t jugo-backend:latest .

# 运行Docker容器
docker-run:
	@echo "Running Docker container..."
	@docker run -p 8080:8080 jugo-backend:latest
