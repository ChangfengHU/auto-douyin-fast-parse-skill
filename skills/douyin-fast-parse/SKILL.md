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

