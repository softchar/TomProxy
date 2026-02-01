# 📋 凭证记录

## Cloudflare 账户信息

| 项目 | 内容 |
|------|------|
| Email: | __________________________ |
| Account ID: | __________________________ |
| API Token: | __________________________ |

**⚠️ 请妥善保管，不要分享给他人！**

---

## GitHub 仓库信息

| 项目 | 内容 |
|------|------|
| 仓库 URL: | __________________________ |
| 仓库名称: | __________________________ |
| 用户名: | __________________________ |

---

## 部署信息

| 项目 | 内容 |
|------|------|
| Worker URL: | __________________________ |
| 自定义域名: | __________________________ |
| 部署日期: | __________________________ |

---

## 快速链接

- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [Cloudflare Workers](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
- [GitHub 仓库](https://github.com/)
- [API Tokens](https://dash.cloudflare.com/profile/api-tokens)

---

## Flutter 配置

```dart
void configureApi() {
  BinanceApiService.setCustomBaseUrl('你的 Worker URL/api');
}
```

---

## 测试命令

```bash
# 健康检查
curl https://你的 Worker URL/health

# 测试代理
curl https://你的 Worker URL/api/fapi/v1/premiumIndex?symbol=BTCUSDT
```

---

## 备份说明

建议将此文件保存在安全的地方，并：
1. 不要提交到公共 Git 仓库
2. 定期更新凭证信息
3. 使用密码管理器保存敏感信息
