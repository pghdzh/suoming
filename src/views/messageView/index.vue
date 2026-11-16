<template>
  <div class="suoming-board">
    <!-- ===== 背景层 ===== -->
    <div class="bg-layer" aria-hidden="true">
      <!-- 背景轮播 (加了血色滤镜) -->
      <div class="bg-carousel">
        <img
          v-for="(src, idx) in currentBgImages"
          :key="idx"
          :src="src"
          class="bg-image"
          :class="{ active: idx === currentIndex }"
        />
        <div class="bg-tint"></div>
      </div>

      <!-- 伞骨暗影 -->
      <div class="bg-umbrella">
        <span class="umb-ring umb-ring--outer"></span>
        <span class="umb-ring umb-ring--inner"></span>
      </div>

      <!-- 旋转锁链 / 机关轨道 -->
      <div class="bg-orbit bg-orbit--red"></div>
      <div class="bg-orbit bg-orbit--violet"></div>

      <!-- 余烬 / 频率粒子 -->
      <div class="bg-embers">
        <span
          v-for="(p, i) in embers"
          :key="i"
          :style="{
            left: p.left + '%',
            top: p.top + '%',
            animationDuration: p.dur + 's',
            animationDelay: p.delay + 's',
            background: p.color,
            boxShadow: `0 0 10px ${p.color}`,
          }"
        ></span>
      </div>

      <!-- 质感与暗角 -->
      <span class="bg-grain"></span>
      <span class="bg-vignette"></span>
    </div>

    <!-- ===== 主布局 ===== -->
    <div class="main-layout">
      <!-- ===== 左侧：立绘 + 表单 ===== -->
      <aside class="left-panel">
        <!-- 角色卡片 (机关锁匣) -->
        <div class="hero-card" v-reveal>
          <span class="hero-aura" aria-hidden="true"></span>

          <div class="hero-frame">
            <img
              src="@/assets/images2/suoming-slty (4).webp"
              alt="锁暝"
              class="hero-img"
              loading="eager"
            />
            <span class="hero-veil"></span>
            <!-- 四角锁扣 -->
            <span class="hero-corner tl"></span>
            <span class="hero-corner tr"></span>
            <span class="hero-corner bl"></span>
            <span class="hero-corner br"></span>
          </div>

          <div class="hero-label">
            <span class="label-mark">✦</span>
            <span class="label-main">锁暝</span>
            <span class="label-en">SUOMING</span>
            <span class="label-mark">✦</span>
          </div>
          <p class="hero-title">禁锁十契 · 契主</p>
        </div>

        <!-- 引言与计数 -->
        <div class="hero-quote">
          <p class="quote-text">「伞下故影，锁尽妄执」</p>
          <p class="quote-count">
            已铭刻 <span class="count-num">{{ totalCount }}</span> 道频率
          </p>
        </div>

        <!-- 频率铭刻匣 (表单) -->
        <div class="form-box">
          <div class="box-top">
            <span class="box-line"></span>
            <span class="box-title">频率铭刻</span>
            <span class="box-line"></span>
          </div>
         

          <input
            v-model="name"
            type="text"
            placeholder="留名（契主 / 匿名）"
            class="input-name"
            maxlength="12"
            @keydown.enter.prevent
          />
          <textarea
            v-model="content"
            placeholder="在此留下你想传递的频率……"
            @keydown.ctrl.enter.prevent="submitMessage"
            @input="autoGrow"
            ref="textareaRef"
            maxlength="150"
          ></textarea>

          <div class="form-foot">
            <span class="form-hint">
              <span v-if="content.length">{{ 150 - content.length }} 字余量</span>
              <span v-else>Ctrl + Enter 快速发送</span>
            </span>
            <button
              class="submit-btn"
              @click="submitMessage"
              :disabled="isSending || !content.trim()"
            >
              <span class="btn-shine"></span>
              <span class="btn-text">{{ isSending ? "铭刻中…" : "结契" }}</span>
            </button>
          </div>

          <p v-if="sendError" class="form-error" role="alert">{{ sendError }}</p>
        </div>
      </aside>

      <!-- ===== 右侧：契约卷宗列表 ===== -->
      <section class="right-panel">
        <div class="scroll-container">
          <div class="list-container">
            <transition-group name="msg" tag="div" class="transition-wrap">
              <!-- 骨架屏 -->
              <div
                v-if="loading && messages.length === 0"
                class="skeleton-wrap"
                key="skeleton"
              >
                <div class="skeleton" v-for="i in 4" :key="i">
                  <div class="sk-dot"></div>
                  <div class="sk-lines">
                    <div class="sk-line short"></div>
                    <div class="sk-line"></div>
                  </div>
                </div>
              </div>

              <!-- 契约契纸 -->
              <article
                v-for="(msg, idx) in messages"
                :key="msg.id || msg._tempId || idx"
                class="contract-slip"
                :class="{
                  'slip-left': idx % 2 === 0,
                  'slip-right': idx % 2 === 1,
                }"
              >
                <span class="slip-lock" aria-hidden="true"></span>
                <span class="slip-glow" aria-hidden="true"></span>

                <header class="slip-meta">
                  <span class="slip-name">{{ msg.name || "无名频率" }}</span>
                  <span class="slip-time">{{
                    formatTime(msg.created_at)
                  }}</span>
                </header>
                <p class="slip-content">{{ msg.content }}</p>
                <span class="slip-mark" aria-hidden="true">✦</span>
              </article>
            </transition-group>

            <!-- 卷轴断了：跟「空着」区分开 -->
            <div
              v-if="!loading && loadError"
              class="empty-slip empty-slip--error"
              role="alert"
            >
              <span class="empty-slip__seal is-broken" aria-hidden="true">断</span>
              <p class="empty-slip__title">契纸没递过来</p>
              <p class="empty-slip__desc">{{ loadError }}</p>
              <button
                class="empty-slip__btn"
                @click="loadMessages(1, false)"
                type="button"
              >
                再取一次
              </button>
            </div>

            <!-- 一卷契约都没有的时候，别只留白 -->
            <div
              v-else-if="!loading && messages.length === 0"
              class="empty-slip"
              role="status"
            >
              <span class="empty-slip__seal" aria-hidden="true">契</span>
              <p class="empty-slip__title">契纸还空着</p>
              <p class="empty-slip__desc">
                第一道频率总是最难落笔——<br />但伞下一直有人在等。
              </p>
              <button
                class="empty-slip__btn"
                @click="focusComposer"
                type="button"
              >
                去写第一句
              </button>
            </div>

            <div ref="sentinel" class="sentinel"></div>

            <div v-if="loadingMore" class="loading-more">
              <span class="loading-dot"></span>
              <span class="loading-dot"></span>
              <span class="loading-dot"></span>
              <span class="loading-text">解析中……</span>
            </div>
            <div v-if="!hasMore && messages.length > 0" class="end-message">
              —— 锁链尽头，静候故人 ——
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { getMessageList, createMessage } from "@/api/modules/message";

