"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { BlogPost, TocItem } from "@/types/blog";
import { Markdown } from "@/components/ui/Markdown";
import { TableOfContents } from "./TableOfContents";
import { LikeButton } from "./LikeButton";
import { Comments } from "./Comments";
import { formatDateShort } from "@/lib/utils";

interface BlogPostClientProps {
  post: BlogPost;
  toc: TocItem[];
}

export function BlogPostClient({ post, toc }: BlogPostClientProps) {
  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* 返回链接 */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/blog/"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回博客列表
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* 正文 */}
        <div className="xl:col-span-9 min-w-0">
          {/* 文章头部 */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 pb-8 border-b border-neutral-200 dark:border-neutral-800"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDateShort(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime} 分钟阅读
              </span>
            </div>
            <h1 className="display-heading text-3xl lg:text-5xl font-bold text-primary leading-tight tracking-tight">
              {post.title}
            </h1>
            {post.abstract && (
              <p className="text-base lg:text-lg text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed italic font-serif">
                {post.abstract}
              </p>
            )}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-5">
                {post.tags.map((tag) => (
                  <span key={tag} className="accent-chip">
                    <Tag className="h-2.5 w-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.header>

          {/* 正文 Markdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="blog-markdown"
          >
            <Markdown content={post.content} />
          </motion.div>

          {/* 点赞 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col items-center"
          >
            <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
              如果觉得有帮助
            </p>
            <LikeButton slug={post.slug} />
          </motion.div>

          {/* 回复区 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Comments slug={post.slug} />
          </motion.div>
        </div>

        {/* TOC */}
        <div className="xl:col-span-3">
          <TableOfContents items={toc} />
        </div>
      </div>
    </article>
  );
}
