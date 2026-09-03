"use client";

import { motion } from "framer-motion";
import { Markdown } from "@/components/ui/Markdown";
import { Feather } from "lucide-react";

interface AboutProps {
  content: string;
}

export function About({ content }: AboutProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="paper-card p-6 lg:p-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Feather className="h-4 w-4 text-accent" />
        <h2 className="display-heading text-xl font-bold text-primary">About</h2>
      </div>
      <div className="blog-markdown">
        <Markdown content={content} />
      </div>
    </motion.section>
  );
}
