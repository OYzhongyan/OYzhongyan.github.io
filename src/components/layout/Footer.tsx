"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Mail, ArrowUp } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-neutral-500">
            © {new Date().getFullYear()} {siteConfig.author.displayName}. Powered by
            <span className="text-accent font-medium"> Next.js </span>
            &
            <span className="text-accent font-medium"> MathJax </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-accent hover:border-accent transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.social.email}
              aria-label="Email"
              className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-accent hover:border-accent transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              aria-label="Back to top"
              className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-accent hover:border-accent transition-colors"
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
