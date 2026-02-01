# Cloudflare Workers 部署详细步骤

## 📋 部署前准备

需要以下账号：
- ✅ GitHub 账号（免费注册：https://github.com/signup）
- ✅ Cloudflare 账号（免费注册：https://dash.cloudflare.com/sign-up）

---

## 步骤 1：创建 GitHub 仓库

### 1.1 登录 GitHub
访问：https://github.com

### 1.2 创建新仓库
点击右上角 **+** → **New repository**

### 1.3 填写仓库信息
```
Repository name: binance-api-proxy
Description: Binance API 代理
☐ Public  ☑ Private（推荐选 Private）
☐ Add a README file（不要勾选）
```

点击 **Create repository**

### 1.4 上传代码

**方法 A：网页上传（简单）**
1. 在新创建的仓库页面，点击 **uploading an existing file**
2. 将 `cloudflare-worker` 文件夹中所有文件拖入
3. 确保文件结构正确：
   ```
   src/
   └── index.js
   .github/
   └── workflows/
       └── deploy.yml
   package.json
   wrangler.toml
   README.md
   ```
4. 点击 **Commit changes**

**方法 B：命令行（推荐）**
```bash
cd cloudflare-worker
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/binance-api-proxy.git
git push -u origin main
```

---

## 步骤 2：获取 Cloudflare 凭证

### 2.1 获取 Account ID

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击左侧菜单 **Workers & Pages**
3. 在右侧概览面板中找到 **Account ID**
4. 点击复制并保存

```
Account ID 示例：a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### 2.2 创建 API Token

1. 点击右上角头像 → **My Profile**
2. 左侧菜单选择 **API Tokens**
3. 点击 **Create Token**
4. 选择 **Edit Cloudflare Workers** 模板
5. 或点击 **Create custom token**，设置权限：
   ```
   Account — Cloudflare Workers — Edit
   ```
6. 点击 **Continue to summary** → **Create Token**
7. **重要：复制 Token 并保存**（只显示一次！）

```
API Token 示例：
aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3wX5yZ7
```

---

## 步骤 3：配置 GitHub Secrets

### 3.1 进入仓库设置

1. 在 GitHub 仓库页面，点击 **Settings**
2. 左侧菜单点击 **Secrets and variables** → **Actions**

### 3.2 添加 Secrets

点击 **New repository secret**，添加两个密钥：

**Secret 1：**
```
Name: CLOUDFLARE_API_TOKEN
Secret: [粘贴你的 API Token]
```

**Secret 2：**
```
Name: CLOUDFLARE_ACCOUNT_ID
Secret: [粘贴你的 Account ID]
```

---

## 步骤 4：触发自动部署

### 4.1 推送代码触发部署

如果你使用命令行：
```bash
git push
```

推送后，GitHub Actions 会自动开始部署。

### 4.2 查看部署进度

1. 在 GitHub 仓库，点击 **Actions** 标签
2. 选择 **Deploy to Cloudflare Workers** workflow
3. 查看部署日志
4. 等待绿色 ✅ 显示部署成功

### 4.3 手动触发部署（可选）

1. 进入 **Actions** 标签
2. 选择 **Deploy to Cloudflare Workers**
3. 点击右侧 **Run workflow**
4. 点击 **Run workflow** 确认

---

## 步骤 5：获取 Worker URL

### 5.1 查看已部署的 Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 找到名为 `binance-api-proxy` 的 Worker
4. 点击进入

### 5.2 复制 Worker URL

在 Worker 详情页面，可以看到分配的 URL：

```
https://binance-api-proxy.你的子域名.workers.dev
```

或点击 **Quick actions** → **Invoke deployed URL** 查看完整 URL。

---

## 步骤 6：配置 Flutter 应用

### 6.1 编辑 `lib/main.dart`

```dart
void configureApi() {
  // 替换为你的 Cloudflare Workers URL
  BinanceApiService.setCustomBaseUrl(
    'https://binance-api-proxy.你的子域名.workers.dev/api'
  );
}
```

### 6.2 重新运行应用

```bash
flutter run
```

### 6.3 测试连接

在应用的"我"页面点击 **测试 API 连接** 按钮，应该显示：

```
✅ 基础 API：正常
✅ 多空比 API：正常
```

---

## 🎉 完成！

现在你的应用可以在没有 VPN 的情况下访问 Binance API 了！

---

## 🔧 常见问题

### Q：部署失败怎么办？

**A：检查以下几点：**

1. **Secrets 是否正确配置？**
   - GitHub 仓库 → Settings → Secrets and variables → Actions
   - 确认 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID` 都存在

2. **API Token 权限是否足够？**
   - 重新创建 Token，确保有 "Cloudflare Workers - Edit" 权限

3. **查看 Actions 日志**
   - GitHub 仓库 → Actions → 选择失败的运行
   - 查看具体错误信息

### Q：Worker 返回 404？

**A：检查 URL 格式**

正确格式：
```
https://your-worker.workers.dev/api/fapi/v1/premiumIndex
                              ↑^^
                              必须包含 /api 前缀
```

### Q：如何更新 Worker？

**A：只需推送代码**

```bash
git add .
git commit -m "Update proxy"
git push
```

GitHub Actions 会自动重新部署。

### Q：可以绑定自定义域名吗？

**A：可以！**

1. Cloudflare Dashboard → Workers → 你的 Worker
2. Settings → Triggers → Add Custom Domain
3. 输入域名（需要你的域名托管在 Cloudflare）

---

## 📊 监控使用情况

### 查看请求日志
1. Cloudflare Dashboard → Workers → 你的 Worker
2. 点击 **Logs** 标签
3. 可以查看实时请求和响应

### 查看统计数据
1. 点击 **Analytics** 标签
2. 查看请求数、成功率、响应时间等

---

## 💰 费用说明

Cloudflare Workers 免费套餐包含：

- ✅ 每天 **100,000** 个请求
- ✅ 无限带宽
- ✅ 无需信用卡

个人使用完全免费！

如果超出免费额度：
-付费套餐：$5/月（1000万次请求/月）

---

## 🆘 获取帮助

如果遇到问题：
1. 查看 [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
2. 搜索错误信息
3. 在 GitHub Issues 提问
