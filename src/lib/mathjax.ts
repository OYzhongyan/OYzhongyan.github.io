/**
 * MathJax 工具集
 * - 预处理 markdown 中的 $...$ 与 $$...$$，避免被 react-markdown 误解析
 * - 渲染完成后通知 MathJax 重新排版
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

/** 等待 MathJax 就绪（最多 5 秒） */
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

/** 触发 MathJax 重新排版指定区域 */
export async function typesetMath(elements?: HTMLElement[]): Promise<void> {
  if (typeof window === "undefined") return;
  await waitForMathJax();
  try {
    await window.MathJax?.typesetPromise?.(elements);
  } catch (e) {
    // 忽略排版错误（如公式语法问题）
    console.warn("MathJax typeset error:", e);
  }
}
