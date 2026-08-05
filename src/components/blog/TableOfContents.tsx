"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ListTree } from "lucide-react";
import type { TocItem } from "@/types/blog";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="hidden xl:block sticky top-24"
    >
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <ListTree className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            目录
          </span>
        </div>
        <nav className="space-y-0.5">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "toc-link",
                `data-level-${item.level}`,
                activeId === item.id && "active",
              )}
              data-level={item.level}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
}