/* ===== 分页状态 ===== */
const messages = ref<any[]>([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 20;
const hasMore = ref(true);
const loading = ref(true);
const loadingMore = ref(false);
let observer: IntersectionObserver | null = null;

/* ===== 表单状态 ===== */
const name = ref(localStorage.getItem("message_name") || "");
const content = ref("");
const isSending = ref(false);
const sendError = ref("");
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const sentinel = ref<HTMLElement | null>(null);

/* ===== 余烬/频率粒子 ===== */
const colors = ["#ff3a56", "#c2a061", "#a98bff", "#ff8a9b"];
const embers = Array.from({ length: 24 }, () => ({
  left: Math.random() * 96 + 2,
  top: Math.random() * 92 + 4,
  dur: 10 + Math.random() * 10,
  delay: -Math.random() * 20,
  color: colors[Math.floor(Math.random() * colors.length)],
}));

/* ===== 数据获取 ===== */
const loadError = ref("");

const loadMessages = async (page: number, append = false) => {
  if (page === 1) loading.value = true;
  else loadingMore.value = true;
  if (page === 1) loadError.value = "";

  try {
    const res = await getMessageList({ page, pageSize });
    const newData = Array.isArray(res?.data) ? res.data : [];
    const pagination = res?.pagination ?? { total: 0, totalPages: 1 };
    const totalPages = Number(pagination.totalPages) || 1;

    if (append) {
      messages.value = [...messages.value, ...newData];
    } else {
      messages.value = newData;
    }
    totalCount.value = Number(pagination.total) || 0;
    hasMore.value = page < totalPages;
    currentPage.value = page;
    await nextTick();
  } catch (err) {
    console.error(err);
    /* 首屏失败时别只显示「契纸还空着」，那是另一回事 */
    if (!append) loadError.value = "契纸一时取不回来，稍后再看。";
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadNextPage = () => {
  if (!hasMore.value || loadingMore.value) return;
  loadMessages(currentPage.value + 1, true);
};

/* ===== 提交留言 ===== */
const submitMessage = async () => {
  const text = content.value.trim();
  if (!text || isSending.value) return;
  isSending.value = true;
  sendError.value = "";
  const payload = { name: name.value.trim() || "无名频率", content: text };
  try {
    localStorage.setItem("message_name", name.value.trim());
    /* 先等接口成功再清空，失败时稿子还在框里 */
    await createMessage(payload);
    content.value = "";
    await nextTick();
    if (textareaRef.value) textareaRef.value.style.height = "auto";
    currentPage.value = 1;
    hasMore.value = true;
    await loadMessages(1, false);
  } catch (err) {
    console.error(err);
    sendError.value = "频率没能寄出去，稿子还在框里——再试一次？";
  } finally {
    isSending.value = false;
  }
};

/* 空状态里那句「去写第一句」 */
const focusComposer = () => {
  textareaRef.value?.focus();
};

/* ===== 辅助函数 ===== */
const formatTime = (time: string) => {
  if (!time) return "";
  const d = new Date(time);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  if (sameDay) return `今天 ${hh}:${mm}`;

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
};

const autoGrow = () => {
  const ta = textareaRef.value;
  if (!ta) return;
  ta.style.height = "auto";
  const h = Math.min(ta.scrollHeight, 160);
  ta.style.height = h + "px";
};

/* ===== 背景轮播 ===== */
/* 只挑 5 张体积合适的：原来 glob 全量 eager 会把 images1+images2 共约 15MB 全打进包 */
import bgD1 from "@/assets/images1/1 (3).webp";
import bgD2 from "@/assets/images1/1 (4).webp";
import bgD3 from "@/assets/images1/1 (5).webp";
import bgD4 from "@/assets/images1/1 (7).webp";
import bgD5 from "@/assets/images1/1.webp";

import bgM1 from "@/assets/images2/suoming-slty (1).webp";
import bgM2 from "@/assets/images2/suoming-slty (2).webp";
import bgM3 from "@/assets/images2/suoming-slty (5).webp";
import bgM4 from "@/assets/images2/suoming-slty (6).webp";
import bgM5 from "@/assets/images2/suoming-slty (7).webp";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const randomFive = ref<string[]>(shuffle([bgD1, bgD2, bgD3, bgD4, bgD5]));
const randomFive2 = ref<string[]>(shuffle([bgM1, bgM2, bgM3, bgM4, bgM5]));
const isMobile = ref<boolean>(
  typeof window !== "undefined" ? window.innerWidth <= 768 : false
);
const currentBgImages = computed(() =>
  isMobile.value ? randomFive2.value : randomFive.value
);
const currentIndex = ref(0);
let Imgtimer: number | undefined;

/* ===== 生命周期 ===== */
onMounted(async () => {
  await loadMessages(1, false);

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loadingMore.value) {
        loadNextPage();
      }
    },
    { threshold: 0.5 }
  );
  if (sentinel.value) observer.observe(sentinel.value);

  Imgtimer = window.setInterval(() => {
    const len = currentBgImages.value.length;
    if (len > 0) {
      currentIndex.value = (currentIndex.value + 1) % len;
    }
  }, 5200);

  window.addEventListener("resize", handleResize);
  nextTick(() => autoGrow());
});

function handleResize() {
  isMobile.value = window.innerWidth <= 768;
}

onUnmounted(() => {
  if (observer) observer.disconnect();
  if (Imgtimer) clearInterval(Imgtimer);
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped lang="scss">
/* ============================================================
   锁暝配色
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

$paper: #fdf4f5;

$font-title: "MaShanZheng", serif;
$font-body: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong",
  "SimSun", serif;

/* ============================================================
   通用动画
   ============================================================ */
@keyframes spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@keyframes floatUp {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  80% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-200px) scale(0.5);
    opacity: 0;
  }
}
@keyframes auraBreath {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(0.96);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}
@keyframes pulseDot {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* ============================================================
   页面骨架
   ============================================================ */
.suoming-board {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, $ink 0%, $ink-2 55%, $ink 100%);
  font-family: $font-body;
  color: $paper;
  overflow: hidden;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  font-size: 16px;
}

/* ============================================================
   背景层
   ============================================================ */
.bg-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-carousel {
  position: absolute;
  inset: 0;
  .bg-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 1.8s ease;
    /* 统一调色为黑红/暗金调 */
    filter: sepia(0.6) hue-rotate(-30deg) saturate(1.8) contrast(1.2)
      brightness(0.6);
    &.active {
      opacity: 1;
    }
  }
  .bg-tint {
    position: absolute;
    inset: 0;
    background: radial-gradient(
        ellipse at 30% 30%,
        rgba($red, 0.25) 0%,
        transparent 60%
      ),
      radial-gradient(
        ellipse at 80% 70%,
        rgba($violet, 0.15) 0%,
        transparent 60%
      ),
      linear-gradient(
        90deg,
        rgba($ink, 0.95) 0%,
        rgba($ink, 0.6) 40%,
        rgba($ink, 0.85) 100%
      );
  }
}

