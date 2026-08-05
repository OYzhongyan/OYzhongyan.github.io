import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogPost, BlogPostMeta, TocItem } from "@/types/blog";
import { estimateReadingTime } from "./utils";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

let _cache: BlogPost[] | null = null;

function loadAll(): BlogPost[] {
  if (_cache) return _cache;

  if (!fs.existsSync(BLOG_DIR)) {
    _cache = [];
    return _cache;
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts: BlogPost[] = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(raw);

    const meta: BlogPostMeta = {
      slug,
      title: data.title ?? slug,
      date: typeof data.date === "string" ? data.date : new Date(data.date).toISOString(),
      tags: Array.isArray(data.tags) ? data.tags : [],
      abstract: data.abstract ?? "",
      draft: Boolean(data.draft),
    };

    return {
      ...meta,
      content,
      readingTime: estimateReadingTime(content),
    };
  });

  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  _cache = posts;
  return _cache;
}

export function getAllPosts(): BlogPost[] {
  return loadAll().filter((p) => !p.draft);
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function getAllTags(): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of getAllPosts()) {
    for (const t of p.tags) {
      map.set(t, (map.get(t) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/** 从 markdown 正文中抽取 h2/h3 作为目录 */
export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const toc: TocItem[] = [];
  let inFence = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].replace(/[`*_]/g, "").trim();
    const id = slugify(text);
    toc.push({ id, text, level });
  }

  return toc;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
