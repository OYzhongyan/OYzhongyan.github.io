export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  abstract: string;
  draft?: boolean;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
  readingTime: number;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
