# ArabidopsisDev.github.io

Arabidopsis 的个人主页与 Markdown 博客，部署于 GitHub Pages，并通过 `arabid.top` 访问。

## 站点结构

- `index.html`：全新个人主页
- `site/blog/`：Eleventy 博客模板与 Markdown 文章源文件
- `_site/`：本地构建产物，不提交
- `history.html`：2024 年前的历史主页
- 原有 `Apps/`、`Article/`、`Docs/`、`Services/` 等目录：历史内容，继续保留

博客使用 Eleventy 构建，GitHub Actions 会在推送 `main` 后自动部署。所有站内资源使用相对路径，以兼容自定义域名、GitHub 用户页和本地预览。

写作、草稿、标签与发布说明见 [`BLOGGING.md`](./BLOGGING.md)。
