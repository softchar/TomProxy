@echo off
chcp 65001 >nul
title Binance API 代理 - Cloudflare Workers 部署

echo ======================================
echo Binance API Proxy - Cloudflare Workers
echo ======================================
echo.

REM 检查 Git 是否安装
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git 未安装，请先安装 Git
    echo 下载地址: https://git-scm.com/downloads
    pause
    exit /b 1
)

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ 环境检查通过
echo.

REM 检查是否已初始化 Git 仓库
if not exist ".git" (
    echo 📦 初始化 Git 仓库...
    git init
    git add .
    git commit -m "Initial commit: Binance API proxy for Cloudflare Workers"
    echo ✅ Git 仓库已初始化
    echo.
)

REM 检查是否已设置远程仓库
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo 📝 请按以下步骤操作：
    echo.
    echo 1. 在 GitHub 上创建新仓库
    echo    访问: https://github.com/new
    echo.
    echo 2. 运行以下命令添加远程仓库：
    echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
    echo.
    echo 3. 推送代码：
    echo    git branch -M main
    echo    git push -u origin main
    echo.
    echo 4. 在 GitHub 仓库设置中添加 Secrets:
    echo    - CLOUDFLARE_API_TOKEN
    echo    - CLOUDFLARE_ACCOUNT_ID
    echo.
    echo    获取方法请查看 README.md
    echo.
) else (
    echo ✅ 远程仓库已配置
    echo.
    echo 🚀 推送代码到 GitHub？
    pause
    git push
)

echo.
echo ======================================
echo 📚 详细文档请查看 README.md
echo ======================================
pause
