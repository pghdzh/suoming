<template>
  <div class="home-scene">
    <div class="three-dom" ref="threeContainer"></div>

    <div class="veil" aria-hidden="true"></div>
    <div class="vignette" aria-hidden="true"></div>

    <!-- 四角细框：把这页收进一册档案里 -->
    <div class="home-frame" aria-hidden="true">
      <span class="home-frame__corner is-tl"></span>
      <span class="home-frame__corner is-tr"></span>
      <span class="home-frame__corner is-bl"></span>
      <span class="home-frame__corner is-br"></span>
      <span class="home-frame__line is-top"></span>
      <span class="home-frame__line is-bottom"></span>
    </div>

    <span class="home-side" aria-hidden="true">伞下故影 · 锁尽妄执</span>

    <!-- 竖排台词墨迹层 -->
    <div class="ink-stage" aria-hidden="true">
      <div
        v-for="line in activeLines"
        :key="line.id"
        class="ink-column"
        :style="{
          left: line.x + '%',
          top: line.y + '%',
          '--rot': line.rot + 'deg',
          '--dur': line.dur + 'ms',
          '--fs': line.size + 'px',
        }"
      >
        <span class="ink-column__text">{{ line.text }}</span>
        <span class="ink-column__seal"></span>
      </div>
    </div>

    <!-- 主视觉 -->
    <main class="hero">
      <p class="hero__eyebrow">
        <span class="hero__eyebrow-line"></span>
        <span class="hero__eyebrow-text">禁锁十契 · 契主</span>
        <span class="hero__eyebrow-dot" aria-hidden="true"></span>
        <span class="hero__eyebrow-text">梦州 · 谛天鉴</span>
        <span class="hero__eyebrow-line"></span>
      </p>

      <h1 class="hero__title">
        <span class="hero__title-char" style="--i: 0">锁</span>
        <span class="hero__title-char" style="--i: 1">暝</span>
      </h1>

      <p class="hero__latin">S U O M I N G</p>

      <span class="hero__divider" aria-hidden="true"></span>

      <div class="hero__verse">
        <p style="--i: 0">锁尽千般执，暝留一盏灯。</p>
        <p style="--i: 1">两百年风雨，伞下故人影。</p>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="site-footer">
      <p class="site-footer__quote">
        <span class="quote-mark">「</span>
        镜锁妄世，心照红尘。
        <span class="quote-mark">」</span>
      </p>

      <p class="site-footer__aside">
        比起设定集，更像一本摊在伞下的旧笔记。
      </p>

      <div class="site-footer__rule" aria-hidden="true">
        <span class="rule-wing rule-wing--left"></span>
        <span class="rule-lock"></span>
        <span class="rule-wing rule-wing--right"></span>
      </div>

      <p class="site-footer__copy">© {{ year }} 锁暝电子设定集 · 霜落天亦</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const threeContainer = ref<HTMLElement | null>(null);
let bgCleanup: (() => void) | null = null;

const year = new Date().getFullYear();

/* ============================================================
   官方台词墨迹（竖排）
   ============================================================ */
interface InkColumn {
  id: number;
  text: string;
  x: number;
  y: number;
  rot: number;
  dur: number;
  size: number;
}

const phrases: string[] = [
  "此道，孤身难行，且再陪我多走一程吧。",
  "若是有人与梦州为敌，交给我便好。",
  "这放下吧，忘却吧……可执着至此，这就是我想要的。",
  "心驭万全。",
  "你最后的嘱托，我已明了，我会将它送到「心」手中。",
  "不过是将那诺言推后百年。",
  "在没有你的梦州，谛天鉴有很多事要做。",
  "这不是谋划，只是信任。",
  "执伞迎晴。",
  "且向前路。",
  "伞便是最好。",
  "对她而言，能立定契约的只有那九人了。",
];