/* 伞骨光环 */
.bg-umbrella {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120vw;
  height: 120vw;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.umb-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  &--outer {
    width: 100%;
    height: 100%;
    border: 1px dashed rgba($red, 0.15);
    animation: spin 60s linear infinite;
  }
  &--inner {
    width: 70%;
    height: 70%;
    border: 1px solid rgba($gold, 0.1);
    animation: spin 45s linear infinite reverse;
  }
}

/* 旋转锁链 */
.bg-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 2px solid transparent;
  &--red {
    width: 80vmax;
    height: 80vmax;
    transform: translate(-50%, -50%);
    border-top-color: rgba($red-lt, 0.2);
    border-bottom-color: rgba($red-lt, 0.2);
    animation: spin 40s linear infinite;
  }
  &--violet {
    width: 95vmax;
    height: 95vmax;
    transform: translate(-50%, -50%);
    border-left-color: rgba($violet, 0.15);
    border-right-color: rgba($violet, 0.15);
    animation: spin 55s linear infinite reverse;
  }
}

/* 余烬 */
.bg-embers {
  position: absolute;
  inset: 0;
  span {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    opacity: 0;
    animation: floatUp linear infinite;
  }
}

.bg-grain {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.bg-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 30%, $ink 90%);
}

/* ============================================================
   主布局
   ============================================================ */
