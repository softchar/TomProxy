#!/bin/bash

# Binance API 代理 - Cloudflare Workers 快速部署脚本

echo "======================================"
echo "Binance API Proxy - Cloudflare Workers"
echo "======================================"
echo ""

# 检查 Git 是否安装
if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装，请先安装 Git"
    exit 1
fi

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

echo "✅ 环境检查通过"
echo ""

# 检查是否已初始化 Git 仓库
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit: Binance API proxy for Cloudflare Workers"
    echo "✅ Git 仓库已初始化"
    echo ""
fi

# 检查是否已设置远程仓库
if ! git remote get-url origin &> /dev/null; then
    echo "📝 请按以下步骤操作："
    echo ""
    echo "1. 在 GitHub 上创建新仓库"
    echo "   访问: https://github.com/new"
    echo ""
    echo "2. 运行以下命令添加远程仓库："
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo ""
    echo "3. 推送代码："
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "4. 在 GitHub 仓库设置中添加 Secrets:"
    echo "   - CLOUDFLARE_API_TOKEN"
    echo "   - CLOUDFLARE_ACCOUNT_ID"
    echo ""
else
    echo "✅ 远程仓库已配置"
    echo ""
    echo "🚀 推送代码到 GitHub？"
    read -p "按 Enter 继续，或 Ctrl+C 取消..."
    git push
fi

echo ""
echo "======================================"
echo "📚 详细文档请查看 README.md"
echo "======================================"
