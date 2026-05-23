# douyin-fast-parse

抖音视频快速解析，有水印，约3秒，纯 HTTP 无需 Cookie。输入抖音分享链接，返回视频 CDN 地址、标题、videoId。

---

## 1. 直接执行 CLI

不需要安装 skill，一条命令直接调用：

```bash
bash <(curl -fsSL https://skill.vyibc.com/douyin-fast-parse.sh) 
```

---

## 2. 安装为 Claude Code Skill

```bash
bash <(curl -fsSL 'https://skill.vyibc.com/install-douyin-fast-parse.sh')
```

安装后 skill 会写入：

- `~/.claude/skills/douyin-fast-parse/SKILL.md`
- `~/.claude/skills/douyin-fast-parse/scripts/run.sh`

### 安装完成后如何使用

对 Claude 说以下任意一句，skill 会自动触发：

- `解析抖音`
- `抖音去水印`
- `帮我解析这个抖音链接`
- `douyin-fast-parse`

---

## 3. 支持的调用模式

| 模式 | 说明 |
|------|------|
| `parse` | 解析抖音分享链接，返回有水印视频地址 |

---

## 4. 调用示例

### 解析抖音视频

```bash
bash <(curl -fsSL https://skill.vyibc.com/douyin-fast-parse.sh) --mode=parse --url='https://v.douyin.com/xxx/'
```

---

## 5. 发布

本地发布（需在仓库目录下）：

```bash
./scripts/publish-skill.sh
```

从 GitHub `main` 远程发布：

```bash
bash <(curl -fsSL https://skill.vyibc.com/publish-douyin-fast-parse.sh)
```

---

## 6. 仓库结构

```text
README.md
scripts/
  douyin-fast-parse.sh                    # CLI 直接执行入口
  publish-douyin-fast-parse.sh             # 远程一键发布
  publish-skill.sh             # 本地发布
  upload-file.sh               # R2 上传工具
skills/
  douyin-fast-parse/
    SKILL.md                   # Claude Code skill 定义
    scripts/run.sh             # 唯一核心执行逻辑
```

`scripts/douyin-fast-parse.sh` 和安装后的 `skills/douyin-fast-parse/scripts/run.sh` 来自同一份脚本。
