"use client";

import { motion } from "framer-motion";
import { Bell, FileText, Mic2, RefreshCw } from "lucide-react";
import type { NewsItem } from "@/lib/content";
import { formatDateShort } from "@/lib/utils";

interface NewsProps {
  items: NewsItem[];
}

const iconForType = (type: NewsItem["type"]) => {
  switch (type) {
    case "paper":
      return <FileText className="h-3.5 w-3.5" />;
    case "talk":
      return <Mic2 className="h-3.5 w-3.5" />;
    case "update":
      return <RefreshCw className="h-3.5 w-3.5" />;
    default:
      return <Bell className="h-3.5 w-3.5" />;
  }
};

const labelForType = (type: NewsItem["type"]) => {
  switch (type) {
    case "paper":
      return "Paper";
    case "talk":
      return "Talk";
    case "update":
      return "Update";
    default:
      return "News";
  }
};

export function News({ items }: NewsProps) {
  if (items.length === 0) return null;

  // Group by year
  const grouped: Record<string, NewsItem[]> = {};
  for (const item of items) {
    const y = item.date.slice(0, 4);
    (grouped[y] ??= []).push(item);
  }
  const years = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="paper-card p-6 lg:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-4 w-4 text-accent" />
        <h2 className="display-heading text-xl font-bold text-primary">Latest News</h2>
      </div>

      <div className="space-y-8">
        {years.map((year) => (
          <div key={year} className="relative">
            <div className="flex items-center gap-3 mb-3">
              <span className="display-heading text-3xl font-bold text-accent/30">
                {year}
              </span>
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <ul className="space-y-3">
              {grouped[year].map((item, i) => (
                <motion.li
                  key={`${year}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.04 * i, duration: 0.4 }}
                  className="flex gap-3 group"
                >
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                    {iconForType(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                        {labelForType(item.type)}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {formatDateShort(item.date)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mt-0.5 group-hover:text-accent transition-colors">
                      {item.url ? (
                        <a href={item.url} className="hover:underline">
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
