"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Trash2, CornerDownRight } from "lucide-react";
import { useCommentsStore, type Comment } from "@/lib/stores/commentsStore";
import { formatDateShort } from "@/lib/utils";

interface CommentsProps {
  slug: string;
}

const MAX_DEPTH = 2;

export function Comments({ slug }: CommentsProps) {
  const [mounted, setMounted] = useState(false);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyContent, setReplyContent] = useState("");

  // 直接订阅整个 comments 对象，确保新增评论时重渲染
  const commentsMap = useCommentsStore((s) => s.comments);
  const add = useCommentsStore((s) => s.add);
  const remove = useCommentsStore((s) => s.remove);

  useEffect(() => setMounted(true), []);

  const comments = useMemo<Comment[]>(
    () => commentsMap[slug] ?? [],
    [commentsMap, slug],
  );

  // 树形结构：顶级 + 一级回复
  const tree = useMemo(() => {
    const top = comments.filter((c) => !c.parentId);
    return top.map((c) => ({
      comment: c,
      replies: comments.filter((r) => r.parentId === c.id),
    }));
  }, [comments]);

  const submitTop = () => {
    if (!content.trim()) return;
    add(slug, author, content, null);
    setContent("");
  };

  const submitReply = (parentId: string) => {
    if (!replyContent.trim()) return;
    add(slug, replyAuthor, replyContent, parentId);
    setReplyContent("");
    setReplyTo(null);
  };

  return (
    <section className="paper-card p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-4 w-4 text-accent" />
        <h2 className="display-heading text-xl font-bold text-primary">
          回复 ({comments.length})
        </h2>
      </div>

      {/* 主输入框 */}
      <div className="mb-8 space-y-2">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="你的昵称（留空则匿名）"
          className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent focus:border-accent focus:outline-none transition-colors"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下你的回复……（支持简单的 Markdown 与 $LaTeX$ 公式）"
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent focus:border-accent focus:outline-none transition-colors resize-y"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={submitTop}
            disabled={!content.trim()}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="h-3.5 w-3.5" />
            提交
          </button>
        </div>
      </div>

      {/* 评论列表 */}
      {mounted && comments.length === 0 ? (
        <div className="text-center py-10 text-sm text-neutral-500">
          还没有回复，来抢沙发吧 🛋️
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {tree.map(({ comment, replies }) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <CommentItem
                  comment={comment}
                  onReply={() => {
                    setReplyTo(
                      replyTo === comment.id ? null : comment.id,
                    );
                    setReplyContent("");
                  }}
                  onRemove={() => remove(slug, comment.id)}
                  isReplying={replyTo === comment.id}
                />

                {/* 回复输入框 */}
                <AnimatePresence>
                  {replyTo === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-6 pl-4 border-l-2 border-neutral-200 dark:border-neutral-700 space-y-2"
                    >
                      <input
                        type="text"
                        value={replyAuthor}
                        onChange={(e) => setReplyAuthor(e.target.value)}
                        placeholder="你的昵称"
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent focus:border-accent focus:outline-none transition-colors"
                      />
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`回复 @${comment.author}……`}
                        rows={2}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent focus:border-accent focus:outline-none transition-colors resize-y"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setReplyTo(null)}
                          className="btn-ghost !py-1.5 !px-3 !text-xs"
                        >
                          取消
                        </button>
                        <button
                          type="button"
                          onClick={() => submitReply(comment.id)}
                          disabled={!replyContent.trim()}
                          className="btn-primary !py-1.5 !px-3 !text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          回复
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 子回复 */}
                {replies.map((reply) => (
                  <motion.div
                    key={reply.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-6 pl-4 border-l-2 border-neutral-200 dark:border-neutral-700"
                  >
                    <CommentItem
                      comment={reply}
                      isReply
                      onRemove={() => remove(slug, reply.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

function CommentItem({
  comment,
  isReply,
  onReply,
  onRemove,
  isReplying,
}: {
  comment: Comment;
  isReply?: boolean;
  onReply?: () => void;
  onRemove?: () => void;
  isReplying?: boolean;
}) {
  const initial = comment.author.slice(0, 1).toUpperCase() || "?";
  return (
    <div className="group flex gap-3">
      <div
        className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${
          isReply
            ? "bg-accent/10 text-accent"
            : "bg-primary/10 text-primary"
        }`}
      >
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-primary">
            {comment.author}
          </span>
          {isReply && (
            <CornerDownRight className="h-3 w-3 text-neutral-400" />
          )}
          <span className="text-xs text-neutral-500">
            {formatDateShort(new Date(comment.createdAt).toISOString())}
          </span>
        </div>
        <div className="text-sm text-foreground leading-relaxed mt-1 whitespace-pre-wrap break-words">
          {comment.content}
        </div>
        <div className="flex gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onReply && !isReply && (
            <button
              type="button"
              onClick={onReply}
              className={`text-xs hover:text-accent transition-colors ${
                isReplying ? "text-accent font-medium" : "text-neutral-500"
              }`}
            >
              回复
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs text-neutral-400 hover:text-error transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              删除
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
