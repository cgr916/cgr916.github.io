#!/usr/bin/env node
/**
 * 新建文章：npm run new "文章标题"
 * 自动生成 slug、日期和 frontmatter，然后打开编辑器。
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('用法: npm run new "文章标题"');
  process.exit(1);
}

// 中文标题转拼音不现实，直接用日期 + 序号兜底，用户可自行改名
const now = new Date();
const ymd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
const ascii = title
  .toLowerCase()
  .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
  .replace(/^-|-$/g, '');
const slug = /[a-z0-9]/.test(ascii) ? ascii : `post-${Date.now().toString(36)}`;

const dir = join(process.cwd(), 'src', 'content', 'posts');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

let file = join(dir, `${slug}.md`);
let i = 2;
while (existsSync(file)) file = join(dir, `${slug}-${i++}.md`);

const body = `---
title: ${title}
date: ${ymd}
summary: ''
tags: []
draft: true
---

在这里开始写。

`;

writeFileSync(file, body, 'utf8');
console.log(`已创建: ${file}`);

const editor = process.env.EDITOR || 'vi';
try {
  execSync(`${editor} "${file}"`, { stdio: 'inherit' });
} catch {
  // 无交互环境时忽略
}