.main-layout {
  position: relative;
  z-index: 10;
  display: flex;
  flex: 1;
  overflow: hidden;
  padding-top: 40px;
}

/* ============================================================
   左侧面板
   ============================================================ */
.left-panel {
  flex: 0 0 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 20px 240px;
  gap: 24px;
  position: relative;
}

/* 角色卡片 (机关锁匣) */
.hero-card {
  position: relative;
  width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0 0;
}

.hero-aura {
  position: absolute;
  top: 5%;
  left: 50%;
  width: 320px;
  height: 320px;
  margin-left: -160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba($red, 0.3) 0%, transparent 70%);
  filter: blur(40px);
  animation: auraBreath 5s ease-in-out infinite;
  z-index: 0;
}

.hero-frame {
  position: relative;
  z-index: 2;
  width: 240px;
  height: 320px;
  background: $ink-3;
  border: 1px solid rgba($gold, 0.3);
  box-shadow: 0 0 30px -5px rgba($red, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
  transition: transform 0.7s ease;
  filter: contrast(1.1) saturate(0.95);
}

.hero-frame:hover .hero-img {
  transform: scale(1.05);
}

.hero-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba($ink-2, 0.9) 100%);
  pointer-events: none;
}

/* 四角金属锁扣 */
.hero-corner {
  position: absolute;
  width: 18px;
  height: 18px;
  pointer-events: none;
  z-index: 3;

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: $red-lt;
    box-shadow: 0 0 8px rgba($red, 0.8);
  }
  &::before {
    width: 100%;
    height: 1px;
  }
  &::after {
    width: 1px;
    height: 100%;
  }

  &.tl {
    top: 8px;
    left: 8px;
    &::before {
      top: 0;
      left: 0;
    }
    &::after {
      top: 0;
      left: 0;
    }
  }
  &.tr {
    top: 8px;
    right: 8px;
    &::before {
      top: 0;
      right: 0;
    }
    &::after {
      top: 0;
      right: 0;
    }
  }
  &.bl {
    bottom: 8px;
    left: 8px;
    &::before {
      bottom: 0;
      left: 0;
    }
    &::after {
      bottom: 0;
      left: 0;
    }
  }
  &.br {
    bottom: 8px;
    right: 8px;
    &::before {
      bottom: 0;
      right: 0;
    }
    &::after {
      bottom: 0;
      right: 0;
    }
  }
}

