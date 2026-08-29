# 博客写作与发布

博客由 Eleventy 生成，文章源文件位于 `site/blog/posts/`。个人主页、旧网站和历史下载目录作为静态文件一同复制到 `_site`。

## 新建文章

在 `site/blog/posts/` 新建 Markdown 文件，文件名会成为最终 URL，例如：

```text
site/blog/posts/local-first-desktop-apps.md
→ https://arabid.top/blog/posts/local-first-desktop-apps.html
```

推荐的 Front Matter：

```yaml
---
title: 文章标题
description: 用一两句话说明文章解决的问题。
date: 2026-08-29T12:00:00+08:00
updated: 2026-08-29T12:00:00+08:00
tags:
  - architecture
  - desktop
draft: true
---
```

- `description` 用于列表、搜索、RSS 和社交元数据。
- `tags` 会自动生成标签页；显示名称在 `site/_data/site.json` 的 `tagLabels` 中维护。
- `draft: true` 的文章在本地 `npm run dev` 时可预览，正式构建不会发布。
- 发布时改为 `draft: false`。
- Markdown 二、三级标题会自动生成文章目录。
- 代码围栏会生成语法高亮和复制按钮。

## 本地预览

```bash
npm install
npm run dev
```

正式构建：

```bash
npm run build
```

生成结果位于 `_site/`。

## 自动生成的内容

- `/blog/`：文章列表、标签筛选和全文搜索
- `/blog/archive/`：按年份归档
- `/blog/tags/`：标签总览
- `/blog/tags/<tag>/`：标签文章页
- `/blog/search.json`：浏览器端全文搜索索引
- `/blog/feed.xml`：RSS
- `/sitemap.xml`：站点地图
- 文章页：目录、阅读时间、标签、相关文章、上一篇/下一篇、源码修正链接

## GitHub Pages

`.github/workflows/pages.yml` 会在推送 `main` 后执行：安装依赖、构建 `_site`、上传 Pages artifact 并部署。

仓库 Settings → Pages → Build and deployment → Source 需要选择 **GitHub Actions**。
