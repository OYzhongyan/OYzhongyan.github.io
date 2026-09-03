"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, ExternalLink } from "lucide-react";
import type { Publication, PublicationType } from "@/types/publication";
import { cn } from "@/lib/utils";

interface PublicationsListProps {
  publications: Publication[];
  authorName: string;
}

const FILTERS: { key: PublicationType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "journal", label: "Journal" },
  { key: "conference", label: "Conference" },
  { key: "preprint", label: "Preprint" },
];

export function PublicationsList({
  publications,
  authorName,
}: PublicationsListProps) {
  const [filter, setFilter] = useState<PublicationType | "all">("all");

  const filtered = useMemo(() => {
    const list = filter === "all" ? publications : publications.filter((p) => p.type === filter);
    // Sort by year descending
    return [...list].sort((a, b) => b.year - a.year);
  }, [filter, publications]);

  const grouped = useMemo(() => {
    const m = new Map<number, Publication[]>();
    for (const p of filtered) {
      (m.get(p.year) ?? m.set(p.year, []).get(p.year)!).push(p);
    }
    return Array.from(m.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  const authorFirst = authorName.toLowerCase().split(" ")[0];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-2">
          <BookMarked className="h-5 w-5 text-accent" />
          <h1 className="display-heading text-3xl lg:text-4xl font-bold text-primary">
            Research
          </h1>
        </div>
        <p className="text-sm text-neutral-500">
          {publications.length} publications · sorted by year (newest first)
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full border transition-all",
              filter === f.key
                ? "bg-accent text-white border-accent shadow-glow"
                : "border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-accent hover:text-accent",
            )}
          >
            {f.label}
            <span className="ml-1 opacity-60">
              ({f.key === "all" ? publications.length : publications.filter((p) => p.type === f.key).length})
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-12"
        >
          {grouped.map(([year, pubs]) => (
            <div key={year}>
              <div className="flex items-center gap-3 mb-5">
                <span className="display-heading text-5xl font-bold text-accent/15">
                  {year}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-accent/30 to-transparent" />
              </div>
              <div className="space-y-5">
                {pubs.map((pub, i) => (
                  <motion.div
                    key={pub.key}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 0.05 * i, duration: 0.4 }}
                    className="group paper-card p-5 lg:p-6"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-accent shadow-glow" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg font-semibold text-primary leading-snug group-hover:text-accent transition-colors">
                          {pub.title}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                          {pub.authors.map((a, idx) => (
                            <span key={idx}>
                              {idx > 0 && ", "}
                              <span
                                className={
                                  a.toLowerCase().includes(authorFirst)
                                    ? "text-accent font-medium"
                                    : ""
                                }
                              >
                                {a}
                              </span>
                            </span>
                          ))}
                        </p>
                        <p className="text-sm text-neutral-500 mt-1 italic">
                          {pub.journal || pub.booktitle}
                          {pub.volume ? `, ${pub.volume}` : ""}
                          {pub.number ? `(${pub.number})` : ""}
                          {pub.pages ? `, pp. ${pub.pages}` : ""}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs">
                          {pub.doi && (
                            <a
                              href={`https://doi.org/${pub.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:underline flex items-center gap-1"
                            >
                              DOI <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {pub.eprint && (
                            <a
                              href={`https://arxiv.org/abs/${pub.eprint}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:underline flex items-center gap-1"
                            >
                              arXiv:{pub.eprint} <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {pub.selected && (
                            <span className="accent-chip">Featured</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          {grouped.length === 0 && (
            <p className="text-center text-neutral-500 py-20">No publications of this type</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
