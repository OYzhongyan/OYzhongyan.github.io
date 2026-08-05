import type { NextConfig } from "next";

/**
 * GitHub Pages 部署说明：
 * - 用户主页仓库 username.github.io  → 部署到根路径，basePath 为空
 * - 项目仓库 username.github.io/repo → 部署到子路径，basePath = /repo
 *
 * 工作流会通过 NEXT_BASE_PATH 环境变量自动设置。
 * 本地开发无需配置。
 */
const basePath = process.env.NEXT_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.bib$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
