"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useLikesStore, baseLikeCount } from "@/lib/stores/likesStore";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  slug: string;
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
}

export function LikeButton({ slug }: LikeButtonProps) {
  const liked = useLikesStore((s) => Boolean(s.liked[slug]));
  const toggle = useLikesStore((s) => s.toggle);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => setMounted(true), []);

  const base = baseLikeCount(slug);
  const count = mounted ? base + (liked ? 1 : 0) : base;

  const onClick = () => {
    if (liked) {
      toggle(slug);
      return;
    }
    // 生成 8 个粒子向四周飞散
    const ps: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      angle: (i / 8) * Math.PI * 2 + Math.random() * 0.3,
      distance: 50 + Math.random() * 30,
    }));
    setParticles(ps);
    setTimeout(() => setParticles([]), 900);
    toggle(slug);
  };

  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <button
        type="button"
        onClick={onClick}
        aria-label={liked ? "取消点赞" : "点赞"}
        aria-pressed={liked}
        className={cn(
          "relative h-16 w-16 rounded-full flex items-center justify-center transition-all",
          liked
            ? "bg-accent/15 border-2 border-accent text-accent shadow-glow"
            : "border-2 border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:border-accent hover:text-accent",
        )}
      >
        <motion.span
          key={liked ? "filled" : "outline"}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          whileTap={{ scale: 0.85 }}
        >
          <Heart
            className={cn("h-6 w-6", liked && "fill-accent")}
          />
        </motion.span>

        {/* 粒子动效 */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-accent pointer-events-none"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                opacity: 0,
                scale: 0.3,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      </button>
      <div className="flex items-baseline gap-1">
        <motion.span
          key={count}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className={cn(
            "display-heading text-2xl font-bold tabular-nums",
            liked ? "text-accent" : "text-neutral-600 dark:text-neutral-400",
          )}
        >
          {count}
        </motion.span>
        <span className="text-xs text-neutral-500">
          {liked ? "已点赞" : "点赞"}
        </span>
      </div>
      <p className="text-xs text-neutral-400">
        点赞数据本地保存于你的浏览器
      </p>
    </div>
  );
}
