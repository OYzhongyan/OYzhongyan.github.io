"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { formatDateShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of posts) {
      for (const t of p.tags) m.set(t, (m.get(t) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const filtered = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter((p) => p.tags.includes(activeTag));
  }, [posts, activeTag]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="display-heading text-3xl lg:text-4xl font-bold text-primary mb-2">
          博客
        </h1>
        <p className="text-sm text-neutral-500">
          笔记、想法与未完成的推导。共 {posts.length} 篇。
        </p>
      </motion.div>

      {/* 标签云 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full border transition-all",
              !activeTag
                ? "bg-accent text-white border-accent"
                : "border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-accent hover:text-accent",
            )}
          >
            全部
          </button>
          {tags.map(([tag, count]) => (
            <button
              key={tag}
              type="button"
              onClick={() =>
                setActiveTag((prev) => (prev === tag ? null : tag))
              }
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full border transition-all flex items-center gap-1",
                activeTag === tag
                  ? "bg-accent text-white border-accent"
                  : "border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-accent hover:text-accent",
              )}
            >
              <Tag className="h-3 w-3" />
              {tag}
              <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>
      )}

      {/* 文章卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.05 * i, duration: 0.5 }}
          >
            <Link
              href={`/blog/${post.slug}/`}
              className="group block h-full paper-card p-6 overflow-hidden relative"
            >
              {/* 装饰角标 */}
              <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full bg-accent/5 group-hover:bg-accent/10 transition-colors" />

              <div className="relative">
                {/* 元信息 */}
                <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDateShort(post.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} 分钟
                  </span>
                </div>

                {/* 标题 */}
                <h2 className="display-heading text-xl font-bold text-primary leading-snug mb-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h2>

                {/* 摘要 */}
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4 line-clamp-3">
                  {post.abstract}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="accent-chip">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 阅读更多 */}
                <div className="flex items-center gap-1 text-xs font-medium text-accent">
                  阅读全文
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-neutral-500 py-20">暂无符合条件的博文</p>
      )}
    </div>
  );
}
