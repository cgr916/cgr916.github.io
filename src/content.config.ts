import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // 一句话摘要，会出现在首页列表、RSS 与 <meta description>
    summary: z.string().default(''),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // 置顶：数字越大越靠前
    pinned: z.number().default(0),
  }),
});

export const collections = { posts };
