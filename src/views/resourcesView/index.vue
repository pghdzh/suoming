<template>
  <div class="suoming-resources">
    <!-- ===== 动态背景：伞骨光晕 + 锁链 + 频率粒子 ===== -->
    <div class="bg-layer" aria-hidden="true">
      <!-- 伞骨旋转光环 -->
      <span class="umb-ring umb-ring--outer"></span>
      <span class="umb-ring umb-ring--inner"></span>

      <!-- 旋转锁链轨道 -->
      <div class="bg-orbit bg-orbit--red"></div>
      <div class="bg-orbit bg-orbit--violet"></div>

      <!-- 坠落的锁链 -->
      <div class="bg-chains">
        <span
          v-for="(c, i) in chainsBg"
          :key="'c-' + i"
          class="chain-thread"
          :style="{
            left: c.left + '%',
            animationDuration: c.dur + 's',
            animationDelay: c.delay + 's',
            opacity: c.opacity,
          }"
        ></span>
      </div>

      <!-- 升腾的频率粒子 -->
      <div class="bg-embers">
        <span
          v-for="(p, i) in embers"
          :key="'e-' + i"
          :style="{
            left: p.left + '%',
            animationDuration: p.dur + 's',
            animationDelay: p.delay + 's',
            background: p.color,
            boxShadow: `0 0 10px ${p.color}`,
          }"
        ></span>
      </div>

      <!-- 纹理与暗角 -->
      <span class="bg-grain"></span>
      <span class="bg-vignette"></span>
    </div>

    <!-- ===== 顶部横幅 ===== -->
    <header class="top-banner">
      <div class="banner-inner">
        <span class="banner-line banner-line--left" aria-hidden="true"></span>
        <div class="banner-text">
          <h1 class="banner-title">频率秘库</h1>
          <p class="banner-sub">
            S U O M I N G &nbsp;·&nbsp; R E S O U R C E S
          </p>
        </div>
        <span class="banner-line banner-line--right" aria-hidden="true"></span>
      </div>

      <div class="banner-meta">
        <span class="meta-poem">「伞下故影，锁尽妄执」</span>
        <span class="meta-divider">◆</span>
        <span class="meta-stat">
          共归档 <em>{{ resources.length }}</em> 份频率
        </span>
      </div>
    </header>

    <!-- ===== 主内容：左终端右档案 ===== -->
    <main class="main-content">
      <div class="layout">
        <!-- ===== 左侧：频率铭刻匣 ===== -->
        <aside class="form-column" v-reveal>
          <div class="form-box" :class="{ collapsed: uploaderCollapsed }">
            <!-- 顶部装饰金线 -->
            <span class="box-line-top" aria-hidden="true"></span>

            <div class="box-header" @click="toggleUploader">
              <span class="box-mark" aria-hidden="true">✦</span>
              <span class="box-title">频率铭刻</span>
              <span class="box-hint">上传锁暝相关资源链接</span>
              <span class="box-toggle">{{
                uploaderCollapsed ? "▸" : "▾"
              }}</span>
            </div>

            <transition name="form-slide">
              <form
                v-if="!uploaderCollapsed"
                @submit.prevent="addResource"
                class="lamp-form"
              >
                <div class="form-row">
                  <label class="field">
                    <span class="field-label">标识名称</span>
                    <input
                      v-model="form.title"
                      type="text"
                      placeholder="为这份频率命名"
                      aria-label="标题"
                      class="input-title"
                    />
                  </label>
                </div>

                <div class="form-row">
                  <label class="field">
                    <span class="field-label">目标链接</span>
                    <input
                      v-model="form.link"
                      type="url"
                      placeholder="https://…"
                      aria-label="链接"
                      class="input-link"
                    />
                  </label>
                </div>

                <div class="form-row two-col">
                  <label class="field">
                    <span class="field-label">类型</span>
                    <select
                      v-model="form.type"
                      aria-label="类型"
                      class="select-type"
                    >
                      <option
                        v-for="t in TYPE_OPTIONS"
                        :key="t"
                        :value="t"
                      >
                        {{ t }}
                      </option>
                    </select>
                  </label>
                  <label class="field">
                    <span class="field-label">契主署名</span>
                    <input
                      v-model="form.uploader"
                      type="text"
                      placeholder="可选"
                      aria-label="上传人"
                    />
                  </label>
                </div>

                <div class="form-actions">
                  <button
                    type="submit"
                    class="submit-btn"
                    :disabled="isSubmitting"
                  >
                    <span class="btn-shine"></span>
                    <span class="btn-text">
                      <span class="btn-mark" aria-hidden="true">✦</span>
                      {{ isSubmitting ? "铭刻中…" : "确认铭刻" }}
                    </span>
                  </button>
                </div>
              </form>
            </transition>

            <p v-show="!uploaderCollapsed" class="box-note">
              这里会有被填满的一天吗，<br />好期待。
            </p>
          </div>
        </aside>

        <!-- ===== 右侧：秘库档案列表 ===== -->
        <section class="list-column" v-reveal="{ delay: 90 }">
          <div class="list-header">
            <h2 class="list-title">
              <span class="list-mark" aria-hidden="true">✦</span>
              频率档案
              <span v-if="!loading" class="list-count"
                >共 {{ resources.length }} 份</span
              >
            </h2>
            <div class="sort-control">
              <span class="sort-label">排序</span>
              <select v-model="sortBy" class="sort-select">
                <option value="time">按归档时间</option>
                <option value="likes">按共鸣度</option>
              </select>
            </div>
          </div>

          <div class="resource-scroll">
            <transition-group name="resource" tag="div" class="lamp-list">
              <article
                v-for="item in sortedResources"
                :key="item.id"
                class="contract-slip"
              >
                <!-- 侧边能量引线 -->
                <span class="slip-glow" aria-hidden="true"></span>
                <!-- 菱形金属锁扣 -->
                <span class="slip-lock" aria-hidden="true"></span>

                <a
                  :href="item.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="slip-title"
                  :title="item.title"
                >
                  {{ item.title }}
                </a>

                <div class="slip-meta">
                  <div class="meta-left">
                    <span class="meta-uploader">{{
                      item.uploader || "无名频率"
                    }}</span>
                    <span class="meta-dot">·</span>
                    <span class="meta-time">{{ formatTime(item.time) }}</span>
                  </div>
                  <div class="meta-right">
                    <span class="meta-type">{{ item.type }}</span>
                    <button
                      @click.prevent="handleLike(item)"
                      :aria-pressed="likedIds.has(String(item.id))"
                      class="like-btn"
                      :class="{ active: likedIds.has(String(item.id)) }"
                    >
                      <span
                        class="heart"
                        :class="{ liked: likedIds.has(String(item.id)) }"
                      ></span>
                      <span class="like-count">{{ item.likes }}</span>
                    </button>
                  </div>
                </div>
              </article>
            </transition-group>

            <!-- 加载中：先给骨架，别急着喊「空空如也」 -->
            <div v-if="loading" class="skeleton-list" aria-hidden="true">
              <div
                v-for="n in 4"
                :key="n"
                class="skeleton-slip"
                :style="{ animationDelay: n * 0.12 + 's' }"
              ></div>
            </div>

            <div
              v-else-if="resources.length === 0"
              class="empty-message"
              role="status"
            >
              <span class="empty-message__seal" aria-hidden="true">空</span>
              <p class="empty-message__title">秘库还空着</p>
              <p class="empty-message__desc">
                左侧写下第一条频率，替后来的人留盏灯。
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- ===== 底部 ===== -->
    <footer class="foot">点击标识直接跳转 · 锁链尽头，静候故人</footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  getResourceList,
  createResource,
  likeResource,
} from "@/api/modules/resource";
import { ElMessage } from "element-plus";

