# Binance API 代理 - Cloudflare Workers

通过 Cloudflare Workers 部署 Binance API 代理，解决中国大陆访问限制问题。

## 🚀 快速开始

### 方式 1: 通过 GitHub 部署（推荐）

#### 步骤 1: 创建 GitHub 仓库

1. 登录 GitHub，点击 "New repository"
2. 仓库名称填写：`binance-api-proxy`（或其他名称）
3. 选择 "Public" 或 "Private"
4. **不要**勾选 "Add a README file"（我们会创建自己的）
5. 点击 "Create repository"

#### 步骤 2: 上传代码

**方法 A - 通过 GitHub 网页端：**

1. 创建仓库后，点击 "uploading an existing file"
2. 将 `cloudflare-worker` 文件夹中的所有文件拖拽上传
3. 文件结构应保持：
   ```
   ├── src/
   │   └── index.js
   ├── .github/
   │   └── workflows/
   │       └── deploy.yml
   ├── package.json
   ├── wrangler.toml
   └── README.md
   ```
4. 点击 "Commit changes"

**方法 B - 通过 Git 命令行：**

```bash
# 进入 cloudflare-worker 目录
cd cloudflare-worker

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Binance API proxy"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

#### 步骤 3: 获取 Cloudflare 凭证

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 获取 **Account ID**：
   - 在右侧边栏找到 "Workers & Pages"
   - 点击进入后，在右侧可以看到 "Account ID"
   - 复制保存

3. 创建 **API Token**：
   - 点击右上角头像 → "My Profile"
   - 选择左侧 "API Tokens"
   - 点击 "Create Token"
   - 选择 "Edit Cloudflare Workers" 模板（或使用自定义）
   - 权限设置：
     - Account - Cloudflare Workers - Edit
     - Zone - Zone - Read (可选)
   - 点击 "Continue to summary" → "Create Token"
   - **重要：复制并保存这个 Token**（只显示一次！）

#### 步骤 4: 配置 GitHub Secrets

1. 打开你创建的 GitHub 仓库
2. 点击 "Settings" → "Secrets and variables" → "Actions"
3. 点击 "New repository secret"，添加以下两个密钥：

   | Name | Secret |
   |------|--------|
   | `CLOUDFLARE_API_TOKEN` | 你的 API Token |
   | `CLOUDFLARE_ACCOUNT_ID` | 你的 Account ID |

#### 步骤 5: 配置 Wrangler（首次需要）

1. 在你的 GitHub 仓库中，点击 "Settings"
2. 找到 "Environments" 标签
3. 点击 "New environment"
4. 创建名为 `production` 的环境（可选）

或者使用 Wrangler CLI（本地）：

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
cd cloudflare-worker
npm run deploy
```

#### 步骤 6: 触发部署

推送代码到 main 分支后会自动触发部署：

```bash
git push
```

或在 GitHub 页面：
1. 进入 "Actions" 标签
2. 选择 "Deploy to Cloudflare Workers"
3. 点击 "Run workflow" → "Run workflow"

#### 步骤 7: 获取 Worker URL

部署成功后：
1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 "Workers & Pages"
3. 找到你的 Worker（名称：binance-api-proxy）
4. 点击进入，可以看到分配的 URL：
   ```
   https://binance-api-proxy.YOUR_SUBDOMAIN.workers.dev
   ```

---

### 方式 2: 直接通过 Cloudflare Dashboard 部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 "Workers & Pages" → "Create application"
3. 选择 "Create Worker"
4. Worker 名称填写：`binance-api-proxy`
5. 点击 "Deploy"
6. 点击 "Edit code"
7. 将 `src/index.js` 的内容粘贴进去
8. 点击 "Save and Deploy"

---

## 📱 Flutter 应用配置

部署成功后，在 Flutter 应用中配置代理 URL：

### 编辑 `lib/main.dart`:

```dart
void configureApi() {
  // 替换为你的 Cloudflare Workers URL
  BinanceApiService.setCustomBaseUrl('https://binance-api-proxy.YOUR_SUBDOMAIN.workers.dev/api');
}
```

### 使用自定义域名（可选）

1. 在 Cloudflare Dashboard 中，进入你的 Worker
2. 点击 "Settings" → "Triggers"
3. 点击 "Add Custom Domain"
4. 输入你的域名（如：`api.yourdomain.com`）
5. 保存后配置：
   ```dart
   BinanceApiService.setCustomBaseUrl('https://api.yourdomain.com/api');
   ```

---

## 🧪 测试代理

部署后测试是否正常工作：

```bash
# 测试健康检查
curl https://your-worker.workers.dev/health

# 测试代理功能
curl https://your-worker.workers.dev/api/fapi/v1/premiumIndex?symbol=BTCUSDT
```

或在 Flutter 应用的"我"页面点击"测试 API 连接"按钮。

---

## 📊 监控和日志

### 查看日志
1. Cloudflare Dashboard → Workers & Pages
2. 选择你的 Worker
3. 点击 "Logs" 标签
4. 可以查看实时日志和请求统计

### 分析
- 点击 "Analytics" 查看请求数、成功率、响应时间等

---

## 💰 费用

Cloudflare Workers 免费套餐：
- ✅ 每天 100,000 个请求
- ✅ 无限带宽
- ✅ 无需信用卡

个人使用完全免费！

---

## 🔄 更新和重新部署

### 更新代码
```bash
# 修改代码后
git add .
git commit -m "Update proxy"
git push
```

GitHub Actions 会自动重新部署。

### 手动重新部署
在 GitHub 仓库的 "Actions" 页面：
1. 选择 "Deploy to Cloudflare Workers"
2. 点击 "Run workflow"

---

## 🛡️ 安全建议

1. **添加速率限制**（可选）：
   ```javascript
   // 在 index.js 中添加
   const rateLimit = new Map();

   async function checkRateLimit(ip) {
     const limit = 100; // 每分钟100次请求
     const key = ip;
     const now = Date.now();
     const requests = rateLimit.get(key) || [];

     // 清理过期请求
     const valid = requests.filter(t => now - t < 60000);

     if (valid.length >= limit) {
       throw new Error('Rate limit exceeded');
     }

     valid.push(now);
     rateLimit.set(key, valid);
   }
   ```

2. **使用环境变量**（敏感信息）：
   ```toml
   # wrangler.toml
   [vars]
   API_KEY = "your-secret-key"
   ```

3. **添加请求验证**：
   ```javascript
   // 验证请求来源
   const referer = request.headers.get('Referer');
   if (!referer || !referer.includes('yourdomain.com')) {
     return new Response('Forbidden', { status: 403 });
   }
   ```

---

## ❓ 常见问题

### Q: 部署失败怎么办？
A:
1. 检查 GitHub Secrets 是否正确配置
2. 查看 Actions 日志获取详细错误信息
3. 确认 Cloudflare 账户有足够权限

### Q: Worker 返回 403/404？
A:
1. 检查 Binance API 是否可访问
2. 查看Worker日志确认请求是否成功转发
3. 确认路径格式正确（需要 `/api` 前缀）

### Q: 如何绑定自定义域名？
A:
1. 在 Cloudflare Dashboard 选择你的 Worker
2. Settings → Triggers → Add Custom Domain
3. 输入域名并保存

---

## 📝 许可证

MIT License