/* 名字标签 */
.hero-label {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  padding: 6px 24px;
  background: linear-gradient(135deg, rgba($blood, 0.8), rgba($ink, 0.9));
  border: 1px solid rgba($gold, 0.4);
  box-shadow: 0 4px 20px rgba($red, 0.4), inset 0 0 10px rgba($gold, 0.1);

  .label-mark {
    font-size: 10px;
    color: $red-lt;
  }

  .label-main {
    font-family: $font-title;
    font-size: 24px;
    letter-spacing: 0.1em;
    color: $paper;
    text-shadow: 0 0 10px rgba($red, 0.8);
    line-height: 1;
  }

  .label-en {
    font-family: "Cinzel", serif;
    font-size: 12px;
    letter-spacing: 0.2em;
    color: $gold-lt;
    padding-left: 8px;
    border-left: 1px solid rgba($gold, 0.3);
    line-height: 1;
  }
}

.hero-title {
  position: relative;
  z-index: 3;
  margin: 10px 0 0;
  font-size: 14px;
  letter-spacing: 0.2em;
  color: rgba($paper, 0.5);
}

/* 引言计数 */
.hero-quote {
  text-align: center;
  margin-top: 10px;

  .quote-text {
    margin: 0 0 8px;
    font-family: $font-title;
    font-size: 20px;
    letter-spacing: 0.1em;
    color: $gold-lt;
    text-shadow: 0 0 12px rgba($red, 0.5);
  }

  .quote-count {
    margin: 0;
    font-size: 13px;
    color: rgba($paper, 0.6);

    .count-num {
      font-family: "Cinzel", serif;
      font-size: 18px;
      font-weight: 700;
      color: $red-glow;
      text-shadow: 0 0 12px rgba($red, 0.8);
      padding: 0 4px;
    }
  }
}

/* ============================================================
   表单 (频率铭刻匣)
   ============================================================ */
.form-box {
  position: fixed;
  left: 120px;
  bottom: 20px;
  width: 420px;
  z-index: 30;
  background: rgba($ink-2, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid rgba($gold, 0.2);
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.8),
    inset 0 0 20px rgba($red, 0.05);

  /* 顶部金线 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba($gold, 0.8),
      transparent
    );
  }

  .box-top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 4px;

    .box-title {
      font-size: 15px;
      font-weight: bold;
      color: $gold-lt;
      letter-spacing: 0.15em;
    }
    .box-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba($gold, 0.3),
        transparent
      );
    }
  }

  .box-note {
    margin: 0 0 10px;
    text-align: center;
    font-family: var(--sm-font-title);
    font-size: 12.5px;
    letter-spacing: 0.08em;
    color: rgba($gold, 0.45);
  }

  input,
  textarea {
    background: rgba($ink, 0.6);
    border: 1px solid rgba($gold, 0.15);
    border-radius: 2px;
    padding: 12px;
    font-size: 15px;
    color: $paper;
    outline: none;
    font-family: inherit;
    resize: none;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.3s ease;

    &::placeholder {
      color: rgba($paper, 0.3);
    }
    &:focus {
      border-color: rgba($red, 0.6);
    }
  }

  .input-name {
    height: 44px;
  }
  textarea {
    min-height: 80px;
    max-height: 160px;
    line-height: 1.6;
  }

  .form-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 4px;

    .form-hint {
      font-size: 12px;
      color: rgba($paper, 0.4);
    }

    .submit-btn {
      position: relative;
      background: linear-gradient(135deg, $blood, $red);
      border: 1px solid $red-lt;
      padding: 10px 28px;
      border-radius: 2px;
      font-family: $font-title;
      font-size: 18px;
      color: $paper;
      letter-spacing: 0.2em;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba($red, 0.3);

      .btn-shine {
        position: absolute;
        top: -50%;
        left: -100%;
        width: 50%;
        height: 200%;
        background: linear-gradient(
          to right,
          transparent,
          rgba(255, 255, 255, 0.3),
          transparent
        );
        transform: skewX(-25deg);
        transition: left 0.5s;
        pointer-events: none;
      }

      .btn-text {
        position: relative;
        z-index: 1;
      }

      &:hover:not(:disabled) {
        box-shadow: 0 6px 20px rgba($red, 0.6);
        transform: translateY(-2px);
        .btn-shine {
          left: 150%;
        }
      }

      &:disabled {
        opacity: 0.5;
        animation: cursorAnimation_disabled 1s infinite step-start;
      }
    }
  }
}

/* ============================================================
   右侧面板 (契约卷宗)
   ============================================================ */
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px 40px 20px 20px;
}

