"use client";

import Script from "next/script";
import { useEffect } from "react";

/**
 * MathJax v3 config + loading.
 * - config script beforeInteractive
 * - mathjax.js afterInteractive (lazy load to avoid blocking first paint)
 * Auto re-typeset on theme change.
 */
export function MathJaxProvider() {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (typeof window !== "undefined" && window.MathJax?.typesetPromise) {
        window.MathJax.typesetPromise().catch(() => {});
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Script id="mathjax-config" strategy="beforeInteractive">
        {`
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
              displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
              processEscapes: true,
              processRefs: true,
              tags: 'none',
            },
            svg: { fontCache: 'global' },
            chtml: {
              matchFontHeight: false,
              scale: 1.0,
            },
            options: {
              skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
              ignoreHtmlClass: 'no-mathjax',
              processHtmlClass: 'mathjax-content',
            },
            startup: {
              typeset: false,
            },
          };
        `}
      </Script>
      <Script
        id="mathjax-script"
        src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.js"
        strategy="afterInteractive"
        async
      />
    </>
  );
}
