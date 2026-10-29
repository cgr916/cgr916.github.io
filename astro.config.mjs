import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 站点配置：换成自己的域名后记得同步 public/CNAME
export default defineConfig({
  site: 'https://cgr916.github.io',

  // 如果部署在子路径（例如仓库名是 blog，网址是 xxx.github.io/blog），
  // 取消下面这一行的注释并改成 '/blog'。
  // base: '/blog',

  integrations: [sitemap()],

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      wrap: true,
    },
  },
});
