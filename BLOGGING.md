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
- 公式使用 KaTeX 在构建时渲染，阅读页不需要额外脚本。

## 公式

行内公式用单个 `$` 包裹，独立公式用 `$$` 包裹（KaTeX 服务端渲染，输出 HTML + MathML）：

```markdown
质能方程 $E = mc^2$ 描述质量与能量的关系。

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$
```

- 也支持 `\begin{aligned} … \end{aligned}` 这类独立块，以及 ```` ```math ```` 围栏。
- 货币写法如 `100$`、`200$` 不会被误判为公式（`$` 两侧需要符合公式定界规则）。
- 公式语法错误不会中断构建：出错处会渲染成红色的 `katex-error` 片段，同时保留原始公式文本。
- KaTeX 样式表在文章页按需加载：`assets/vendor/katex/katex.min.css`（由 `eleventy.config.js` 从 `node_modules/katex/dist` 复制）。
- 需要 KaTeX 不支持的宏时，在 `eleventy.config.js` 的 markdown-it KaTeX 选项里补充 `macros`。

支持的语法以 [KaTeX 支持列表](https://katex.org/docs/supported.html) 为准。

## 题目

`> 引用` 适合引文，不适合题目：没有题干与选项的区分，公式也被压进灰色引用块里。题目请用 `::: question … :::` 块（或等价的 `<question> … </question>` 标签），由 `site/_lib/questionBlock.js` 在构建时处理：

```markdown
::: question 3
下列说法正确的是：

- A. 溶液凝固点下降只与溶质粒子数有关
- B. 稀溶液的凝固点低于纯溶剂，且 $\Delta T_f = K_f b_B$
- C. 沸点升高只与溶质种类有关
- D. 以上都不对
:::
```

渲染成一张题卡：标题行显示题型与题号，下面依次是题干和 A–D 选项，选项字母自动对齐。

- 有选项 → 选择题；没有选项 → 解答题（只有题干）。

  ```markdown
  ::: question
  计算 $w(\mathrm{NaCl})=10\%$ 的氯化钠水溶液中溶质的摩尔分数。

  $$x(\mathrm{NaCl})=\frac{n(\mathrm{NaCl})}{n(\mathrm{NaCl})+n(\mathrm{H_2O})}$$
  :::
  ```

- 块内就是普通 Markdown：段落、列表、代码、`$…$` 与 `$$…$$` 全部照常渲染，公式和正文用同一套 KaTeX 管线。
- **前缀自定义、编号自动**：`::: question 例题` 依次渲染成「例题 1」「例题 2」……；换成 `题目` 就是另一条独立的序列（「题目 1」「题目 2」）。编号按前缀分别计数，每篇文章各自从 1 开始，所以前面的例题和后面的练习题可以分开编号。

  ```markdown
  ::: question 例题
  计算 $w(\mathrm{NaCl})=10\%$ 的氯化钠水溶液中溶质的摩尔分数。
  :::

  ::: question 题目
  下列说法正确的是：

  - A. 溶液凝固点下降只与溶质粒子数有关
  - B. 稀溶液的凝固点低于纯溶剂
  :::
  ```

  上面两块分别渲染成「例题 1」和「题目 1」；再加例题会是「例题 2」，加题目是「题目 2」。前缀随写随用，不需要另外声明计数器。

- 属性写在 `::: question` 后面，`key=value` 或位置写法都可以，中文键同样有效：

  | 写法 | 作用 |
  | --- | --- |
  | `例题` / `label=例题` / `前缀=题目` / `prefix=练习` | 前缀（徽标）文字；只写前缀时自动编号 |
  | `number=3` / `3` | 手写题号：默认徽标显示「第 3 题」，自定义前缀显示「例题 3」，并把该前缀的计数器推进到 3，后面的自动编号接着排 |
  | `number=none` | 不显示题号，也不占用序号 |
  | `type=choice` / `选择题` | 强制选择题（尾部列表按选项解析） |
  | `type=answer` / `解答题` | 强制解答题（尾部列表留在题干里） |
  | `answer=B` | 在标题行右侧标出答案 |

  ```markdown
  ::: question 例题 类型=解答题
  某碳氢化合物碳原子和氢原子数相等，在 $100^\circ\mathrm{C}$、$101.325\text{kPa}$ 下测得 $\rho = 2.55\text{g·L}^{-1}$，确定其分子式。
  :::
  ```

- 选项可以写成 `- A. …`、`A. …`、`（A）…`，也可以把 A–D 写在同一行，构建时会自动拆成四列。
- 只有紧贴块尾的连续列表才被当作选项；正文中段的列表仍属于题干。显式写 `type=answer` 可完全关闭选项解析。
- 题卡正文固定使用 宋体 + Times New Roman（西文 Times New Roman，汉字宋体），与正文的无衬线字体区分开；样式在 `assets/css/site.css` 的 `.question-block` 一段。
- 插件是 markdown-it 的块级规则，不修改源码文本，所以代码围栏里的 `::: question` 原样显示；未闭合时退回普通段落，不会吞掉后文。
- 改动渲染逻辑后运行 `node tools/check-question-blocks.mjs` 校验（选择题、解答题、属性、两种写法、公式、代码围栏、编辑器行号锚点、按前缀自动编号与编号隔离）。

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
