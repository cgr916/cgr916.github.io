import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 已发布文章，置顶优先，其次按日期倒序 */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts', ({ data }) => !data.draft);
  return all.sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) return b.data.pinned - a.data.pinned;
    return b.data.date.getTime() - a.data.date.getTime();
  });
}

/** 纯时间倒序，用于上一篇 / 下一篇 */
export async function getChronoPosts(): Promise<Post[]> {
  const all = await getCollection('posts', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * 中文按字数（350 字/分），英文按词数（220 词/分），混合按占比加权。
 * 宁可粗一点，也不要给读者一个假精确的数字。
 */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const text = body.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ');
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const words = (text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
  return Math.max(1, Math.round(cjk / 350 + words / 220));
}

/** 全站标签及计数，按数量倒序 */
export async function getTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) map.set(t, (map.get(t) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh'));
}

export function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
