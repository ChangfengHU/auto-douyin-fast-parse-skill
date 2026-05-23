---
name: douyin-fast-parse
description: "当用户说"解析抖音"、"抖音去水印"、"帮我解析这个抖音链接"、"douyin-fast-parse" 时自动触发。抖音视频快速解析，有水印，约3秒，纯 HTTP 无需 Cookie。输入抖音分享链接，返回视频 CDN 地址、标题、videoId。"
---

# Douyin Fast Parse

## 作用

抖音视频快速解析，有水印，约3秒，纯 HTTP 无需 Cookie。输入抖音分享链接，返回视频 CDN 地址、标题、videoId。

## 执行

```bash
~/.claude/skills/douyin-fast-parse/scripts/run.sh --mode=parse --url="<url>"
```

## 参数

| 参数 | 必填 | 说明 |
|------|------|------|
| `--mode` | 是 | 调用模式，可选值：`parse` |
| `--url` | 否 | 解析抖音分享链接，返回有水印视频地址 |

## 直接执行

```bash
bash <(curl -fsSL https://skill.vyibc.com/douyin-fast-parse.sh) --mode=parse --url='https://v.douyin.com/xxx/'
```

## 返回结果（页面展示字段）

成功后返回 JSON，以下是页面上会展示给用户的字段：

| 字段 | 说明 |
|------|------|
| `title` | 视频标题，展示在卡片顶部 |
| `ossUrl` | **优先使用**，视频永久存储地址（Supabase），用于播放和下载按钮 |
| `videoUrl` | 临时 CDN 地址（有水印），`ossUrl` 为空时降级使用，可能过期 |
| `videoId` | 视频唯一 ID，用于去重和跳转 |
| `watermark` | 是否有水印，`true` = 有水印版，向用户说明这是带水印的版本 |

> 注意：`ossUrl` 为空表示上传存储失败，此时只能使用 `videoUrl`（临时链接，有效期较短）。向用户展示时优先用 `ossUrl`，没有时用 `videoUrl` 并提示链接可能失效。

