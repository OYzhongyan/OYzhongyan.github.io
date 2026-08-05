"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink, ArrowRight } from "lucide-react";
import type { Publication } from "@/types/publication";

interface SelectedPublicationsProps {
  publications: Publication[];
  authorName: string;
}

export function SelectedPublications({
  publications,
  authorName,
}: SelectedPublicationsProps) {
  const selected = publications.filter((p) => p.selected).slice(0, 4);

  if (selected.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="paper-card p-6 lg:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-accent" />
          <h2 className="display-heading text-xl font-bold text-primary">精选论文</h2>
        </div>
        <Link
          href="/research"
          className="text-xs text-neutral-500 hover:text-accent flex items-center gap-1 transition-colors"
        >
          查看全部 <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {selected.map((pub, i) => (
          <motion.div
            key={pub.key}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * i }}
            className="group pl-4 border-l-2 border-neutral-200 dark:border-neutral-700 hover:border-accent transition-colors"
          >
            <h3 className="font-serif font-semibold text-primary leading-snug group-hover:text-accent transition-colors">
              {pub.title}
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              {pub.authors.map((a, idx) => (
                <span key={idx}>
                  {idx > 0 && ", "}
                  <span
                    className={
                      a.toLowerCase().includes(authorName.toLowerCase().split(" ")[0])
                        ? "text-accent font-medium"
                        : ""
                    }
                  >
                    {a}
                  </span>
                </span>
              ))}
            </p>
            <p className="text-xs text-neutral-500 mt-0.5 italic">
              {pub.journal || pub.booktitle}
              {pub.volume ? `, ${pub.volume}` : ""}
              {pub.pages ? `, pp. ${pub.pages}` : ""}
              {pub.year ? ` (${pub.year})` : ""}
            </p>
            <div className="flex gap-3 mt-1.5 text-xs">
              {pub.doi && (
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline flex items-center gap-1"
                >
                  DOI <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
              {pub.eprint && (
                <a
                  href={`https://arxiv.org/abs/${pub.eprint}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline flex items-center gap-1"
                >
                  arXiv <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
