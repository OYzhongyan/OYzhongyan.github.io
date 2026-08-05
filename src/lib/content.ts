import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function loadAbout(): string {
  const p = path.join(CONTENT_DIR, "about.md");
  if (!fs.existsSync(p)) return "";
  return fs.readFileSync(p, "utf8");
}

export interface NewsItem {
  date: string;
  type: "paper" | "talk" | "update" | "other";
  title: string;
  url?: string;
}

export function loadNews(): NewsItem[] {
  const p = path.join(CONTENT_DIR, "news.json");
  if (!fs.existsSync(p)) return [];
  try {
    const items = JSON.parse(fs.readFileSync(p, "utf8")) as NewsItem[];
    return items.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch {
    return [];
  }
}

export function loadPublicationsBib(): string {
  const p = path.join(CONTENT_DIR, "publications.bib");
  if (!fs.existsSync(p)) return "";
  return fs.readFileSync(p, "utf8");
}
