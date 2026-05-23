const UA_MOBILE = 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';

export default {
  async fetch(request, env) {
    if (request.method === 'GET') {
      return new Response('douyin-fast-parse worker ok', { status: 200 });
    }
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let body = {};
    try { body = await request.json(); } catch (_) {}

    const input = (body.url || '').trim();
    if (!input) {
      return Response.json({ error: '请提供抖音链接' }, { status: 400 });
    }

    // Step 1: 提取短链
    const urlMatch = input.match(/https?:\/\/v\.douyin\.com\/[A-Za-z0-9_\-]+\/?/);
    if (!urlMatch) {
      return Response.json({ error: '未找到有效的抖音分享链接' }, { status: 400 });
    }
    const shortUrl = urlMatch[0];

    // Step 1: 短链 → iesdouyin（不跟重定向，取 Location）
    let step1;
    try {
      step1 = await fetch(shortUrl, {
        redirect: 'manual',
        headers: { 'User-Agent': UA_MOBILE },
      });
    } catch (e) {
      return Response.json({ error: '短链请求失败: ' + e.message }, { status: 500 });
    }
    const iesdouyinUrl = step1.headers.get('location');
    if (!iesdouyinUrl) {
      return Response.json({ error: '短链解析失败，未获取到重定向地址' }, { status: 500 });
    }

    // 从 iesdouyin URL 提取数字 videoId
    const videoIdMatch = iesdouyinUrl.match(/\/video\/(\d+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : String(Date.now());

    // Step 2: 获取 iesdouyin 页面 HTML
    let html;
    try {
      const step2 = await fetch(iesdouyinUrl, {
        headers: { 'User-Agent': UA_MOBILE, 'Referer': 'https://www.douyin.com/' },
      });
      html = await step2.text();
    } catch (e) {
      return Response.json({ error: '页面获取失败: ' + e.message }, { status: 500 });
    }

    // 从 HTML 提取内部 video_id
    const vidMatch = html.match(/video_id=(v[a-z0-9]+)/);
    if (!vidMatch) {
      return Response.json({ error: '页面中未找到视频地址，视频可能已删除' }, { status: 500 });
    }
    const internalVideoId = vidMatch[1];

    // 从 HTML 提取标题
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1].replace(/ - 抖音$/, '').trim() : '';

    // Step 3: playwm → CDN 视频地址（不跟重定向，取 Location）
    const playwmUrl = `https://aweme.snssdk.com/aweme/v1/playwm/?video_id=${internalVideoId}&ratio=720p&line=0`;
    let step3;
    try {
      step3 = await fetch(playwmUrl, {
        redirect: 'manual',
        headers: { 'User-Agent': UA_MOBILE, 'Referer': 'https://www.douyin.com/' },
      });
    } catch (e) {
      return Response.json({ error: 'playwm 请求失败: ' + e.message }, { status: 500 });
    }
    const cdnUrl = step3.headers.get('location');
    if (!cdnUrl) {
      return Response.json({ error: '无法获取视频 CDN 地址' }, { status: 500 });
    }

    return Response.json({
      success: true,
      platform: 'douyin',
      videoId,
      title,
      videoUrl: cdnUrl,
      watermark: true,
    });
  },
};