const desktopSlots = [
  { x: 10, y: 16, rot: -1.6 },
  { x: 18, y: 30, rot: 1.1 },
  { x: 8, y: 52, rot: 2.2 },
  { x: 20, y: 72, rot: -0.8 },
  { x: 78, y: 18, rot: 1.4 },
  { x: 88, y: 34, rot: -1.2 },
  { x: 82, y: 56, rot: 0.9 },
  { x: 74, y: 76, rot: -2.1 },
];

const mobileSlots = [
  { x: 9, y: 18, rot: -1.2 },
  { x: 88, y: 26, rot: 1.1 },
  { x: 12, y: 66, rot: 0.9 },
  { x: 84, y: 74, rot: -1.4 },
];

const activeLines = ref<InkColumn[]>([]);
let lineId = 0;
let spawnTimer: number | null = null;
let phraseQueue: string[] = [];
const usedSlots: number[] = [];
/* 所有飘字的回收定时器，卸载时要一起清掉 */
const lineTimers = new Set<number>();

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function nextPhrase(): string {
  if (phraseQueue.length === 0) phraseQueue = shuffle(phrases);
  return phraseQueue.pop() as string;
}

function getSlots() {
  return window.innerWidth < 640 ? mobileSlots : desktopSlots;
}

function pickSlot(): number {
  const slots = getSlots();
  const free = slots.map((_, i) => i).filter((i) => !usedSlots.includes(i));
  if (free.length === 0) return Math.floor(Math.random() * slots.length);
  return free[Math.floor(Math.random() * free.length)];
}

function spawnLine() {
  const maxActive = window.innerWidth < 640 ? 2 : 3;
  if (activeLines.value.length >= maxActive) return;

  const slots = getSlots();
  const slotIndex = pickSlot();
  const slot = slots[slotIndex];
  usedSlots.push(slotIndex);

  const dur = 8600 + Math.random() * 2600;
  const id = ++lineId;

  const baseSize =
    window.innerWidth < 640
      ? 15
      : Math.min(24, Math.max(17, window.innerWidth * 0.013));

  activeLines.value.push({
    id,
    text: nextPhrase(),
    x: slot.x,
    y: slot.y,
    rot: slot.rot,
    dur,
    size: baseSize + (Math.random() * 2 - 1),
  });

  const timer = window.setTimeout(() => {
    lineTimers.delete(timer);
    activeLines.value = activeLines.value.filter((l) => l.id !== id);
    const ui = usedSlots.indexOf(slotIndex);
    if (ui >= 0) usedSlots.splice(ui, 1);
  }, dur);
  lineTimers.add(timer);
}

function startSpawn() {
  if (reducedMotion) return;
  const loop = () => {
    spawnLine();
    spawnTimer = window.setTimeout(loop, 1800 + Math.random() * 1600);
  };
  spawnTimer = window.setTimeout(loop, 1200);
}

/* 切到别的标签页时停掉生成，省电也省得回来一堆字挤在一起 */
function onVisibilityChange() {
  if (document.hidden) {
    if (spawnTimer) {
      clearTimeout(spawnTimer);
      spawnTimer = null;
    }
  } else if (!spawnTimer) {
    startSpawn();
  }
}

/* 尊重系统的「减少动态效果」，同时小屏设备直接不加载 three.js */
const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

onMounted(async () => {
  const isSmall = window.innerWidth < 640;
  if (threeContainer.value && !reducedMotion && !isSmall) {
    try {
      /* 动态 import：three.js 不再拖累首屏白屏 */
      const { default: initZaniBackground } = await import(
        "./initZaniBackground"
      );
      if (threeContainer.value) {
        const { cleanup } = initZaniBackground(threeContainer.value);
        bgCleanup = cleanup;
      }
    } catch (err) {
      console.warn("三维背景加载失败，已回退到静态底图", err);
    }
  }
  startSpawn();
  document.addEventListener("visibilitychange", onVisibilityChange);
});