interface Resource {
  id: number | string;
  title: string;
  uploader?: string;
  time: string;
  likes: number;
  link: string;
  type: string;
  role_key?: string;
}

const STORAGE_KEY = "suoming_resources_v1";
const DEFAULT_ROLE = "suoming";

/* 归档类型统一成这几类，避免线上散成「网页/网页分享/站外」 */
const TYPE_OPTIONS = ["网页", "视频", "图片", "文档", "其他"] as const;

function normalizeType(raw?: string) {
  const v = (raw || "").trim();
  if (!v) return "其他";
  const hit = TYPE_OPTIONS.find((t) => v === t || v.includes(t));
  return hit || "其他";
}

const form = ref<{
  title: string;
  uploader: string;
  link: string;
  type: string;
}>({
  title: "",
  uploader: "",
  link: "",
  type: "网页",
});

const resources = ref<Resource[]>([]);
const likedIds = ref(new Set<string>());
const sortBy = ref<"time" | "likes">("time");
const uploaderCollapsed = ref(false);
const loading = ref(true);
const hasLoaded = ref(false);
const isSubmitting = ref(false);

/* ===== 背景粒子生成 ===== */
const colors = ["#ff3a56", "#c2a061", "#a98bff", "#ff8a9b"];
const embers = Array.from({ length: 24 }, () => ({
  left: Math.random() * 96 + 2,
  dur: 10 + Math.random() * 10,
  delay: -Math.random() * 20,
  color: colors[Math.floor(Math.random() * colors.length)],
}));

