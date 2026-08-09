export const siteConfig = {
  title: "myBlog",
  description: "个人学术主页",
  url: "https://example.com",

  author: {
    name: "Zhongyan Ouyang",
    displayName: "OYZY",
    title: "HIT, SII 博士研究生",
    avatar: "/nnq.png",
    bio: "",
    email: "2063930662@qq.com",
  },

  social: {
    github: "https://github.com/OYzhongyan",
    email: "mailto:2063930662@qq.com",
    orcid: "https://orcid.org/0009-0006-8930-7085",
  },

  researchInterests: [
    "Aritificial Intelligence",
  ],

  navigation: [
    { title: "关于", href: "/" },
    { title: "研究", href: "/research" },
    { title: "博客", href: "/blog" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
