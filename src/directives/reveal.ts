import type { Directive } from "vue";

export interface RevealOptions {
  /** 延迟，毫秒 */
  delay?: number;
  /** 初始下移距离，像素 */
  y?: number;
  /** false 表示每次进入视口都重播 */
  once?: boolean;
}

const supportsIntersectionObserver =
  typeof window !== "undefined" && "IntersectionObserver" in window;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add("is-revealed");
        if (el.dataset.revealOnce !== "false") observer?.unobserve(el);
      }
    },
    { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
  );
  return observer;
}

/**
 * v-reveal —— 滚动入场。
 * 只负责加类，动画全部交给 theme.scss 里的 `.sm-reveal`，方便统一节奏。
 * 尊重 prefers-reduced-motion：直接显示，不做位移。
 */
export const reveal: Directive<HTMLElement, RevealOptions | undefined> = {
  mounted(el, binding) {
    const opts = binding.value ?? {};

    if (!supportsIntersectionObserver || prefersReducedMotion()) {
      el.classList.add("is-revealed");
      return;
    }

    el.classList.add("sm-reveal");
    el.style.setProperty("--reveal-delay", `${opts.delay ?? 0}ms`);
    el.style.setProperty("--reveal-y", `${opts.y ?? 18}px`);
    if (opts.once === false) el.dataset.revealOnce = "false";

    getObserver().observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};
