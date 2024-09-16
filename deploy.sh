#!/bin/bash

# 部署脚本 for Ebotian's Blog on Ubuntu

# 确保脚本在错误时停止执行
set -e

# 定义颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的信息
info() {
    echo -e "${GREEN}[INFO] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARN] $1${NC}"
}

# 检查必要的工具
check_tool() {
    if ! command -v $1 &> /dev/null; then
        warn "$1 未安装。正在尝试安装..."
        sudo apt update && sudo apt install -y $1
        if ! command -v $1 &> /dev/null; then
            warn "安装 $1 失败。请手动安装后再运行此脚本。"
            exit 1
        fi
    fi
}

# 检查并安装必要的工具
check_tool git
check_tool curl

# 安装 Node.js 和 npm（如果尚未安装）
if ! command -v node &> /dev/null; then
    info "安装 Node.js 和 npm..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 更新代码
info "更新代码..."
git pull

# 安装依赖
info "安装依赖..."
npm install

# 构建项目
info "构建项目..."
npm run build

# 检查是否安装了 pm2
if ! command -v pm2 &> /dev/null; then
    info "安装 pm2..."
    sudo npm install -g pm2
fi

# 使用 pm2 启动或重启服务
if pm2 list | grep -q "ebotian-blog"; then
    info "重启服务..."
    pm2 restart ebotian-blog
else
    info "启动服务..."
    pm2 start npm --name "ebotian-blog" -- start
fi

info "部署完成！您的博客现在应该在后台运行。"
info "使用 'pm2 monit' 查看运行状态，或 'pm2 logs ebotian-blog' 查看日志。"