onUnmounted(() => {
  document.removeEventListener("visibilitychange", onVisibilityChange);
  if (spawnTimer) {
    clearTimeout(spawnTimer);
    spawnTimer = null;
  }
  lineTimers.forEach((t) => clearTimeout(t));
  lineTimers.clear();
  if (bgCleanup) {
    bgCleanup();
    bgCleanup = null;
  }
});
</script>

<style scoped lang="scss">
/* ============================================================
   锁暝配色 · 以绯红为骨，契金为饰，紫电为气
   ============================================================ */
$ink: #060305;
$ink-2: #0f0508;
$ink-3: #1c070e;

$blood: #5c0a16;
$red: #c0142f;
$red-lt: #ff3a56;
$red-glow: #ff8a9b;

$violet: #6a3ae0;
$violet-lt: #a98bff;

$gold: #c2a061;
$gold-lt: #f2ddab;

$mirror: #e9dde0;
$paper: #fdf4f5;

/* ============================================================
   字体栈 · 全字库正宋体优先
   ============================================================ */
$font-serif: "MaShanZheng", "全字库正宋体", "Noto Serif SC",
  "Source Han Serif SC", "Songti SC", "STSong", "SimSun", serif;

/* ============================================================
   舞台
   ============================================================ */
.home-scene {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  isolation: isolate;
  color: $paper;
  background: radial-gradient(
    ellipse 90% 70% at 50% 38%,
    $ink-3 0%,
    $ink-2 42%,
    $ink 100%
  );
  font-family: $font-serif;
  -webkit-tap-highlight-color: transparent;
}

.three-dom {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;

  :deep(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
}

.veil {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(
      ellipse 58% 50% at 50% 44%,
      rgba(6, 3, 5, 0) 0%,
      rgba(6, 3, 5, 0.38) 56%,
      rgba(6, 3, 5, 0.9) 100%
    ),
    linear-gradient(
      180deg,
      rgba(6, 3, 5, 0.7) 0%,
      rgba(6, 3, 5, 0) 22%,
      rgba(6, 3, 5, 0) 66%,
      rgba(6, 3, 5, 0.94) 100%
    );
}

.vignette {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: radial-gradient(
    ellipse 108% 88% at 50% 50%,
    transparent 44%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

/* ============================================================
   四角细框 + 侧边竖题
   ============================================================ */
.home-frame {
  position: fixed;
  inset: 20px;
  z-index: 4;
  pointer-events: none;
  animation: frameIn 2.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}

.home-frame__corner {
  position: absolute;
  width: 26px;
  height: 26px;
  border: 0 solid rgba($gold, 0.32);

  &.is-tl {
    top: 0;
    left: 0;
    border-top-width: 1px;
    border-left-width: 1px;
  }
  &.is-tr {
    top: 0;
    right: 0;
    border-top-width: 1px;
    border-right-width: 1px;
  }
  &.is-bl {
    bottom: 0;
    left: 0;
    border-bottom-width: 1px;
    border-left-width: 1px;
  }
  &.is-br {
    bottom: 0;
    right: 0;
    border-bottom-width: 1px;
    border-right-width: 1px;
  }
}

.home-frame__line {
  position: absolute;
  left: 50%;
  width: min(280px, 26vw);
  height: 1px;
  transform: translateX(-50%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba($gold, 0.22),
    transparent
  );

  &.is-top {
    top: 0;
  }
  &.is-bottom {
    bottom: 0;
  }
}

@keyframes frameIn {
  from {
    opacity: 0;
    transform: scale(0.985);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.home-side {
  position: fixed;
  right: 30px;
  top: 50%;
  z-index: 4;
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-family: $font-serif;
  font-size: 13px;
  letter-spacing: 0.42em;
  color: rgba($gold, 0.34);
  text-shadow: 0 0 14px rgba($red, 0.35);
  pointer-events: none;
  transform: translateY(-50%);
  animation: sideIn 2.4s cubic-bezier(0.16, 1, 0.3, 1) 1.1s both;
}

@keyframes sideIn {
  from {
    opacity: 0;
    transform: translate(10px, -50%);
  }
  to {
    opacity: 1;
    transform: translate(0, -50%);
  }
}

@media (max-width: 1100px) {
  .home-side {
    display: none;
  }
  .home-frame {
    inset: 12px;
  }
  .home-frame__corner {
    width: 18px;
    height: 18px;
  }
}

/* ============================================================
   竖排台词墨迹 · 水墨色
   ============================================================ */
.ink-stage {
  position: absolute;
  inset: 0;
  z-index: 4;
  overflow: hidden;
  pointer-events: none;
}

.ink-column {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  transform: translate(-50%, -50%) rotate(var(--rot, 0deg));
  opacity: 0;
  will-change: opacity, transform;
  animation: inkColumnBreath var(--dur, 8600ms) cubic-bezier(0.37, 0, 0.24, 1)
    forwards;
}

.ink-column__text {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-family: $font-serif;
  font-size: var(--fs, 18px);
  font-weight: 400;
  line-height: 1.75;
  letter-spacing: 0.16em;
  white-space: normal;
  max-height: min(52vh, 460px);

  /* 水墨色：暖白为底，绯红与紫电作极淡晕染 */
  color: rgba(253, 244, 245, 0.8);
  text-shadow: 0 0 10px rgba(255, 58, 86, 0.3), 0 0 30px rgba(192, 20, 47, 0.2),
    0 0 66px rgba(106, 58, 224, 0.12);
}

.ink-column__seal {
  width: 5px;
  height: 5px;
  border-radius: 1px;
  transform: rotate(45deg);
  background: rgba(194, 160, 97, 0.72);
  box-shadow: 0 0 8px 1px rgba(255, 58, 86, 0.55);
}

@keyframes inkColumnBreath {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) translateY(14px)
      scale(0.98);
  }
  14% {
    opacity: 0.94;
    transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) translateY(0)
      scale(1);
  }
  48% {
    opacity: 0.72;
    transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) translateY(-6px)
      scale(1.004);
  }
  78% {
    opacity: 0.3;
    transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) translateY(-14px)
      scale(1.01);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) translateY(-26px)
      scale(1.03);
  }
}

