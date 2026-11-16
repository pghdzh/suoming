<template>
  <div
    v-show="visible"
    class="scroll-progress"
    :style="{ transform: `scaleX(${progress})` }"
    aria-hidden="true"
  >
    <span class="scroll-progress__cap"></span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

/**
 * 页面顶部的一条金红细光：读到哪儿，它就走到哪儿。
 * 只在页面真的能滚动时才出现。
 */
const progress = ref(0);
const visible = ref(false);
const reduced =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let frame = 0;

function measure() {
  frame = 0;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  visible.value = max > 80;
  progress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

function schedule() {
  if (frame) return;
  frame = window.requestAnimationFrame(measure);
}

onMounted(() => {
  measure();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
});

onUnmounted(() => {
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  if (frame) window.cancelAnimationFrame(frame);
});
</script>

<style scoped lang="scss">
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1200;
  width: 100%;
  height: 2px;
  transform-origin: 0 50%;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    rgba(194, 160, 97, 0.55),
    #c2a061 45%,
    #ff3a56 100%
  );
  box-shadow: 0 0 10px rgba(255, 58, 86, 0.45);
  transition: transform 0.12s linear;
  will-change: transform;
}

.scroll-progress__cap {
  position: absolute;
  top: -1px;
  right: 0;
  width: 3px;
  height: 4px;
  background: #ff8a9b;
  box-shadow: 0 0 8px 2px rgba(255, 58, 86, 0.75);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-progress {
    transition: none;
  }
}
</style>
