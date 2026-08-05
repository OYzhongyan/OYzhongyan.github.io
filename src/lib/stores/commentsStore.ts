"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Comment {
  id: string;
  slug: string;
  author: string;
  content: string;
  createdAt: number;
  parentId: string | null;
}

interface CommentsState {
  comments: Record<string, Comment[]>;
  add: (slug: string, author: string, content: string, parentId?: string | null) => void;
  remove: (slug: string, id: string) => void;
  list: (slug: string) => Comment[];
}

function genId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useCommentsStore = create<CommentsState>()(
  persist(
    (set, get) => ({
      comments: {},
      add: (slug, author, content, parentId = null) =>
        set((state) => {
          const list = state.comments[slug] ?? [];
          const next: Comment = {
            id: genId(),
            slug,
            author: author.trim() || "匿名访客",
            content: content.trim(),
            createdAt: Date.now(),
            parentId,
          };
          return {
            comments: { ...state.comments, [slug]: [...list, next] },
          };
        }),
      remove: (slug, id) =>
        set((state) => {
          const list = state.comments[slug] ?? [];
          // 同时删除其所有回复
          const toRemove = new Set<string>([id]);
          let changed = true;
          while (changed) {
            changed = false;
            for (const c of list) {
              if (c.parentId && toRemove.has(c.parentId) && !toRemove.has(c.id)) {
                toRemove.add(c.id);
                changed = true;
              }
            }
          }
          return {
            comments: {
              ...state.comments,
              [slug]: list.filter((c) => !toRemove.has(c.id)),
            },
          };
        }),
      list: (slug) => get().comments[slug] ?? [],
    }),
    { name: "myBlog:comments" },
  ),
);
