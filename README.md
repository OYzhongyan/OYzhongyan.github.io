# myBlog · 个人学术博客

一个面向研究者的个人学术主页，包含「关于博主」「研究工作」「博客帖子」三大板块，支持 MathJax 公式渲染、点赞与嵌套回复。

## ✨ 特性

- **三大板块**：关于（个人卡片 + 自我介绍）、研究（BibTeX 论文列表 + 类型筛选）、博客（卡片网格 + 标签筛选）
- **MathJax v3 公式渲染**：支持行内 `$...$` 与块级 `$$...$$`，适配量子物理 / 机器学习领域的复杂公式
- **点赞功能**：心形按钮 + 粒子飞散动效，状态本地持久化（localStorage）
- **嵌套回复**：支持二级嵌套、昵称输入、Markdown 与 `$LaTeX$` 公式，本地持久化
- **暗色 / 亮色主题**：基于 `next-themes`，切换时公式自动重新排版
- **磁性导航**：framer-motion 弹簧动画的下划线指示器
- **目录（TOC）**：博文详情页右侧浮动目录，滚动高亮当前章节
- **静态导出**：`output: 'export'`，可部署至 GitHub Pages / Vercel / Netlify

## 🎨 美学方向

**Quantum Notebook（量子笔记本）** —— 学术笔记本与现代编辑设计的融合：

- 主色：墨色 `#0f172a` + 暖琥珀铜色 `#c2410c`
- 字体：`Newsreader`（衬线标题）+ `Source Sans 3`（无衬线正文）+ `JetBrains Mono`（等宽）
- 装饰：极淡的物理网格背景、玻璃拟态卡片

## 🛠 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Next.js 15.3 (App Router) + React 19 |
| 样式 | Tailwind CSS 3.4 + CSS 变量主题 |
| 动效 | framer-motion |
| 状态 | zustand（点赞、评论、主题） |
| Markdown | react-markdown + remark-gfm + rehype-highlight |
| 公式 | MathJax v3 |
| 字体 | next/font/google |
| 构建 | 静态导出 (`output: 'export'`) |

## 📁 目录结构

```
myBlog/
├── content/                       # ✏️ 作者编辑区
│   ├── about.md                   # 关于段落
│   ├── news.json                  # 最新动态
│   ├── publications.bib           # BibTeX 论文库
│   └── blog/                      # 博文 Markdown 文件
│       ├── heisenberg-correlation.md
│       ├── renyi2-entropy-notes.md
│       └── pytorch-variational-wf.md
├── public/                        # 静态资源（头像、favicon）
├── src/
│   ├── app/                       # 路由页面
│   ├── components/                # React 组件
│   │   ├── layout/                # 导航、页脚
│   │   ├── home/                  # 首页组件
│   │   ├── blog/                  # 博客组件
│   │   ├── research/              # 研究组件
│   │   └── ui/                    # 通用 UI（Markdown、ThemeProvider 等）
│   ├── lib/                       # 工具与状态
│   │   ├── stores/                # zustand stores
│   │   ├── config.ts              # ⚙️ 站点配置（姓名、社交链接等）
│   │   ├── blog.ts                # 博文加载与解析
│   │   ├── bibtexParser.ts        # BibTeX 解析
│   │   └── mathjax.ts             # MathJax 工具
│   └── types/                     # TypeScript 类型
└── ...配置文件
```

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 本地开发
npm run dev
# 访问 http://localhost:3000

# 生产构建（静态导出至 out/）
npm run build
```

## ✏️ 自定义你的内容

### 1. 修改个人信息

编辑 [`src/lib/config.ts`](src/lib/config.ts)：

```typescript
export const siteConfig = {
  title: "myBlog",
  author: {
    name: "B. Logger",          // 你的姓名（与 BibTeX 中一致以便高亮）
    displayName: "博主",
    title: "博士研究生 · ...",
    avatar: "/avatar.svg",      // 替换 public/avatar.svg
    bio: "...",
    email: "you@example.com",
  },
  social: {
    github: "https://github.com/yourname",
    email: "mailto:you@example.com",
    orcid: "https://orcid.org/...",
  },
  researchInterests: ["量子多体物理", ...],
};
```

### 2. 编辑关于段落

直接修改 [`content/about.md`](content/about.md)，支持完整 Markdown。

### 3. 添加论文

编辑 [`content/publications.bib`](content/publications.bib)，按 BibTeX 格式追加条目。关键字段：

- `selected = {true}`：在首页「精选论文」中展示
- `type = {journal|conference|preprint}`：用于研究页筛选
- `doi` / `eprint`：自动生成 DOI / arXiv 外链

### 4. 发布博文

在 [`content/blog/`](content/blog/) 下新建 `*.md` 文件，frontmatter 格式：

```yaml
---
title: "文章标题"
date: "2026-08-01"
tags: ["量子物理", "张量网络"]
abstract: "摘要一句话"
draft: false
---

正文支持完整 Markdown 与 MathJax 公式：

行内公式 $\vec{S}_i$，块级公式：

$$
H = J \sum_i \vec{S}_i \cdot \vec{S}_{i+1}
$$
```

### 5. 添加最新动态

编辑 [`content/news.json`](content/news.json)，按格式追加：

```json
{
  "date": "2026-08-01",
  "type": "paper",
  "title": "新论文被接收",
  "url": "/research/"
}
```

`type` 可选：`paper` / `talk` / `update` / `other`。

## 📦 部署

### Vercel
直接连接 GitHub 仓库即可，无需额外配置。

### GitHub Pages
1. 修改 [`next.config.ts`](next.config.ts)，添加 `basePath: "/your-repo-name"`
2. `npm run build` 后将 `out/` 目录内容推送至 `gh-pages` 分支
3. 或使用 GitHub Actions 自动部署

### Netlify
- 构建命令：`npm run build`
- 发布目录：`out`

## 🔧 互动数据说明

点赞与回复数据通过 `localStorage` 持久化，**仅保存在当前浏览器**，开箱即用、无需后端。

如需跨设备同步，可在不改动前端结构的前提下接入：
- **Giscus**：基于 GitHub Discussions 的评论系统，免费
- **Waline**：自托管评论系统，支持点赞与通知

接入点位于：
- [`src/components/blog/LikeButton.tsx`](src/components/blog/LikeButton.tsx)
- [`src/components/blog/Comments.tsx`](src/components/blog/Comments.tsx)

## 📄 文档

- [产品需求文档（PRD）](.trae/documents/PRD.md)
- [技术架构文档](.trae/documents/TechnicalArchitecture.md)

## 📝 License

MIT