.scroll-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 24px;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba($red, 0.4);
    border-radius: 2px;
    &:hover {
      background: $red-lt;
    }
  }
}

.list-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.transition-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 契约契纸 */
.contract-slip {
  position: relative;
  background: linear-gradient(135deg, rgba($ink-2, 0.85), rgba($ink-3, 0.95));
  backdrop-filter: blur(6px);
  border-radius: 2px;
  padding: 20px 28px;
  border: 1px solid rgba($gold, 0.15);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  max-width: 90%;
  overflow: hidden;

  &.slip-left {
    align-self: flex-start;
  }
  &.slip-right {
    align-self: flex-end;
  }

  &:hover {
    border-color: rgba($red-lt, 0.5);
    box-shadow: 0 8px 30px rgba($red, 0.15), inset 0 0 20px rgba($red, 0.05);
    transform: translateY(-2px);

    .slip-glow {
      opacity: 1;
    }
    .slip-lock {
      transform: translateY(-50%) rotate(45deg) scale(1.2);
      border-color: $red-lt;
    }
  }

  /* 边缘发光 */
  .slip-glow {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, $red-lt, transparent);
    opacity: 0.3;
    transition: opacity 0.3s;
  }
  &.slip-left .slip-glow {
    left: 0;
  }
  &.slip-right .slip-glow {
    right: 0;
  }

  /* 侧边锁扣 */
  .slip-lock {
    position: absolute;
    top: 50%;
    width: 8px;
    height: 8px;
    border: 1px solid rgba($gold, 0.5);
    transform: translateY(-50%) rotate(45deg);
    transition: all 0.3s;
    background: $ink;
    z-index: 2;
  }
  &.slip-left .slip-lock {
    left: -4px;
  }
  &.slip-right .slip-lock {
    right: -4px;
  }

  /* 内容 */
  .slip-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px dashed rgba($gold, 0.15);
    gap: 12px;

    .slip-name {
      font-family: $font-title;
      font-size: 18px;
      color: $gold-lt;
      letter-spacing: 0.08em;
      text-shadow: 0 0 10px rgba($gold, 0.3);
    }

    .slip-time {
      font-family: "Cinzel", serif;
      font-size: 12px;
      color: rgba($paper, 0.4);
      white-space: nowrap;
    }
  }

  .slip-content {
    margin: 0;
    font-size: 15px;
    line-height: 1.9;
    color: rgba($paper, 0.85);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .slip-mark {
    position: absolute;
    bottom: 8px;
    right: 12px;
    font-size: 12px;
    color: rgba($red, 0.3);
    pointer-events: none;
  }
}

/* 过渡动画 */
.msg-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.msg-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.msg-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.msg-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

/* 骨架屏 */
.skeleton-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.skeleton {
  display: flex;
  gap: 16px;
  padding: 20px 28px;
  background: rgba($ink-2, 0.7);
  border-radius: 2px;
  border: 1px solid rgba($gold, 0.1);
  max-width: 90%;
  &:nth-child(even) {
    align-self: flex-end;
  }
}
.sk-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba($gold, 0.2);
  animation: pulseDot 1.5s infinite;
}
.sk-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sk-line {
  height: 12px;
  border-radius: 2px;
  background: rgba($gold, 0.05);
  animation: pulseDot 1.5s infinite;
  &.short {
    width: 30%;
  }
}

