export const siteConfig = {
  title: "myBlog",
  description: "Personal Academic Homepage",
  url: "https://example.com",

  author: {
    name: "Zhongyan Ouyang",
    displayName: "OYZY",
    title: "HIT, SII PhD Student",
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
    "Artificial Intelligence",
  ],

  navigation: [
    { title: "About", href: "/" },
    { title: "Research", href: "/research" },
    { title: "Blog", href: "/blog" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
