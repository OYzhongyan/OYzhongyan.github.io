"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const items = siteConfig.navigation;

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const indicatorHref = hoveredHref ?? items.find((i) => isActive(i.href))?.href ?? null;

  useEffect(() => {
    if (!containerRef.current || !indicatorHref) {
      setIndicator(null);
      return;
    }
    const el = containerRef.current.querySelector<HTMLElement>(
      `[data-href="${CSS.escape(indicatorHref)}"]`,
    );
    if (!el) {
      setIndicator(null);
      return;
    }
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [indicatorHref]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-neutral-200/60 dark:border-neutral-800/60 shadow-sm"
            : "bg-transparent",
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/"
                className="display-heading text-xl lg:text-2xl font-bold tracking-tight"
              >
                <span className="text-primary">my</span>
                <span className="text-accent">Blog</span>
                <span className="text-accent">.</span>
              </Link>
            </motion.div>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-2">
              <div
                ref={containerRef}
                className="relative flex items-center mr-2"
                onMouseLeave={() => setHoveredHref(null)}
              >
                {indicator && (
                  <motion.span
                    className="absolute h-9 rounded-lg pointer-events-none"
                    style={{
                      background:
                        "color-mix(in srgb, var(--accent) 12%, transparent)",
                    }}
                    initial={false}
                    animate={{ left: indicator.left, width: indicator.width }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      data-href={item.href}
                      onMouseEnter={() => setHoveredHref(item.href)}
                      className={cn("nav-link relative z-10", active && "active")}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </div>
              <ThemeToggle />
            </div>

            {/* Mobile actions */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:border-accent transition-colors"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-xl"
          >
            <div className="flex justify-end p-4">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:border-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 px-6 pt-16">
              {items.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "display-heading text-4xl font-bold transition-colors",
                      isActive(item.href) ? "text-accent" : "text-primary hover:text-accent",
                    )}
                  >
                    {item.title}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
