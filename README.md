# chan_gr 的博客

Astro 5 + GitHub Pages。没有服务器，没有数据库，Markdown 就是内容。

- 源码：`master` 分支
- 站点产物：`gh-pages` 分支（Pages 从这里托管）
- 线上地址：<https://cgr916.github.io>

## 本地跑起来

```bash
npm install
npm run dev        # http://localhost:4321
```

## 写文章

```bash
npm run new "文章标题"
```

会在 `src/content/posts/` 下生成带好 frontmatter 的文件，默认 `draft: true`（不会发布）。

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
| `date` | 日期，`YYYY-MM-DD` |
| `summary` | 摘要，可留空 |
| `tags` | 标签数组，自动生成 `/tags/标签名/` |
| `pinned` | 置顶权重，越大越靠前，默认 0 |
| `draft` | `true` 时不发布 |

文件名即 URL：`redis-lock.md` → `/posts/redis-lock/`。**发布后别改文件名**，否则旧链接会 404。

## 发布

```bash
GH_TOKEN=你的token ./scripts/deploy.sh
```

做三件事：`npm run build` → 产物推到 `gh-pages` 分支 → Pages 自动重新发布。约一分钟后生效。

不想用脚本的话，手动也行：

```bash
npm run build
cd dist && git init && git checkout -b gh-pages && git add -A \
  && git commit -m deploy && git push -f origin gh-pages
```

> **为什么是 gh-pages 而不是 GitHub Actions？**
> 当前 token 没有 `workflow` 权限，无法写入 `.github/workflows/`。走分支发布不需要这个权限。
> 如果之后想换成 Actions 自动构建，把 `scripts/deploy-workflow.yml` 放回 `.github/workflows/deploy.yml`，
> 在 Settings → Pages 把 Source 改成 **GitHub Actions** 即可。

## 改哪里

| 想改什么 | 改哪个文件 |
| --- | --- |
| 站点名、简介、GitHub 链接、首页自我介绍 | `src/config.ts` |
| 颜色、字体、行宽、间距 | `src/styles/global.css` 顶部的 CSS 变量 |
| 导航栏和页脚 | `src/layouts/Base.astro` |
| 域名 | `astro.config.mjs` 的 `site` + `public/CNAME` |

## 自定义域名（可选）

1. 新建 `public/CNAME`，内容写域名，如 `blog.example.com`
2. DNS 加 CNAME 记录指向 `cgr916.github.io`
3. 改 `astro.config.mjs` 里的 `site` 为 `https://blog.example.com`
4. 仓库 Settings → Pages → Custom domain 填入域名，勾选 Enforce HTTPS

## 加评论（可选）

推荐 [giscus](https://giscus.app)，基于 GitHub Discussions，无需后端。拿到 `<script>` 片段后粘到 `src/pages/posts/[id].astro` 的 `</footer>` 之后。

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
scripts/new-post.mjs     新建文章
scripts/deploy.sh        一键发布
scripts/deploy-workflow.yml  可选的 Actions 工作流（备用）
```

## 设计说明

参考 Dan Abramov 的 overreacted.io 的克制与 Julia Evans 的 jvns.ca 的温度：
暖白纸底、正文衬线、元信息等宽、全站单一赭红强调色、深色模式跟随系统。没有渐变，没有阴影，没有动画。
