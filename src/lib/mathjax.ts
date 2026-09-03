/**
 * MathJax utilities
 * - Preprocess $...$ and $$...$$ in markdown to avoid react-markdown mis-parsing
 * - Notify MathJax to re-typeset after rendering
 */

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements?: HTMLElement[]) => Promise<void>;
      typeset?: (elements?: HTMLElement[]) => void;
      startup?: {
        promise?: Promise<void>;
      };
    };
  }
}

/** Wait for MathJax to be ready (up to 5 seconds) */
export function waitForMathJax(timeout = 5000): Promise<void> {
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      if (typeof window !== "undefined" && window.MathJax?.typesetPromise) {
        resolve();
        return;
      }
      if (Date.now() - start > timeout) {
        resolve();
        return;
      }
      setTimeout(tick, 80);
    };
    tick();
  });
}

/** Trigger MathJax re-typeset on specified elements */
export async function typesetMath(elements?: HTMLElement[]): Promise<void> {
  if (typeof window === "undefined") return;
  await waitForMathJax();
  try {
    await window.MathJax?.typesetPromise?.(elements);
  } catch (e) {
    // Ignore typeset errors (e.g. formula syntax issues)
    console.warn("MathJax typeset error:", e);
  }
}
