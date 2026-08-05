"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Github, Mail, ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Profile() {
  const { author, social, researchInterests } = siteConfig;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-24"
    >
      <div className="glass-card p-6 space-y-5">
        {/* 头像 */}
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.04, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative h-32 w-32 rounded-full overflow-hidden ring-2 ring-accent/30 shadow-lg"
          >
            <Image
              src={author.avatar}
              alt={author.displayName}
              fill
              className="object-cover"
              sizes="128px"
            />
          </motion.div>
        </div>

        {/* 姓名 */}
        <div className="text-center space-y-1">
          <h2 className="display-heading text-2xl font-bold text-primary">
            {author.displayName}
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">{author.title}</p>
        </div>

        {/* 简介 */}
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed text-center">
          {author.bio}
        </p>

        {/* 研究兴趣 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            研究兴趣
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {researchInterests.map((tag) => (
              <span key={tag} className="accent-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 社交链接 */}
        <div className="flex justify-center gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <SocialLink href={social.github} icon={<Github className="h-4 w-4" />} label="GitHub" />
          <SocialLink href={social.email} icon={<Mail className="h-4 w-4" />} label="Email" />
          <SocialLink
            href={social.orcid}
            icon={<ExternalLink className="h-4 w-4" />}
            label="ORCID"
          />
        </div>
      </div>
    </motion.aside>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-accent hover:border-accent transition-colors"
    >
      {icon}
    </motion.a>
  );
}
