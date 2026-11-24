# chan_gr 的博客

Astro 5 + GitHub Pages。没有服务器，没有数据库，Markdown 就是内容。

- 源码：`master` 分支
- 站点产物：`gh-pages` 分支（Pages 从这里托管）
- 线上地址：<https://cgr916.github.io>

## 页面结构

| 页面 | 说明 |
| --- | --- |
| `/` | 首页：标签索引 + 文章列表（置顶优先） |
| `/archive/` | 归档：「按主题」标签云 +「按时间」时间线双视图 |
| `/posts/<slug>/` | 文章页：导语、目录（TOC）、阅读时长、上一篇/下一篇 |
| `/tags/<标签>/` | 单个标签下的全部文章 |
| `/about/` | 关于 |
| `/rss.xml` | RSS 订阅 |

设计参考了三个人：**Simon Willison** 的标签导航（首页直接给标签云，标签是导航不是装饰）、
**Julia Evans** 的长文目录（只收 h2/h3，少于两条不显示）、**Dan Abramov** 的极简列表与斜体导语。
配色是暖白纸底 + 衬线正文 + 等宽元信息 + 单一赭红强调，无渐变无阴影，深色模式跟随系统。

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
summary: 一句话摘要，出现在列表页、文章页导语、RSS 和 meta description 里。
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
| `summary` | 摘要，会渲染成文章页的斜体导语；可留空 |
| `tags` | 标签数组，自动生成 `/tags/标签名/`，并按数量进首页标签云 |
| `pinned` | 置顶权重，越大越靠前，默认 0 |
| `draft` | `true` 时不发布 |

文件名即 URL：`redis-lock.md` → `/posts/redis-lock/`。**发布后别改文件名**，否则旧链接会 404。

## 发布

```bash
GH_TOKEN=你的token ./scripts/deploy.sh
```

做三件事：`npm run build` → 产物推到 `gh-pages` 分支 → Pages 自动重新发布。约一分钟后生效。

手动发布（不想跑脚本时）：

```bash
npm run build
cd dist && git init && git checkout -b gh-pages && git add -A \
  && git commit -m deploy && git push -f origin gh-pages
```

> **注意：GitHub 账号必须先验证邮箱。**
> 邮箱未验证时 `git push` 会返回 403，Pages 构建也会以 `startup_failure` 失败（耗时 0 秒）。
> 去 [github.com/settings/emails](https://github.com/settings/emails) 验证一次即可，之后一切正常。

> **为什么是 gh-pages 分支，而不是 GitHub Actions 自动构建？**
> 当前 token 没有 `workflow` 权限（无法写入 `.github/workflows/`），走分支发布不需要这个权限，
> 顺带也省掉了 Actions 的配额与排队。想换成 Actions 的话，把 `scripts/deploy-workflow.yml`
> 复制回 `.github/workflows/deploy.yml`，在 Settings → Pages 把 Source 改成 **GitHub Actions** 即可。

## 目录结构速查

```
src/
  config.ts              站点信息（标题、简介、首页自我介绍）
  content.config.ts      文章 frontmatter 校验
  content/posts/         所有文章，一个 md 一篇
  lib/posts.ts           取数、排序、标签统计、阅读时长
  components/Toc.astro   文章目录（仅 h2/h3）
  components/PostList.astro
  layouts/Base.astro     全站骨架
  pages/
    index.astro          首页：标签云 + 列表
    archive.astro        归档：按主题 + 按时间
    posts/[id].astro     文章页：导语 + TOC + 上下篇
    tags/[tag].astro     标签页
    rss.xml.js           RSS
    404.astro
  styles/global.css      全部样式（顶部是 CSS 变量）
```

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
