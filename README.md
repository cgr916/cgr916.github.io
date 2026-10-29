# chan_gr 的博客

Astro 5 + GitHub Pages。没有服务器，没有数据库，Markdown 就是内容，`git push` 就是发布。

## 本地跑起来

```bash
npm install
npm run dev        # http://localhost:4321
```

## 写文章

```bash
npm run new "文章标题"
```

会在 `src/content/posts/` 下生成一个带好 frontmatter 的文件，默认 `draft: true`（不会被发布）。

或者手动新建 `src/content/posts/english-slug.md`：

```markdown
---
title: 文章标题
date: 2026-11-02
summary: 一句话摘要，出现在列表页、RSS 和 meta description 里。
tags: ['标签A', '标签B']
pinned: 0
draft: false
---

正文从这里开始。
```

| 字段 | 说明 |
| --- | --- |
| `title` | 标题 |
| `date` | 日期，格式 `YYYY-MM-DD` |
| `summary` | 摘要，可留空 |
| `tags` | 标签数组，自动生成 `/tags/标签名/` 页面 |
| `pinned` | 置顶权重，数字越大越靠前，默认 0 |
| `draft` | `true` 时不发布 |

文件名会成为 URL：`redis-lock.md` → `/posts/redis-lock/`。**发布后别改文件名**，否则链接会失效。

## 部署

推到 `master` 分支，GitHub Actions 自动构建并发布（`.github/workflows/deploy.yml`）。

首次部署需要在仓库里做两件事：

1. **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**
2. **Settings → Actions → General → Workflow permissions** 选择 **Read and write permissions**

大约一分钟后访问 `https://cgr916.github.io`。

## 改哪里

| 想改什么 | 改哪个文件 |
| --- | --- |
| 站点名、简介、GitHub 链接、首页自我介绍 | `src/config.ts` |
| 颜色、字体、行宽、间距 | `src/styles/global.css` 顶部的 CSS 变量 |
| 导航栏和页脚 | `src/layouts/Base.astro` |
| 域名 | `astro.config.mjs` 的 `site`，并新建 `public/CNAME` |

## 自定义域名（可选）

1. 新建 `public/CNAME`，内容写你的域名，例如 `blog.example.com`
2. DNS 加一条 CNAME 记录指向 `cgr916.github.io`
3. 修改 `astro.config.mjs` 里的 `site` 为 `https://blog.example.com`
4. 仓库 Settings → Pages → Custom domain 填入域名，勾选 Enforce HTTPS

## 加评论（可选）

推荐 [giscus](https://giscus.app)，基于 GitHub Discussions，无需后端：

1. 在 giscus.app 按提示授权仓库并拿到 `<script>` 片段
2. 把片段粘到 `src/pages/posts/[id].astro` 的 `<footer class="post-footer">` 之后

## 目录结构

```
src/
  config.ts              站点信息
  content.config.ts      文章字段校验
  content/posts/         所有文章
  layouts/Base.astro     全站骨架
  components/PostList.astro
  pages/
    index.astro          首页列表
    archive.astro        按年份归档
    about.astro          关于
    posts/[id].astro     文章页
    tags/[tag].astro     标签页
    rss.xml.js           RSS
    404.astro
  styles/global.css      全部样式
public/                  静态资源，原样拷贝
scripts/new-post.mjs     新建文章脚本
```

## 设计说明

参考了 Dan Abramov 的 overreacted.io 的克制与 Julia Evans 的 jvns.ca 的温度：
暖白纸底、正文衬线、元信息等宽、全站单一赭红强调色、深色模式跟随系统。没有渐变，没有阴影，没有动画。