/* ============================================================
   主视觉
   ============================================================ */
.hero {
  position: relative;
  z-index: 5;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 220px);
  padding: clamp(100px, 15vh, 170px) 24px clamp(40px, 7vh, 80px);
  text-align: center;
}

/* 小标：身份分段 + 菱形节点 */
.hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 0 clamp(26px, 4vh, 40px);
  font-size: 12px;
  letter-spacing: 0.4em;
  color: rgba(194, 160, 97, 0.88);
  animation: fadeUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
}

.hero__eyebrow-text {
  text-indent: 0.4em;
  text-shadow: 0 0 18px rgba(194, 160, 97, 0.5);
}

.hero__eyebrow-dot {
  width: 4px;
  height: 4px;
  flex-shrink: 0;
  transform: rotate(45deg);
  background: rgba(255, 58, 86, 0.85);
  box-shadow: 0 0 8px rgba(255, 58, 86, 0.7);
}

.hero__eyebrow-line {
  width: 38px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(194, 160, 97, 0.75));

  &:last-child {
    background: linear-gradient(90deg, rgba(194, 160, 97, 0.75), transparent);
  }
}

/* 主名 */
.hero__title {
  display: flex;
  gap: 0.06em;
  margin: 0;
  font-family: $font-serif;
  font-size: clamp(68px, 15vw, 190px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.03em;
  perspective: 1000px;
  /* 光晕交给外层伪元素的 opacity 呼吸，替代在大字上跑 filter 掉帧 */
  position: relative;
  isolation: isolate;

  &::after {
    content: "";
    position: absolute;
    inset: -8% -6%;
    z-index: -1;
    background: radial-gradient(
      ellipse at 50% 55%,
      rgba(192, 20, 47, 0.32) 0%,
      rgba(106, 58, 224, 0.14) 46%,
      transparent 72%
    );
    filter: blur(26px);
    animation: titleBreath 6.5s ease-in-out 1.2s infinite;
    pointer-events: none;
  }
}

.hero__title-char {
  display: inline-block;
  color: transparent;
  background: linear-gradient(
    180deg,
    $paper 0%,
    $mirror 38%,
    $gold-lt 70%,
    $gold 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transform-origin: 50% 100%;
  animation: charRise 1.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(0.28s + var(--i) * 0.13s);
}

/* 拉丁名 */
.hero__latin {
  margin: 20px 0 0;
  font-family: "Cinzel", "Times New Roman", serif;
  font-size: clamp(10px, 1vw, 13px);
  letter-spacing: 0.95em;
  text-indent: 0.95em;
  color: rgba(255, 138, 155, 0.6);
  text-shadow: 0 0 22px rgba(192, 20, 47, 0.6);
  animation: fadeUp 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.62s both;
}

/* 赤金分隔线 */
.hero__divider {
  position: relative;
  display: block;
  width: 76px;
  height: 1px;
  margin: clamp(24px, 3.6vh, 36px) auto 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(194, 160, 97, 0.55),
    rgba(255, 58, 86, 0.6),
    rgba(194, 160, 97, 0.55),
    transparent
  );
  opacity: 0;
  animation: dividerIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    transform: translate(-50%, -50%) rotate(45deg);
    background: rgba(255, 58, 86, 0.85);
    box-shadow: 0 0 9px 1px rgba(255, 58, 86, 0.65);
  }
}

