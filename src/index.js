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
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
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

      // 调试端点 - 显示请求将如何被转发
      if (url.pathname === '/debug') {
        let proxyPath = url.pathname;
        if (proxyPath.startsWith('/api')) {
          proxyPath = proxyPath.substring(4);
        }
        const targetUrl = `${BINANCE_API}${proxyPath}${url.search}`;

        return new Response(JSON.stringify({
          original_url: request.url,
          pathname: url.pathname,
          search: url.search,
          proxy_path: proxyPath,
          target_url: targetUrl,
          method: request.method,
          headers: Object.fromEntries(request.headers.entries()),
        }, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // 提取要代理的路径
      // 移除 /api 或 /binance 前缀（如果存在）
      let proxyPath = url.pathname;
      if (proxyPath.startsWith('/api')) {
        proxyPath = proxyPath.substring(4);
      } else if (proxyPath.startsWith('/binance')) {
        proxyPath = proxyPath.substring(8);
      }

      // 构建目标 URL
      const targetUrl = `${BINANCE_API}${proxyPath}${url.search}`;

      console.log(`[Proxy] ${request.method} ${targetUrl}`);

      // 转发请求到 Binance
      const headers = new Headers();

      // 设置更完整的请求头，模拟真实浏览器请求
      headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      headers.set('Accept', 'application/json, text/plain, */*');
      headers.set('Accept-Language', 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7');
      headers.set('Accept-Encoding', 'gzip, deflate, br');
      headers.set('Origin', 'https://www.binance.com');
      headers.set('Referer', 'https://www.binance.com/');
      headers.set('Sec-Fetch-Dest', 'empty');
      headers.set('Sec-Fetch-Mode', 'cors');
      headers.set('Sec-Fetch-Site', 'same-site');

      // 复制原始请求的相关头部
      if (request.headers.has('Authorization')) {
        headers.set('Authorization', request.headers.get('Authorization'));
      }
      if (request.headers.has('Content-Type')) {
        headers.set('Content-Type', request.headers.get('Content-Type'));
      }
      if (request.headers.has('X-MBX-APIKEY')) {
        headers.set('X-MBX-APIKEY', request.headers.get('X-MBX-APIKEY'));
      }

      const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: headers,
        body: request.method !== 'GET' ? request.body : null,
        redirect: 'follow',
      });

      const response = await fetch(proxyRequest);

      // 详细日志：记录响应状态
      console.log(`[Response] Status: ${response.status}, Headers:`, Object.fromEntries(response.headers.entries()));

      // 处理响应 - 保留原始响应头
      const responseHeaders = new Headers();

      // 复制所有响应头（除了某些会被 Cloudflare Workers 覆盖的头）
      for (const [key, value] of response.headers.entries()) {
        if (key.toLowerCase() !== 'content-encoding' &&
            key.toLowerCase() !== 'transfer-encoding') {
          responseHeaders.set(key, value);
        }
      }

      // 添加 CORS 头
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Credentials', 'true');

      // 确保内容类型正确
      if (!responseHeaders.has('Content-Type')) {
        responseHeaders.set('Content-Type', 'application/json');
      }

      // 返回响应
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
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
