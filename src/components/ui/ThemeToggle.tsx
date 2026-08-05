"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-neutral-800" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "切换到亮色模式" : "切换到暗色模式"}
      className="relative h-9 w-9 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden hover:border-accent transition-colors"
    >
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ y: -20, opacity: 0, rotate: -90 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.35, type: "spring", stiffness: 260, damping: 20 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-accent" />
        ) : (
          <Sun className="h-4 w-4 text-accent" />
        )}
      </motion.div>
    </button>
  );
}
