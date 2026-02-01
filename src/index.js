/**
 * Binance API 代理 - Cloudflare Workers
 *
 * 功能：代理 Binance Futures API 请求
 * 适用于在中国大陆等无法直接访问 Binance API 的地区
 *
 * 部署方式：
 * 1. 将此项目推送到 GitHub
 * 2. 在 Cloudflare Dashboard 中连接 GitHub 仓库
 * 3. 或使用 wrangler CLI 部署
 */

// Binance API 基础URL
const BINANCE_API = 'https://fapi.binance.com';

/**
 * 处理 CORS 预检请求
 */
function handleOptions(request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, User-Agent',
    'Access-Control-Max-Age': '86400',
  };

  return new Response(null, { headers });
}

/**
 * 主请求处理函数
 */
export default {
  async fetch(request, env, ctx) {
    // 处理 CORS 预检
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    try {
      const url = new URL(request.url);

      // 健康检查端点
      if (url.pathname === '/health' || url.pathname === '/') {
        return new Response(JSON.stringify({
          status: 'ok',
          service: 'Binance API Proxy',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          binance_api: BINANCE_API,
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // 提取要代理的路径
      // 移除 /api 前缀（如果存在）
      let proxyPath = url.pathname;
      if (proxyPath.startsWith('/api')) {
        proxyPath = proxyPath.substring(4);
      }

      // 构建目标 URL
      const targetUrl = `${BINANCE_API}${proxyPath}${url.search}`;

      console.log(`[Proxy] ${request.method} ${targetUrl}`);

      // 转发请求到 Binance
      const headers = new Headers();
      headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      headers.set('Accept', 'application/json');

      // 复制原始请求的相关头部
      if (request.headers.has('Authorization')) {
        headers.set('Authorization', request.headers.get('Authorization'));
      }

      const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: headers,
        body: request.method !== 'GET' ? request.body : null,
      });

      const response = await fetch(proxyRequest);

      // 处理响应
      const responseBody = await response.text();

      // 返回响应，添加 CORS 头
      return new Response(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60', // 缓存 60 秒
        },
      });

    } catch (error) {
      console.error('[Error]', error);

      return new Response(JSON.stringify({
        error: '代理请求失败',
        message: error.message,
        timestamp: new Date().toISOString(),
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