@keyframes dividerIn {
  from {
    opacity: 0;
    transform: scaleX(0.2);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

/* 藏头诗 */
.hero__verse {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: clamp(22px, 3.4vh, 34px);
  font-family: $font-serif;
  font-size: clamp(13px, 1.25vw, 17px);
  font-weight: 400;
  line-height: 1.9;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  color: rgba(253, 244, 245, 0.8);
  text-shadow: 0 0 26px rgba(192, 20, 47, 0.5),
    0 0 60px rgba(106, 58, 224, 0.22);

  p {
    margin: 0;
    animation: fadeUp 1.3s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(0.9s + var(--i) * 0.16s);
  }
}

/* ============================================================
   页脚
   ============================================================ */
.site-footer {
  position: relative;
  z-index: 6;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px 24px 44px;
  text-align: center;
}


.site-footer__quote {
  position: relative;
  margin: 0;
  font-family: $font-serif;
  font-size: clamp(14px, 1.2vw, 17px);
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  color: rgba(242, 221, 171, 0.9);
  text-shadow: 0 0 18px rgba(194, 160, 97, 0.42),
    0 0 46px rgba(192, 20, 47, 0.3);
  opacity: 0;
  animation: footerQuoteIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards;
}

.site-footer__aside {
  margin: -4px 0 0;
  font-family: $font-serif;
  font-size: clamp(12px, 0.95vw, 13.5px);
  letter-spacing: 0.12em;
  color: rgba(194, 160, 97, 0.42);
  opacity: 0;
  animation: footerQuoteIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 1.3s forwards;
}

.quote-mark {
  font-size: 0.82em;
  color: rgba(255, 58, 86, 0.7);
  text-shadow: 0 0 14px rgba(255, 58, 86, 0.8);
}

.site-footer__rule {
  display: flex;
  align-items: center;
  gap: 0;
  width: min(320px, 64vw);
  opacity: 0;
  animation: footerRuleIn 1.3s cubic-bezier(0.16, 1, 0.3, 1) 1.34s forwards;
}

.rule-wing {
  flex: 1;
  height: 1px;

  &--left {
    background: linear-gradient(
      90deg,
      transparent,
      rgba(194, 160, 97, 0.6),
      rgba(255, 58, 86, 0.75)
    );
  }

  &--right {
    background: linear-gradient(
      90deg,
      rgba(255, 58, 86, 0.75),
      rgba(194, 160, 97, 0.6),
      transparent
    );
  }
}

.rule-lock {
  position: relative;
  width: 9px;
  height: 9px;
  margin: 0 10px;
  transform: rotate(45deg);
  border: 1px solid rgba(255, 58, 86, 0.85);
  background: rgba(192, 20, 47, 0.35);
  box-shadow: 0 0 12px 2px rgba(255, 58, 86, 0.65),
    inset 0 0 6px rgba(255, 138, 155, 0.5);
  animation: lockBreath 3.4s ease-in-out infinite;
}

.site-footer__copy {
  margin: 0;
  font-family: $font-serif;
  font-size: clamp(10px, 0.9vw, 12px);
  letter-spacing: 0.24em;
  text-indent: 0.24em;
  color: rgba(233, 221, 224, 0.48);
  opacity: 0;
  animation: footerCopyIn 1.3s cubic-bezier(0.16, 1, 0.3, 1) 1.58s forwards;
}

/* ============================================================
   页脚动画
   ============================================================ */
@keyframes footerChainIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes footerQuoteIn {
  from {
    opacity: 0;
    transform: translateY(14px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes footerRuleIn {
  from {
    opacity: 0;
    transform: scaleX(0.3);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

@keyframes footerCopyIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes chainPulse {
  0%,
  100% {
    box-shadow: 0 0 10px 1px rgba(255, 58, 86, 0.55);
  }
  50% {
    box-shadow: 0 0 18px 3px rgba(255, 58, 86, 0.9);
  }
}

@keyframes lockBreath {
  0%,
  100% {
    box-shadow: 0 0 12px 2px rgba(255, 58, 86, 0.6),
      inset 0 0 6px rgba(255, 138, 155, 0.4);
  }
  50% {
    box-shadow: 0 0 22px 4px rgba(255, 58, 86, 0.95),
      inset 0 0 9px rgba(255, 138, 155, 0.65);
  }
}

/* ============================================================
   通用动画
   ============================================================ */
@keyframes charRise {
  from {
    opacity: 0;
    transform: translateY(80px) rotateX(-55deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(26px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes titleBreath {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1.03);
  }
}

/* ============================================================
   响应式
   ============================================================ */
@media (max-width: 900px) {
  .ink-column__text {
    font-size: 15px;
    max-height: 44vh;
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: calc(100vh - 230px);
    padding: 90px 20px 30px;
  }

  .hero__eyebrow {
    gap: 10px;
    font-size: 10px;
    letter-spacing: 0.3em;
  }

  .hero__eyebrow-line {
    width: 22px;
  }

  .hero__verse {
    margin-top: 20px;
    font-size: 12px;
    letter-spacing: 0.18em;
    text-indent: 0.18em;
    gap: 8px;
  }

  .hero__divider {
    width: 56px;
    margin-top: 20px;
  }

  .ink-column__text {
    font-size: 14px;
    letter-spacing: 0.12em;
    max-height: 38vh;
  }

  .ink-column {
    gap: 10px;
  }

  .site-footer {
    gap: 12px;
    padding: 24px 20px 34px;
  }

  .site-footer__quote {
    letter-spacing: 0.2em;
    text-indent: 0.2em;
  }
}

/* 减少动效偏好 */
@media (prefers-reduced-motion: reduce) {
  .hero__eyebrow,
  .hero__title,
  .hero__title-char,
  .hero__latin,
  .hero__divider,
  .hero__verse p,
 
  .site-footer__quote,
  .site-footer__rule,
  .site-footer__copy {
    animation: none !important;
    opacity: 1 !important;
    filter: none !important;
    transform: none !important;
  }

  .chain-dot--mid,
  .rule-lock {
    animation: none !important;
  }

  .hero__divider::after {
    box-shadow: none;
  }

  .ink-column {
    animation-duration: 1ms !important;
    opacity: 0 !important;
  }
}
</style>
