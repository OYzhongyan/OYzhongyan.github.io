"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LikesState {
  liked: Record<string, boolean>;
  toggle: (slug: string) => void;
  isLiked: (slug: string) => boolean;
  reset: (slug: string) => void;
}

export const useLikesStore = create<LikesState>()(
  persist(
    (set, get) => ({
      liked: {},
      toggle: (slug) =>
        set((state) => ({
          liked: { ...state.liked, [slug]: !state.liked[slug] },
        })),
      isLiked: (slug) => Boolean(get().liked[slug]),
      reset: (slug) =>
        set((state) => {
          const next = { ...state.liked };
          delete next[slug];
          return { liked: next };
        }),
    }),
    { name: "myBlog:likes" },
  ),
);

/** Base like count for a post (pseudo-random but stable) */
export function baseLikeCount(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) | 0;
  }
  return 3 + (Math.abs(h) % 24);
}
