"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Giscus from "@giscus/react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

interface CommentsProps {
  slug: string;
}

// Repository info: user homepage repo, deployed to root path
const GISCUS_REPO = "OYzhongyan/OYzhongyan.github.io";
const GISCUS_REPO_ID = "R_kgDOQ_y_3Q";
const GISCUS_CATEGORY = "Announcements";
const GISCUS_CATEGORY_ID = "DIC_kwDOQ_y_3c4DCw7d";

export function Comments({ slug }: CommentsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Map to Giscus theme: light for light mode, dark_dimmed for dark mode (better with ink theme)
  const giscusTheme =
    resolvedTheme === "dark" ? "dark_dimmed" : "light";

  // Avoid hydration mismatch: render placeholder skeleton before mounted
  if (!mounted) {
    return (
      <section className="paper-card p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-4 w-4 text-accent" />
          <h2 className="display-heading text-xl font-bold text-primary">
            Comments
        </h2>
        </div>
        <div className="h-48 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800/40" />
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="paper-card p-6 lg:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-4 w-4 text-accent" />
        <h2 className="display-heading text-xl font-bold text-primary">
          Comments
        </h2>
      </div>

      <Giscus
        repo={GISCUS_REPO}
        repoId={GISCUS_REPO_ID}
        category={GISCUS_CATEGORY}
        categoryId={GISCUS_CATEGORY_ID}
        mapping="pathname"
        term={slug}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={giscusTheme}
        lang="en"
        loading="lazy"
      />
    </motion.section>
  );
}
