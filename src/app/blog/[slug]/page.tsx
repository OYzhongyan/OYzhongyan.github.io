import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getPostBySlug, extractToc } from "@/lib/blog";
import { siteConfig } from "@/lib/config";
import { BlogPostClient } from "@/components/blog/BlogPost";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "未找到" };
  return {
    title: `${post.title} · ${siteConfig.author.displayName}`,
    description: post.abstract,
    openGraph: {
      title: post.title,
      description: post.abstract,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const toc = extractToc(post.content);
  return <BlogPostClient post={post} toc={toc} />;
}