const chainsBg = Array.from({ length: 12 }, () => ({
  left: Math.random() * 96 + 2,
  dur: 15 + Math.random() * 10,
  delay: -Math.random() * 20,
  opacity: 0.05 + Math.random() * 0.1,
}));

/* ===== 数据逻辑 ===== */
function mapServerToLocal(row: any): Resource {
  return {
    id: row.id,
    title: row.title,
    uploader: row.uploader || "无名频率",
    time: row.created_at || row.time || new Date().toISOString(),
    likes: row.likes ?? 0,
    link: row.link,
    type: normalizeType(row.storage_type || row.type),
    role_key: row.role_key,
  };
}

/* 历史点赞存在本地，先读出来——即便接口挂了也不该丢 */
function loadLikedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.liked)) {
      parsed.liked.forEach((id: string) => likedIds.value.add(String(id)));
    }
  } catch (e) {
    console.warn("本地点赞记录损坏，已忽略", e);
  }
}

async function loadResources() {
  loading.value = true;
  loadLikedIds();
  try {
    const res: any = await getResourceList({
      role_key: DEFAULT_ROLE,
      page: 1,
      pageSize: 100,
    });
    if (res && res.success && Array.isArray(res.data)) {
      resources.value = res.data.map(mapServerToLocal);
    } else if (res && res.success) {
      resources.value = [];
    } else {
      ElMessage.error("频率秘库暂时没有回应，稍后再试");
    }
  } catch (err) {
    console.warn("拉取资源失败", err);
    ElMessage.error("频率秘库暂时没有回应，稍后再试");
  } finally {
    loading.value = false;
    hasLoaded.value = true;
  }
}

function saveLocalCache() {
  try {
    const liked = Array.from(likedIds.value);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ liked }));
  } catch (e) {
    console.warn("保存本地缓存失败", e);
  }
}

onMounted(() => {
  loadResources();
  uploaderCollapsed.value = window.innerWidth <= 768;
});

function toggleUploader() {
  uploaderCollapsed.value = !uploaderCollapsed.value;
}

async function addResource() {
  const t = form.value.title.trim();
  const l = form.value.link.trim();
  if (!t || !l) {
    return ElMessage.warning("请填写完整的标识与链接");
  }
  if (!/^https?:\/\//i.test(l)) {
    return ElMessage.error("请输入正确的链接 (https开头)");
  }
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const payload = {
      title: t,
      uploader: form.value.uploader.trim() || "无名频率",
      link: l,
      storage_type: normalizeType(form.value.type),
      role_key: DEFAULT_ROLE,
    };
    const res: any = await createResource(payload);
    if (res && res.success && res.data) {
      const added = mapServerToLocal(res.data);
      resources.value.unshift(added);
      saveLocalCache();
      resetForm();
      ElMessage.success("铭刻成功");
      return;
    }
    if (res && res.success) {
      /* 只回 success 不回 data：东西其实已经进去了，别骗用户失败 */
      resetForm();
      ElMessage.success("铭刻成功");
      await loadResources();
      return;
    }
    ElMessage.error("铭刻失败，请检查内容后重试");
  } catch (err) {
    console.warn("创建资源失败", err);
    ElMessage.error("铭刻失败，请检查网络后重试");
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  form.value.title = "";
  form.value.uploader = "";
  form.value.link = "";
  form.value.type = "网页";
}

