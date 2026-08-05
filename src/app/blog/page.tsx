import { BlogList } from "@/components/blog/BlogList";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/config";

export const metadata = {
  title: `博客 · ${siteConfig.author.displayName}`,
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <BlogList posts={posts} />
    </div>
  );
}
