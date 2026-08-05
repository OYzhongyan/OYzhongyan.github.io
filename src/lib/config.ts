export const siteConfig = {
  title: "myBlog",
  description: "量子物理与机器学习研究者的个人学术主页",
  url: "https://example.com",

  author: {
    name: "B. Logger",
    displayName: "博主",
    title: "博士研究生 · 理论物理 / 机器学习",
    avatar: "/avatar.svg",
    bio: "在量子多体物理与机器学习的交叉地带游荡，喜欢把笔记写下来。",
    email: "you@example.com",
  },

  social: {
    github: "https://github.com/username",
    email: "mailto:you@example.com",
    orcid: "https://orcid.org/0000-0000-0000-0000",
  },

  researchInterests: [
    "量子多体物理",
    "张量网络",
    "机器学习",
    "Renyi 熵",
    "强关联体系",
  ],

  navigation: [
    { title: "关于", href: "/" },
    { title: "研究", href: "/research" },
    { title: "博客", href: "/blog" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