async function handleLike(item: Resource) {
  const id = item.id;
  const wasLiked = likedIds.value.has(String(id));
  if (wasLiked) {
    likedIds.value.delete(String(id));
    item.likes = Math.max(0, item.likes - 1);
  } else {
    likedIds.value.add(String(id));
    item.likes++;
  }
  saveLocalCache();

  try {
    const action = wasLiked ? "unlike" : "like";
    const res: any = await likeResource(id, action);
    if (
      res &&
      res.success &&
      res.data &&
      typeof res.data.likes !== "undefined"
    ) {
      item.likes = res.data.likes;
    }
  } catch (err) {
    console.warn("点赞接口调用失败，回滚本地状态", err);
    if (wasLiked) {
      likedIds.value.add(String(id));
      item.likes++;
    } else {
      likedIds.value.delete(String(id));
      item.likes = Math.max(0, item.likes - 1);
    }
    saveLocalCache();
  }
}

const sortedResources = computed(() => {
  const arr = [...resources.value];
  if (sortBy.value === "time") {
    arr.sort((a, b) => +new Date(b.time) - +new Date(a.time));
  } else {
    arr.sort((a, b) => b.likes - a.likes);
  }
  return arr;
});

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "时间不详";

  const now = new Date();
  /* 按自然日比较：23 小时前如果是昨天，就该说昨天 */
  const startOfDay = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDay = Math.round(
    (startOfDay(now) - startOfDay(d)) / (1000 * 60 * 60 * 24)
  );

  if (diffDay === 0) {
    return `今天 ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  }
  if (diffDay === 1) return "昨天";
  if (diffDay > 1 && diffDay < 7) return `${diffDay} 天前`;

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}
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
$font-en: "Cinzel", "Times New Roman", serif;
$font-mono: ui-monospace, "SF Mono", "Cascadia Mono", Consolas, monospace;

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
@keyframes chainFall {
  from {
    transform: translateY(-100%) rotate(1deg);
  }
  to {
    transform: translateY(100%) rotate(-1deg);
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
@keyframes titleShimmer {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: -240% 50%;
  }
}
@keyframes gradientWave {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes shineSweep {
  0% {
    left: -100%;
  }
  40% {
    left: 150%;
  }
  100% {
    left: 150%;
  }
}

/* ============================================================
   根容器
   ============================================================ */
.suoming-resources {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(180deg, $ink 0%, $ink-2 55%, $ink 100%);
  font-family: $font-body;
  color: $paper;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  font-size: 16px;
}

/* ============================================================
   动态背景
   ============================================================ */
.bg-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

/* 伞骨光环 */
.umb-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;

  &--outer {
    width: 120vw;
    height: 120vw;
    border: 1px dashed rgba($red, 0.15);
    animation: spin 60s linear infinite;
  }
  &--inner {
    width: 80vw;
    height: 80vw;
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
  pointer-events: none;

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

/* 锁链垂直坠落 */
.bg-chains {
  position: absolute;
  inset: 0;
  span {
    position: absolute;
    top: -20%;
    width: 1px;
    height: 140%;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba($gold, 0.5) 20%,
      rgba($red-lt, 0.6) 80%,
      transparent 100%
    );
    animation: chainFall linear infinite;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: -1.5px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: $gold-lt;
      box-shadow: 0 0 8px 2px rgba($red-lt, 0.8);
    }
  }
}

/* 余烬粒子 */
.bg-embers {
  position: absolute;
  inset: 0;
  span {
    position: absolute;
    bottom: -10px;
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
   顶部横幅
   ============================================================ */
.top-banner {
  position: relative;
  z-index: 5;
  padding: 100px 32px 26px;
  text-align: center;
}

.banner-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.banner-line {
  display: block;
  height: 1px;
  flex: 0 0 auto;
  width: clamp(60px, 12vw, 160px);

  &--left {
    background: linear-gradient(
      90deg,
      transparent,
      rgba($red, 0.7) 30%,
      rgba($gold, 0.8) 70%,
      transparent
    );
  }
  &--right {
    background: linear-gradient(
      90deg,
      transparent,
      rgba($gold, 0.8) 30%,
      rgba($red, 0.7) 70%,
      transparent
    );
  }
}

.banner-text {
  position: relative;
}

.banner-title {
  margin: 0;
  font-family: $font-title;
  font-size: clamp(44px, 6.4vw, 80px);
  font-weight: 400;
  letter-spacing: 0.12em;
  line-height: 1;
  background: linear-gradient(
    120deg,
    $gold 0%,
    #fff 20%,
    $red-lt 38%,
    $gold-lt 56%,
    #fff 74%,
    $gold 100%
  );
  background-size: 240% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 24px rgba($red, 0.55));
  animation: titleShimmer 8s linear infinite;
}

.banner-sub {
  margin: 10px 0 0;
  font-family: $font-en;
  font-size: clamp(10px, 1.2vw, 13px);
  font-weight: 400;
  letter-spacing: 0.48em;
  color: rgba($red-glow, 0.65);
  padding-left: 0.48em;
}

.banner-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  font-size: 14px;
  letter-spacing: 0.06em;
  color: rgba($paper, 0.62);

  .meta-poem {
    font-family: $font-title;
    font-size: 18px;
    letter-spacing: 0.18em;
    color: rgba($gold-lt, 0.88);
    text-shadow: 0 0 14px rgba($red, 0.55);
  }

  .meta-divider {
    color: rgba($red, 0.5);
    font-size: 12px;
  }

  .meta-stat em {
    font-family: $font-mono;
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    color: $gold-lt;
    text-shadow: 0 0 12px rgba($gold, 0.8);
    padding: 0 4px;
  }
}

/* ============================================================
   主内容
   ============================================================ */
.main-content {
  position: relative;
  z-index: 5;
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px clamp(16px, 3vw, 44px) 40px;
}

.layout {
  display: flex;
  gap: clamp(20px, 3vw, 36px);
  align-items: flex-start;
}

/* ============================================================
   左栏：频率铭刻匣
   ============================================================ */
.form-column {
  flex: 0 0 360px;
  position: sticky;
  top: 24px;
}

.form-box {
  position: relative;
  padding: 28px 26px 26px;
  background: linear-gradient(180deg, rgba($ink-2, 0.95), rgba($ink-3, 0.9));
  border: 1px solid rgba($gold, 0.2);
  box-shadow: 0 22px 60px -30px rgba(0, 0, 0, 0.9),
    inset 0 0 30px rgba($red, 0.05);
  overflow: hidden;
  backdrop-filter: blur(10px);

  /* 四角小锁扣 */
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    pointer-events: none;
  }
  &::before {
    top: 6px;
    left: 6px;
    border-top: 1px solid $gold;
    border-left: 1px solid $gold;
  }
  &::after {
    bottom: 6px;
    right: 6px;
    border-bottom: 1px solid $gold;
    border-right: 1px solid $gold;
  }

  &.collapsed {
    padding-bottom: 20px;
  }
}

.box-line-top {
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba($red-lt, 0.8),
    transparent
  );
  box-shadow: 0 0 12px rgba($red, 0.5);
}

.box-note {
  margin: 18px 0 0;
  padding-top: 12px;
  border-top: 1px dashed rgba($gold, 0.12);
  font-family: $font-title;
  font-size: 13px;
  line-height: 1.9;
  letter-spacing: 0.04em;
  color: rgba($gold, 0.42);
  text-align: right;
}

.box-header {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 14px;
  margin-bottom: 16px;
  border-bottom: 1px dashed rgba($gold, 0.15);
  cursor: pointer;
  user-select: none;

  .box-mark {
    font-size: 11px;
    color: $gold-lt;
    text-shadow: 0 0 10px rgba($gold, 0.9);
    animation: pulseDot 3s ease-in-out infinite;
  }

  .box-title {
    font-family: $font-title;
    font-size: 22px;
    letter-spacing: 0.15em;
    color: $paper;
    text-shadow: 0 0 14px rgba($red, 0.6);
  }

  .box-hint {
    flex: 1;
    font-size: 12px;
    color: rgba($paper, 0.4);
    letter-spacing: 0.04em;
  }

  .box-toggle {
    font-size: 13px;
    color: $gold-lt;
    text-shadow: 0 0 10px rgba($gold, 0.8);
  }
}

/* 表单 */
.lamp-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .form-row {
    &.two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .field-label {
      font-size: 13px;
      letter-spacing: 0.1em;
      color: rgba($gold-lt, 0.8);
      padding-left: 10px;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: $red-lt;
        box-shadow: 0 0 8px rgba($red, 0.9);
      }
    }

    input,
    .select-type {
      width: 100%;
      padding: 12px 14px;
      border-radius: 2px;
      border: 1px solid rgba($gold, 0.15);
      background: rgba($ink, 0.6);
      color: $paper;
      font-family: inherit;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      transition: all 0.3s ease;

      &::placeholder {
        color: rgba($paper, 0.25);
      }

      &:focus {
        border-color: rgba($red, 0.6);
        background: rgba($ink, 0.85);
        box-shadow: 0 0 0 2px rgba($red, 0.15), inset 0 0 10px rgba($red, 0.1);
      }
    }

    .select-type {
      appearance: none;
      cursor: pointer;
      background-image: linear-gradient(45deg, transparent 50%, rgba($gold, 0.7) 50%),
        linear-gradient(135deg, rgba($gold, 0.7) 50%, transparent 50%);
      background-position: calc(100% - 18px) calc(50% - 2px),
        calc(100% - 13px) calc(50% - 2px);
      background-size: 5px 5px, 5px 5px;
      background-repeat: no-repeat;

      option {
        background: $ink-2;
        color: $paper;
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;

    .submit-btn {
      position: relative;
      padding: 12px 28px;
      border-radius: 2px;
      border: 1px solid $red-lt;
      background: linear-gradient(135deg, $blood, $red);
      color: $paper;
      font-family: $font-title;
      font-size: 18px;
      letter-spacing: 0.15em;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba($red, 0.4);
      overflow: hidden;

      .btn-shine {
        position: absolute;
        top: -50%;
        left: -100%;
        width: 50%;
        height: 200%;
        background: linear-gradient(
          to right,
          transparent,
          rgba(255, 255, 255, 0.4),
          transparent
        );
        transform: skewX(-25deg);
        transition: left 0.5s ease;
        pointer-events: none;
      }

      .btn-text {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        text-shadow: 0 0 10px rgba($gold, 0.6);
      }

      .btn-mark {
        font-size: 10px;
        color: $gold-lt;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba($red, 0.6);
        .btn-shine {
          left: 150%;
        }
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

/* 折叠动画 */
.form-slide-enter-active,
.form-slide-leave-active {
  transition: all 0.3s ease;
}
.form-slide-enter-from,
.form-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ============================================================
   右栏：秘库档案列表
   ============================================================ */
.list-column {
  flex: 1;
  min-width: 0;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 20px;
  border-bottom: 1px dashed rgba($gold, 0.15);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 68px;
    height: 2px;
    background: linear-gradient(90deg, $red-lt, $gold, transparent);
    box-shadow: 0 0 12px rgba($red, 0.9);
  }

  .list-title {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    font-family: $font-title;
    font-size: 28px;
    font-weight: 400;
    letter-spacing: 0.15em;
    color: $paper;
    text-shadow: 0 0 16px rgba($red, 0.5);

    .list-mark {
      font-size: 12px;
      color: $red-lt;
      animation: pulseDot 3.2s ease-in-out infinite;
    }

    .list-count {
      margin-left: 4px;
      font-family: $font-body;
      font-size: 12px;
      letter-spacing: 0.08em;
      color: rgba($gold, 0.55);
      text-shadow: none;
    }
  }

  .sort-control {
    display: flex;
    align-items: center;
    gap: 10px;

    .sort-label {
      font-size: 13.5px;
      letter-spacing: 0.1em;
      color: rgba($gold-lt, 0.6);
    }

    .sort-select {
      padding: 8px 14px;
      border-radius: 2px;
      border: 1px solid rgba($gold, 0.25);
      background: rgba($ink, 0.6);
      color: $gold-lt;
      font-family: inherit;
      font-size: 14px;
      letter-spacing: 0.05em;
      cursor: pointer;
      outline: none;
      appearance: none;
      padding-right: 32px;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><path d='M0 0 L5 6 L10 0' stroke='%23f2ddab' stroke-width='1.5' fill='none'/></svg>");
      background-repeat: no-repeat;
      background-position: calc(100% - 12px) center;
      background-size: 10px 6px;

      &:focus {
        border-color: rgba($red, 0.6);
      }

      option {
        background: $ink-2;
        color: $paper;
      }
    }
  }
}

/* 卡片网格 */
.lamp-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

/* 契约卷宗卡片 */
.contract-slip {
  position: relative;
  padding: 24px 28px 20px 48px;
  border-radius: 2px;
  background: linear-gradient(135deg, rgba($ink-2, 0.9), rgba($ink-3, 0.95));
  border: 1px solid rgba($gold, 0.15);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
  overflow: hidden;

  &:hover {
    border-color: rgba($red-lt, 0.5);
    box-shadow: 0 10px 30px rgba($red, 0.15), inset 0 0 20px rgba($red, 0.05);
    transform: translateY(-3px);

    .slip-glow {
      opacity: 1;
    }
    .slip-lock {
      transform: translateY(-50%) rotate(45deg) scale(1.2);
      border-color: $red-lt;
      box-shadow: 0 0 10px $red;
    }
  }

  /* 边缘引线 */
  .slip-glow {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, $red-lt, transparent);
    opacity: 0.3;
    transition: opacity 0.3s;
  }

  /* 左侧金属锁扣 */
  .slip-lock {
    position: absolute;
    top: 50%;
    left: 16px;
    width: 10px;
    height: 10px;
    border: 1px solid rgba($gold, 0.6);
    transform: translateY(-50%) rotate(45deg);
    background: $ink;
    transition: all 0.3s;
    z-index: 2;

    &::after {
      content: "";
      position: absolute;
      inset: 2px;
      background: rgba($red, 0.3);
    }
  }

  /* 标题 */
  .slip-title {
    display: block;
    color: $paper;
    font-family: $font-title;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-decoration: none;
    line-height: 1.5;
    margin-bottom: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    transition: color 0.3s ease, text-shadow 0.3s ease;
    position: relative;
    z-index: 1;

    &:hover {
      color: $gold-lt;
      text-shadow: 0 0 14px rgba($gold, 0.85), 0 0 30px rgba($red, 0.5);
    }
  }

  /* 元信息 */
  .slip-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;

    .meta-left {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12.5px;
      letter-spacing: 0.02em;

      .meta-uploader {
        color: rgba($gold-lt, 0.85);
        font-weight: 600;
      }

      .meta-dot {
        color: rgba($paper, 0.3);
      }

      .meta-time {
        font-family: $font-mono;
        font-size: 11.5px;
        color: rgba($paper, 0.45);
      }
    }

    .meta-right {
      display: flex;
      align-items: center;
      gap: 10px;

      .meta-type {
        padding: 2px 8px;
        font-size: 11px;
        letter-spacing: 0.1em;
        color: rgba($violet-lt, 0.85);
        border: 1px solid rgba($violet, 0.3);
        background: rgba($violet, 0.1);
      }

      /* 点赞按钮 (共鸣结晶) */
      .like-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 2px;
        border: 1px solid rgba($gold, 0.2);
        background: rgba($ink, 0.5);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          border-color: rgba($red-lt, 0.6);
          background: rgba($blood, 0.3);
          transform: translateY(-1px);
        }

        &.active {
          border-color: $red-lt;
          background: rgba($red, 0.2);
        }

        /* 纯 CSS 绘制菱形结晶体 */
        .heart {
          width: 10px;
          height: 10px;
          background: rgba($paper, 0.3);
          transform: rotate(45deg);
          transition: all 0.3s ease;
          border: 1px solid transparent;

          &.liked {
            background: $red-lt;
            border-color: $paper;
            box-shadow: 0 0 10px rgba($red-lt, 0.8), inset 0 0 4px #fff;
            animation: pulseDot 2s infinite;
          }
        }

        .like-count {
          font-family: $font-mono;
          font-size: 12px;
          font-weight: 700;
          color: rgba($paper, 0.7);

          .active & {
            color: $red-glow;
          }
        }
      }
    }
  }
}

/* 空状态 */
.empty-message {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 30px auto;
  padding: 44px 26px;
  max-width: 400px;
  text-align: center;
  border: 1px dashed rgba($gold, 0.22);

  &__seal {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    margin-bottom: 8px;
    font-family: $font-title;
    font-size: 22px;
    color: #ffe9dd;
    background: linear-gradient(160deg, rgba($red, 0.85), rgba($blood, 0.7));
    border: 1px solid rgba($red-lt, 0.45);
    transform: rotate(-4deg);
    text-shadow: none;
  }
  &__title {
    margin: 0;
    font-family: $font-title;
    font-size: 21px;
    letter-spacing: 0.1em;
    color: rgba($gold-lt, 0.9);
    text-shadow: none;
  }
  &__desc {
    margin: 0;
    font-family: $font-body;
    font-size: 13px;
    letter-spacing: 0.04em;
    color: rgba($paper, 0.45);
    text-shadow: none;
  }
}

/* 加载骨架 */
.skeleton-list {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  padding: 6px 0;
}
.skeleton-slip {
  height: 104px;
  border: 1px solid rgba($gold, 0.1);
  background: linear-gradient(
    100deg,
    rgba($ink-3, 0.5) 20%,
    rgba($gold, 0.07) 40%,
    rgba($ink-3, 0.5) 60%
  );
  background-size: 240% 100%;
  animation: skeletonSweep 1.5s ease-in-out infinite;
}
@keyframes skeletonSweep {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -40% 0;
  }
}
@media (max-width: 760px) {
  .skeleton-list {
    grid-template-columns: 1fr;
  }
}

/* 提交按钮禁用态 */
.submit-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  filter: saturate(0.6);
}

/* 列表过渡 */
.resource-enter-active {
  transition: opacity 0.5s ease,
    transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.resource-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.resource-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
  filter: blur(6px);
}
.resource-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
.resource-move {
  transition: transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
}

/* ============================================================
   底部
   ============================================================ */
.foot {
  position: relative;
  z-index: 5;
  text-align: center;
  padding: 20px clamp(16px, 3vw, 44px) 32px;
  font-family: $font-title;
  font-size: 16px;
  letter-spacing: 0.15em;
  color: rgba($gold-lt, 0.5);
  text-shadow: 0 0 12px rgba($red, 0.3);
}

/* ============================================================
   响应式
   ============================================================ */
@media (max-width: 1100px) {
  .lamp-list {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 900px) {
  .layout {
    flex-direction: column;
  }

  .form-column {
    flex: 0 0 auto;
    position: static;
    width: 100%;
  }

  .form-box {
    padding: 22px 20px;
  }
}

@media (max-width: 768px) {
  .top-banner {
    padding: 88px 20px 20px;
  }

  .banner-inner {
    gap: 14px;
  }
  .banner-line {
    width: 40px;
  }
  .banner-title {
    letter-spacing: 0.08em;
  }
  .banner-sub {
    letter-spacing: 0.32em;
    padding-left: 0.32em;
  }

  .banner-meta {
    flex-wrap: wrap;
    gap: 6px 10px;
    font-size: 12px;
    margin-top: 14px;

    .meta-poem {
      font-size: 15px;
      width: 100%;
    }
    .meta-stat em {
      font-size: 14px;
    }
  }

  .main-content {
    padding: 8px 14px 30px;
  }

  .box-header {
    .box-title {
      font-size: 18px;
    }
    .box-hint {
      display: none;
    }
  }

  .lamp-form .form-row.two-col {
    grid-template-columns: 1fr;
  }

  .list-header {
    .list-title {
      font-size: 22px;
    }
    .sort-control .sort-label {
      display: none;
    }
  }

  .contract-slip {
    padding: 20px 18px 18px 42px;

    .slip-title {
      font-size: 16px;
    }

    .slip-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;

      .meta-right {
        width: 100%;
        justify-content: flex-start;
      }
    }
  }
}

/* ============================================================
   减弱动效
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .umb-ring,
  .bg-orbit,
  .bg-chains span,
  .bg-embers span,
  .banner-title,
  .submit-btn,
  .btn-shine,
  .box-mark,
  .list-mark,
  .slip-lock,
  .like-btn .heart.liked {
    animation: none !important;
  }

  .contract-slip,
  .slip-title,
  .like-btn,
  .slip-lock {
    transition: none !important;
  }

  .contract-slip:hover {
    transform: none;
  }
}
</style>