.sentinel {
  height: 10px;
  width: 100%;
}

.loading-more {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 20px;
  color: rgba($gold, 0.6);
  font-size: 13px;
}
.loading-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: $gold;
  animation: pulseDot 1s infinite alternate;
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}
.end-message {
  text-align: center;
  padding: 30px;
  font-family: $font-title;
  font-size: 16px;
  color: rgba($gold, 0.4);
  letter-spacing: 0.1em;
}

/* 提交失败提示 */
.form-error {
  margin: 10px 0 0;
  font-size: 12px;
  line-height: 1.7;
  color: rgba($red-glow, 0.85);
}

/* 空卷宗 */
.empty-slip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin: 40px auto 0;
  padding: 38px 26px 34px;
  max-width: 420px;
  text-align: center;
  border: 1px dashed rgba($gold, 0.23);
  background: linear-gradient(
    180deg,
    rgba($ink-3, 0.4),
    rgba($ink, 0.3)
  );

  &__seal {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    margin-bottom: 10px;
    font-family: $font-title;
    font-size: 22px;
    color: #ffe9dd;
    background: linear-gradient(160deg, rgba($red, 0.85), rgba($blood, 0.7));
    border: 1px solid rgba($red-lt, 0.45);
    transform: rotate(-4deg);

    &.is-broken {
      background: linear-gradient(
        160deg,
        rgba($violet, 0.5),
        rgba($ink-3, 0.9)
      );
      border-color: rgba($violet-lt, 0.4);
      color: rgba($violet-lt, 0.95);
    }
  }

  &--error {
    border-color: rgba($violet-lt, 0.24);
    background: linear-gradient(
      180deg,
      rgba(26, 12, 34, 0.45),
      rgba($ink, 0.35)
    );
  }

  &__title {
    margin: 0;
    font-family: $font-title;
    font-size: 21px;
    letter-spacing: 0.1em;
    color: rgba($gold-lt, 0.9);
  }

  &__desc {
    margin: 0;
    font-size: 13px;
    line-height: 2;
    color: rgba($paper, 0.45);
  }

  &__btn {
    margin-top: 14px;
    padding: 8px 22px;
    font-size: 12.5px;
    letter-spacing: 0.18em;
    color: rgba($paper, 0.8);
    background: transparent;
    border: 1px solid rgba($gold, 0.32);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      color: $gold-lt;
      border-color: rgba($gold-lt, 0.7);
      background: rgba($blood, 0.22);
    }
  }
}

/* ============================================================
   响应式 (移动端)
   ============================================================ */
@media (max-width: 960px) {
  .main-layout {
    flex-direction: column;
    padding-top: 70px; /* 留出顶部空间 */
  }

  /* 移动端隐藏立绘，只保留简略标签 */
  .left-panel {
    flex: 0 0 auto;
    padding: 12px 16px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .hero-card {
    display: none;
  }
  .hero-quote {
    margin-top: 0;
    .quote-text {
      font-size: 16px;
      margin-bottom: 4px;
    }
    .quote-count {
      font-size: 12px;
    }
  }
  .form-hint {
    display: none;
  }
  .right-panel {
    padding: 10px 14px 0;
  }
  .scroll-container {
    padding-bottom: 200px;
  }

  .contract-slip {
    max-width: 95%;
    padding: 16px 20px;
    &.slip-left,
    &.slip-right {
      align-self: center;
    }
    .slip-meta .slip-name {
      font-size: 16px;
    }
    .slip-content {
      font-size: 14px;
    }
  }

  /* 表单改为底部固定悬浮 */
  .form-box {
    left: 12px;
    right: 12px;
    bottom: 12px;
    width: auto;
    max-width: none;
    padding: 14px 16px;
    .input-name {
      height: 40px;
    }
    textarea {
      min-height: 60px;
    }
    .form-foot .submit-btn {
      padding: 8px 20px;
      font-size: 16px;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .umb-ring,
  .bg-orbit,
  .bg-embers span,
  .hero-aura,
  .sk-dot,
  .sk-line,
  .loading-dot,
  .btn-shine {
    animation: none !important;
  }
  .contract-slip {
    transition: none !important;
  }
}
</style>
