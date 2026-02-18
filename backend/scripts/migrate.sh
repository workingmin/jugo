#!/bin/bash

# 数据库迁移脚本

# 配置
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_USER=${DB_USER:-jugo}
DB_PASSWORD=${DB_PASSWORD:-jugo123456}
DB_NAME=${DB_NAME:-jugo_dev}

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Running database migrations..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo ""

# 执行迁移文件
for file in migrations/*.sql; do
    if [ -f "$file" ]; then
        echo -n "Executing $(basename $file)... "
        if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$file" 2>/dev/null; then
            echo -e "${GREEN}✓${NC}"
        else
            echo -e "${RED}✗${NC}"
            echo "Error executing $file"
            exit 1
        fi
    fi
done

echo ""
echo -e "${GREEN}All migrations completed successfully!${NC}"
