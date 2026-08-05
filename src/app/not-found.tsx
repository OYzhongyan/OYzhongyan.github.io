import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="display-heading text-9xl font-bold text-accent/20 mb-4">
          404
        </div>
        <h1 className="display-heading text-2xl font-bold text-primary mb-3">
          页面未找到
        </h1>
        <p className="text-sm text-neutral-500 mb-8 max-w-md">
          你访问的页面可能已被移动或从未存在。回到首页继续探索吧。
        </p>
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" />
          返回首页
        </Link>
      </div>
    </div>
  );
}
