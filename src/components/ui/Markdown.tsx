"use client";

import { useEffect, useRef, ReactNode, ReactElement, cloneElement, isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { typesetMath } from "@/lib/mathjax";

/* ============================================================
   MathJax placeholder preprocessing
   - Before react-markdown parsing, replace $$...$$ and $...$ with \uE000idx\uE001
   - Placeholders use private use area characters, won't be mis-parsed by markdown
   - During rendering, restore placeholders to $-wrapped text nodes for MathJax
   ============================================================ */

interface MathExpr {
  raw: string;
  display: boolean;
}

interface PreprocessedMath {
  text: string;
  expressions: MathExpr[];
}

const PLACEHOLDER_OPEN = "\uE000";
const PLACEHOLDER_CLOSE = "\uE001";

function preprocessMath(md: string): PreprocessedMath {
  const expressions: MathExpr[] = [];

  // 1. Stash code blocks and inline code (don't process math inside)
  const codeBlocks: string[] = [];
  let text = md.replace(/```[\s\S]*?```/g, (m) => {
    const idx = codeBlocks.length;
    codeBlocks.push(m);
    return `\uE002${idx}\uE003`;
  });
  const inlineCodes: string[] = [];
  text = text.replace(/`[^`\n]+`/g, (m) => {
    const idx = inlineCodes.length;
    inlineCodes.push(m);
    return `\uE004${idx}\uE005`;
  });

  // 2. Display math first ($$...$$)
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr: string) => {
    const idx = expressions.length;
    expressions.push({ raw: expr, display: true });
    return `${PLACEHOLDER_OPEN}${idx}${PLACEHOLDER_CLOSE}`;
  });

  // 3. Inline math ($...$), avoid conflict with display; require $ not preceded by backslash
  text = text.replace(/(^|[^\\$])\$(?!\$)([^\$\n]+?)\$/g, (_m, pre: string, expr: string) => {
    const idx = expressions.length;
    expressions.push({ raw: expr, display: false });
    return `${pre}${PLACEHOLDER_OPEN}${idx}${PLACEHOLDER_CLOSE}`;
  });

  // 4. Restore code
  text = text.replace(/\uE004(\d+)\uE005/g, (_, i) => inlineCodes[Number(i)] ?? "");
  text = text.replace(/\uE002(\d+)\uE003/g, (_, i) => codeBlocks[Number(i)] ?? "");

  return { text, expressions };
}

/** Split string by placeholders, return ReactNode array */
function splitStringWithMath(s: string, expressions: MathExpr[]): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = new RegExp(`${PLACEHOLDER_OPEN}(\\d+)${PLACEHOLDER_CLOSE}`, "g");
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = re.exec(s)) !== null) {
    if (m.index > lastIdx) {
      parts.push(s.slice(lastIdx, m.index));
    }
    const exprIdx = Number(m[1]);
    const expr = expressions[exprIdx];
    if (expr) {
      if (expr.display) {
        parts.push(
          <span key={`m-${key++}`} className="mathjax-display">
            {`$$${expr.raw}$$`}
          </span>,
        );
      } else {
        parts.push(
          <span key={`m-${key++}`} className="mathjax-inline">
            {`$${expr.raw}$`}
          </span>,
        );
      }
    }
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < s.length) {
    parts.push(s.slice(lastIdx));
  }
  return parts;
}

/** Recursively walk React nodes, replace string placeholders with MathJax spans */
function walkNodes(node: ReactNode, expressions: MathExpr[]): ReactNode {
  if (typeof node === "string") {
    return splitStringWithMath(node, expressions);
  }
  if (Array.isArray(node)) {
    return node.map((n) => walkNodes(n, expressions));
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    const children = el.props.children;
    if (children !== undefined) {
      return cloneElement(el, {
        children: walkNodes(children, expressions),
      });
    }
  }
  return node;
}

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { text, expressions } = preprocessMath(content);

  useEffect(() => {
    if (ref.current) typesetMath([ref.current]);
  }, [text, expressions]);

  return (
    <div ref={ref} className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          p: ({ children }) => <p>{walkNodes(children, expressions)}</p>,
          h1: ({ children }) => <h1>{walkNodes(children, expressions)}</h1>,
          h2: ({ children }) => <h2>{walkNodes(children, expressions)}</h2>,
          h3: ({ children }) => <h3>{walkNodes(children, expressions)}</h3>,
          h4: ({ children }) => <h4>{walkNodes(children, expressions)}</h4>,
          li: ({ children }) => <li>{walkNodes(children, expressions)}</li>,
          td: ({ children }) => <td>{walkNodes(children, expressions)}</td>,
          th: ({ children }) => <th>{walkNodes(children, expressions)}</th>,
          strong: ({ children }) => <strong>{walkNodes(children, expressions)}</strong>,
          em: ({ children }) => <em>{walkNodes(children, expressions)}</em>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {walkNodes(children, expressions)}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote>{walkNodes(children, expressions)}</blockquote>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
