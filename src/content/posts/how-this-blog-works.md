---
title: 这套博客是怎么搭的
date: 2026-10-28
summary: Astro + GitHub Pages，没有服务器没有数据库，文件就是内容，Push 就是发布。
tags: ['工程', 'Astro']
draft: false
---

写完第一篇文章，顺手把这套东西的构造记一笔。以后换机器、换主题、或者想加功能，回来翻这篇就行。

## 技术选型

三个候选：

| 方案 | 特点 | 为什么没选 |
| --- | --- | --- |
| Jekyll | Pages 原生支持，主题多 | Ruby 依赖链，本地预览麻烦 |
| Hugo | 构建极快，单二进制 | 模板语法反直觉，改主题要读 Go template |
| **Astro** | 组件化、零 JS 默认、Markdown 一等公民 | —— |

Astro 的好处是构建产物是纯静态 HTML，没有运行时框架，打开速度快得没有商量余地。同时它又保留了组件能力，想加点交互（搜索、主题切换）随时能加。

## 目录结构

```
src/
  config.ts            站点信息，改这里就够了
  content/posts/       所有文章，一个 md 一个文件
  layouts/Base.astro   全站骨架：head、导航、页脚
  components/          可复用片段
  pages/               路由，文件名即路径
  styles/global.css    全部样式，一个文件
public/                静态资源，原样拷贝
```

关键约定只有一条：`src/content/posts/` 下每个 Markdown 文件就是一篇博客，frontmatter 里的 `title` / `date` / `summary` / `tags` 决定它怎么被索引。

## 写一篇新文章

文件名建议 `英文短标题.md`（会成为 URL），例如 `redis-lock.md`：

```markdown
---
title: Redis 分布式锁的三个坑
date: 2026-11-02
summary: 一句话说清这篇讲了什么，会出现在列表和 RSS 里。
tags: ['Redis', '并发']
draft: false
---

正文……
```

`draft: true` 的文章不会出现在任何页面上，写得半截可以先推上去。

## 发布流程

改完文件，`git push` 到 `master`，GitHub Actions 自动构建并部署。大约一分钟后生效。

本地预览：

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 生成到 dist/
```

## 设计上的取舍

- **暖白底 + 衬线正文**：长时间阅读比纯白刺眼度低。参考了 overreacted.io 的做法。
- **全站一个强调色**：赭红 `#a4442b`。颜色多了就散了。
- **元信息用等宽字体**：日期、标签这类"数据"和正文视觉分离，扫读时更容易跳过。
- **深色模式跟随系统**：不做好看的切换按钮，系统怎么设就怎么来。

克制不是吝啬，是把注意力留给内容。
