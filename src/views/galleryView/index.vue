<template>
  <div class="suoming-gallery" aria-live="polite">
    <!-- ===== 动态背景：暗流 + 锁链 + 频率粒子 ===== -->
    <div class="bg-layer" aria-hidden="true">
      <!-- 顶部与底部光晕 -->
      <span class="bg-glow bg-glow--top"></span>
      <span class="bg-glow bg-glow--bottom"></span>

      <!-- 缓缓漂移的墨晕 / 暗能量 -->
      <div class="bg-ink">
        <span class="ink-blob ink-blob--1"></span>
        <span class="ink-blob ink-blob--2"></span>
        <span class="ink-blob ink-blob--3"></span>
      </div>

      <!-- 底部频率粒子海 -->
      <div class="bg-freq">
        <span
          v-for="(p, i) in freqParticles"
          :key="'f-' + i"
          :style="{
            left: p.left + '%',
            width: p.size + 'px',
            height: p.size + 'px',
            animationDuration: p.dur + 's',
            animationDelay: p.delay + 's',
            background: p.color,
            boxShadow: `0 0 10px ${p.color}`,
          }"
        ></span>
      </div>

      <!-- 垂直坠落的锁链 -->
      <div class="bg-chains">
        <span
          v-for="(p, i) in chainThreads"
          :key="'c-' + i"
          :style="{
            left: p.left + '%',
            animationDuration: p.dur + 's',
            animationDelay: p.delay + 's',
            opacity: p.opacity,
          }"
        ></span>
      </div>

      <!-- 噪点与暗角 -->
      <span class="bg-grain"></span>
      <span class="bg-vignette"></span>
    </div>

    <!-- ===== 顶部横幅 ===== -->
    <header class="top-banner">
      <!-- 悬挂锁扣装饰 -->
      <div class="banner-locks" aria-hidden="true">
        <span class="hang-lock hang-lock--l1"></span>
        <span class="hang-lock hang-lock--l2"></span>
        <span class="hang-lock hang-lock--r1"></span>
        <span class="hang-lock hang-lock--r2"></span>
      </div>

      <!-- 横幅内容 -->
      <div class="banner-inner">
        <span class="banner-line banner-line--left" aria-hidden="true"></span>
        <div class="banner-text">
          <h1 class="banner-title">契印图集</h1>
          <p class="banner-sub">S U O M I N G &nbsp;·&nbsp; A R C H I V E S</p>
        </div>
        <span class="banner-line banner-line--right" aria-hidden="true"></span>
      </div>

      <!-- 诗句 + 统计 -->
      <div class="banner-meta">
        <span class="meta-poem">「锁尽妄执，伞下故影」</span>
        <span class="meta-divider">◆</span>
        <span class="meta-stat">
          共归档 <em>{{ imgTotal }}</em> 份频率
        </span>
        <span class="meta-divider">◆</span>
        <span class="meta-stat">
          今日新增 <em>{{ uploadedToday }}</em> 份
        </span>
      </div>
    </header>

    <!-- ===== 主内容 ===== -->
    <main class="main-content" v-reveal>
      <!-- 排序 + 上传工具条 -->
      <div class="toolbar">
        <button @click="toggleSort" class="sort-btn">
          <span class="sort-mark" aria-hidden="true">◆</span>
          <span>{{
            sortBy === "like_count" ? "按共鸣度排序" : "按归档时间排序"
          }}</span>
        </button>

        <button class="upload-btn" @click="openUploadModal">
          <span class="btn-mark" aria-hidden="true">✦</span>
          <span>铭刻频率</span>
          <span class="btn-shine"></span>
        </button>
      </div>

      <!-- 瀑布流网格 -->
      <div class="gallery-note-wrap">
        <p class="gallery-note sm-note sm-note--right">
          希望大家能多多上传哦，<br />毕竟州监很可爱呢。
        </p>
      </div>
      <div class="gallery-masonry">
        <div
          v-for="(img, index) in images"
          :key="img.id"
          class="gallery-card"
          @click="openLightbox(index)"
        >
          <!-- 四角金属饰片 -->
          <span class="card-corner tl"></span>
          <span class="card-corner tr"></span>
          <span class="card-corner bl"></span>
          <span class="card-corner br"></span>
          <span class="card-lock" aria-hidden="true"></span>

          <div class="card-img-wrap">
            <img
              :src="img.src"
              :alt="img.alt"
              loading="lazy"
              decoding="async"
              @load="onImageLoad($event)"
              @error="onImageError($event)"
            />
            <span class="card-veil"></span>
          </div>

          <div class="card-overlay">
            <span class="overlay-text">
              <span class="overlay-mark" aria-hidden="true">✦</span>
              展开契印
            </span>
          </div>

          <button class="like-btn" @click.stop="handleLike(img)">
            <span class="heart" :class="{ liked: img.liked }"></span>
            <span class="like-count">{{ img.likeCount }}</span>
          </button>
        </div>
      </div>

      <div ref="sentinel" class="sentinel"></div>
      <div v-if="!loading && !images.length" class="gallery-empty">
        <span class="gallery-empty__seal" aria-hidden="true">契</span>
        <p class="gallery-empty__title">图集还空着</p>
        <p class="gallery-empty__desc">第一张契印，等你来落笔。</p>
      </div>
      <div v-if="loading" class="loading-more">
        <span class="loading-dot"></span>
        <span class="loading-dot"></span>
        <span class="loading-dot"></span>
        <span class="loading-text">解析中……</span>
      </div>
      <div v-if="finished" class="end-message">—— 锁链尽头，静候故人 ——</div>
    </main>

    <!-- ===== 排行榜胶囊 ===== -->
    <aside class="ranking-pill" :class="{ expanded }">
      <div class="pill-head" @click="expanded = !expanded">
        <span class="pill-icon" aria-hidden="true">♛</span>
        <span class="pill-title">共鸣榜单</span>
        <span class="pill-count">{{ rankingList.length }}</span>
        <span class="pill-toggle">{{ expanded ? "▾" : "▸" }}</span>
      </div>
      <transition name="fade">
        <ul v-if="expanded" class="pill-list">
          <li
            v-for="(item, idx) in rankingList"
            :key="idx"
            class="pill-item"
            :class="`rank-${idx + 1}`"
          >
            <span class="rank">{{ idx + 1 }}</span>
            <span class="name">{{ item.nickname }}</span>
            <span class="count">{{ item.count }}</span>
          </li>
        </ul>
      </transition>
    </aside>

    <!-- ===== Lightbox (机械观测窗) ===== -->
    <div
      v-if="lightboxOpen && images[currentIndex]"
      class="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="契印大图"
      @click.self="closeLightbox"
    >
      <button class="close" aria-label="关闭" @click="closeLightbox">✕</button>
      <button class="prev" aria-label="上一张" @click.stop="prevImage">‹</button>
      <div class="lightbox-frame">
        <img :src="images[currentIndex].src" :alt="images[currentIndex].alt" />
        <span class="frame-corner corner-tl"></span>
        <span class="frame-corner corner-tr"></span>
        <span class="frame-corner corner-bl"></span>
        <span class="frame-corner corner-br"></span>
        <span class="frame-crosshair"></span>
      </div>
      <button class="next" aria-label="下一张" @click.stop="nextImage">›</button>
      <span class="lightbox-count" aria-hidden="true">
        {{ currentIndex + 1 }} / {{ images.length }}
      </span>
    </div>

    <!-- ===== 上传弹窗 (机密终端) ===== -->
    <div
      v-if="uploadModalOpen"
      class="upload-modal-overlay"
      @click.self="closeUploadModal"
    >
      <div class="upload-modal">
        <header class="modal-head">
          <span class="modal-mark">✦</span>
          <h3>频率铭刻终端</h3>
          <span class="modal-mark">✦</span>
        </header>

        <div class="tip-container">
          <ul class="tips-list">
            <li>审核规则：不要露三点我怕被封，要我能认出是锁暝。</li>
            <li>上传成功会弹弹窗提示，请不要中途关掉页面。</li>
            <li>如果图片较多或者单张图片较大可以在 b 站联系我给我网盘链接。</li>
            <li>审核时间不定，最晚一周，感谢谅解。</li>
          </ul>
        </div>

        <p class="stats">
          今日已铭刻：<strong>{{ uploadedToday }}</strong> 份，
          剩余配额：<strong>{{ remaining }}</strong> 份
        </p>

        <label class="modal-label">
          <span class="label-text">契主署名</span>
          <input
            v-model="nickname"
            type="text"
            placeholder="请留下你的频率标识"
          />
        </label>

        <label class="modal-label">
          <span class="label-text"
            >选择频率文件（最多 {{ remaining }} 份）</span
          >
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*"
            @change="handleFileSelect"
          />
        </label>

        <p class="tip" v-if="selectedFiles.length">
          已选 <strong>{{ selectedFiles.length }}</strong> 份文件
        </p>

        <div class="modal-actions">
          <button
            class="btn-submit"
            :disabled="!canSubmit || isUploading"
            @click="submitUpload"
          >
            <span class="btn-shine"></span>
            <span>{{ isUploading ? "铭刻中…" : "确认结契" }}</span>
          </button>
          <button class="cancel" @click="closeUploadModal">取消</button>
        </div>
      </div>
    </div>

    <!-- ===== 浮动 Q 版小人 ===== -->
    <div class="floating-chibis">
      <img
        v-for="(pet, i) in chibiList"
        :key="i"
        :src="pet.src"
        :style="{ top: pet.top + 'px', left: pet.left + 'px' }"
        class="chibi-img"
        alt=""
        aria-hidden="true"
        @mouseenter="pokeChibi($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { ElMessage } from "element-plus";
import { uploadImages } from "@/api/modules/images";
import { getRankingList } from "@/api/modules/ranking";
import { getImagesLikesList, likeImage } from "@/api/modules/imagesLikes";
import { gsap } from "gsap";
import { localDateKey } from "@/utils/format";

/* 极简 debounce：原来从 lodash 引入，但 lodash 并未写进 package.json */
function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timer: number | undefined;
  return (...args: Parameters<T>) => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}

/* ===== 分页与排序 ===== */
const sortBy = ref<"uploaded_at" | "like_count">("like_count");
const order = ref<"asc" | "desc">("desc");
const images = ref<any[]>([]);
const imgTotal = ref(0);
const pageImage = ref(1);
const limit = ref(12);
const loading = ref(false);
const finished = ref(false);
const sentinel = ref<HTMLElement | null>(null);

/* ===== 频率粒子：底部横向密布的粒子 ===== */
const colors = ["#ff3a56", "#c2a061", "#a98bff", "#ff8a9b"];
const freqParticles = Array.from({ length: 42 }, () => ({
  left: Math.random() * 100,
  size: 2 + Math.random() * 4,
  dur: 4 + Math.random() * 4,
  delay: -Math.random() * 8,
  color: colors[Math.floor(Math.random() * colors.length)],
}));

/* ===== 锁链：缓缓坠落 ===== */
const chainThreads = Array.from({ length: 12 }, () => ({
  left: 5 + Math.random() * 90,
  dur: 15 + Math.random() * 10,
  delay: -Math.random() * 20,
  opacity: 0.05 + Math.random() * 0.1,
}));

function toggleSort() {
  sortBy.value = sortBy.value === "uploaded_at" ? "like_count" : "uploaded_at";
  order.value = "desc";
  pageImage.value = 1;
  images.value = [];
  finished.value = false;
  loadNextPage();
}

function getLikedIds(): number[] {
  try {
    const data = localStorage.getItem("likedImageIds");
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch {
    /* 本地缓存被写坏时，别让整页砖掉 */
    return [];
  }
}
function setLikedIds(ids: number[]) {
  localStorage.setItem("likedImageIds", JSON.stringify(ids));
}

async function handleLike(img: any) {
  if (img.liked) return;
  try {
    await likeImage(img.id);
    img.likeCount += 1;
    img.liked = true;
    const likedIds = getLikedIds();
    likedIds.push(img.id);
    setLikedIds(likedIds);
  } catch (err) {
    console.error("点赞失败", err);
  }
}

const fixImageUrl = (url: string): string => {
  if (url.includes("127.0.0.1")) {
    return url.replace("http://127.0.0.1", window.location.origin);
  }
  return url;
};

const observerCard = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observerCard.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

async function observeNewCards(startIndex = 0) {
  await nextTick();
  const cards = document.querySelectorAll<HTMLElement>(".gallery-card");
  for (let i = startIndex; i < cards.length; i++) {
    observerCard.observe(cards[i]);
  }
}

async function loadNextPage() {
  if (loading.value || finished.value) return;
  loading.value = true;
  try {
    const res = await getImagesLikesList({
      page: pageImage.value,
      limit: limit.value,
      sortBy: sortBy.value,
      character_key: "suoming",
      order: order.value,
    });
    imgTotal.value = Number(res?.total) || 0;
    const likedIds = getLikedIds();
    const list = (
      (res?.images as Array<{ url: string; like_count: number; id: number }>) ||
      []
    ).map((item, i) => ({
      src: fixImageUrl(item.url),
      alt: `锁暝 · 契印 ${images.value.length + i + 1}`,
      likeCount: Number(item.like_count) || 0,
      id: item.id,
      liked: likedIds.includes(Number(item.id)),
    }));
    if (list.length === 0) {
      finished.value = true;
      return;
    }
    const oldLength = images.value.length;
    const existingIds = new Set(images.value.map((i) => i.id));
    const filtered = list.filter((item) => !existingIds.has(item.id));
    images.value.push(...filtered);
    pageImage.value++;
    observeNewCards(oldLength);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

const debouncedLoad = debounce(() => loadNextPage(), 200);

/* ===== 排行榜 ===== */
const rankingList = ref<any[]>([]);
const expanded = ref(true);

const fetchRanking = async () => {
  try {
    const res = await getRankingList({
      page: 1,
      pageSize: 99,
      character_key: "suoming",
    });
    rankingList.value = res?.success && Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("榜单拉取失败", err);
    rankingList.value = [];
  }
};

/* ===== Lightbox ===== */
const lightboxOpen = ref(false);
const currentIndex = ref(0);

function openLightbox(index: number) {
  currentIndex.value = index;
  lightboxOpen.value = true;
}
function closeLightbox() {
  lightboxOpen.value = false;
}
function prevImage() {
  if (images.value.length === 0) return;
  currentIndex.value =
    (currentIndex.value + images.value.length - 1) % images.value.length;
}
function nextImage() {
  if (images.value.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
}

/* 观测窗的键盘操作：Esc 关闭、← → 翻页 */
function onLightboxKey(e: KeyboardEvent) {
  if (!lightboxOpen.value) return;
  if (e.key === "Escape") {
    e.preventDefault();
    closeLightbox();
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    prevImage();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    nextImage();
  }
}

watch(lightboxOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});

function onImageLoad(e: Event) {
  const img = e.target as HTMLImageElement;
  const card = img.closest(".gallery-card");
  card?.classList.add("loaded");
}

/* 图裂了就安静地收起来，别让浏览器的破图标破坏气氛 */
function onImageError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.classList.add("is-broken");
  img.alt = "";
}

/* ===== 上传 ===== */
const uploadModalOpen = ref(false);
const nickname = ref("");
const fileInput = ref<HTMLInputElement>();
const selectedFiles = ref<File[]>([]);
const isUploading = ref(false);

function getTodayKey() {
  /* 用本地日期：toISOString 是 UTC，东八区早上八点前会把昨天当成今天 */
  return `uploaded_${localDateKey()}`;
}
const uploadedToday = ref<number>(
  Number(localStorage.getItem(getTodayKey()) || 0)
);
const remaining = computed(() => Math.max(27 - uploadedToday.value, 0));
const canSubmit = computed(
  () =>
    nickname.value.trim().length > 0 &&
    selectedFiles.value.length > 0 &&
    selectedFiles.value.length <= remaining.value
);

function clearOldUploadRecords() {
  const today = new Date();
  const storage = window.localStorage;
  for (const key of Object.keys(storage)) {
    if (!key.startsWith("uploaded_")) continue;
    const dateStr = key.slice("uploaded_".length);
    const recordDate = new Date(dateStr);
    if (isNaN(recordDate.getTime())) continue;
    const diffDays =
      (today.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 2) storage.removeItem(key);
  }
}

function openUploadModal() {
  clearOldUploadRecords();
  nickname.value = "";
  selectedFiles.value = [];
  if (fileInput.value) fileInput.value.value = "";
  uploadedToday.value = Number(localStorage.getItem(getTodayKey()) || 0);
  uploadModalOpen.value = true;
}
function closeUploadModal() {
  uploadModalOpen.value = false;
}

function handleFileSelect(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || []);
  if (!files) return;
  const validFiles: File[] = [];
  for (const file of files) {
    if (file.size > 20 * 1024 * 1024) {
      ElMessage.warning(`文件太大：${file.name}，请控制在 20MB 内`);
      continue;
    }
    validFiles.push(file);
  }
  if (validFiles.length === 0) return;
  if (validFiles.length > remaining.value) {
    ElMessage.warning(
      `今日最多还能上传 ${remaining.value} 张，已为你截取前 ${remaining.value} 张`
    );
    selectedFiles.value = validFiles.slice(0, remaining.value);
  } else {
    selectedFiles.value = validFiles;
  }
}

async function submitUpload() {
  if (!canSubmit.value || isUploading.value) return;
  isUploading.value = true;
  try {
    const res = await uploadImages(
      selectedFiles.value,
      nickname.value.trim(),
      "suoming"
    );
    const uploadedCount = Array.isArray(res?.data) ? res.data.length : 0;
    uploadedToday.value += uploadedCount;
    localStorage.setItem(getTodayKey(), String(uploadedToday.value));
    ElMessage.success(
      uploadedCount > 0 ? `成功铭刻 ${uploadedCount} 道频率` : "频率已收下，稍后就会挂上图集"
    );
    closeUploadModal();
    images.value = [];
    pageImage.value = 1;
    finished.value = false;
    await loadNextPage();
    await fetchRanking();
  } catch (err: any) {
    console.error(err);
    ElMessage.error(err?.message || "上传失败，稍后再试一次");
  } finally {
    isUploading.value = false;
  }
}

/* ===== Q 版小人 ===== */
interface Chibi {
  src: string;
  top: number;
  left: number;
}
const chibiList = ref<Chibi[]>([]);
/* 留住 DOM 引用：onUnmounted 时组件已从文档上摘下来，querySelectorAll 是查不到的 */
const chibiEls: HTMLImageElement[] = [];
const reducedMotion = !!window.matchMedia?.("(prefers-reduced-motion: reduce)")
  .matches;

/* ===== 生命周期 ===== */
let sentinelObserver: IntersectionObserver;

onMounted(async () => {
  await fetchRanking();
  await loadNextPage();
  observeNewCards(0);

  sentinelObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) debouncedLoad();
    },
    { rootMargin: "0px", threshold: 0.1 }
  );
  if (sentinel.value) sentinelObserver.observe(sentinel.value);

  window.addEventListener("resize", handleResize);
  window.addEventListener("keydown", onLightboxKey);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const imgWidth = 100;
  const imgHeight = 100;
  const pngFiles = Array.from(
    { length: 2 },
    (_, k) => `${import.meta.env.BASE_URL}QImages/1 (${k + 1}).png`
  );
  const gifFiles = Array.from(
    { length: 10 },
    (_, k) => `${import.meta.env.BASE_URL}QImages/2 (${k + 1}).webp`
  );
  const allImages = [...pngFiles, ...gifFiles];

  function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const pickCount = window.innerWidth <= 768 ? 1 : 3;
  const picks = shuffle(allImages).slice(0, pickCount);

  chibiList.value = picks.map((src) => ({
    src,
    left: Math.random() * (vw - imgWidth),
    top: Math.random() * (vh - imgHeight),
  }));

  await nextTick();
  chibiEls.length = 0;
  document
    .querySelectorAll<HTMLImageElement>(".chibi-img")
    .forEach((img, index) => {
      chibiEls.push(img);
      gsap.fromTo(
        img,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(2)",
          delay: 0.2 * index,
        }
      );
      if (!reducedMotion) driftChibi(img);
    });
});

/* 小人在页面里慢慢漂，撞到边缘就折返 */
function driftChibi(el: HTMLImageElement) {
  const padding = 200;
  const rect = el.getBoundingClientRect();
  let deltaX = (Math.random() - 0.5) * 200;
  let deltaY = (Math.random() - 0.5) * 200;
  const nextX = rect.x + deltaX;
  const nextY = rect.y + deltaY;
  if (nextX < padding) deltaX = padding - rect.x;
  if (nextX + el.width > window.innerWidth - padding)
    deltaX = window.innerWidth - padding - (rect.x + el.width);
  if (nextY < padding) deltaY = padding - rect.y;
  if (nextY + el.height > window.innerHeight - padding)
    deltaY = window.innerHeight - padding - (rect.y + el.height);
  gsap.to(el, {
    x: `+=${deltaX.toFixed(0)}`,
    y: `+=${deltaY.toFixed(0)}`,
    rotation: `+=${((Math.random() - 0.5) * 60).toFixed(0)}`,
    duration: 2 + Math.random() * 2,
    ease: "power1.inOut",
    onComplete: () => driftChibi(el),
  });
}

/* 鼠标一碰就吓得弹开一小步 */
function pokeChibi(e: MouseEvent) {
  const el = e.currentTarget as HTMLImageElement | null;
  if (!el) return;
  gsap.killTweensOf(el);
  gsap.to(el, {
    x: `+=${((Math.random() - 0.5) * 400).toFixed(0)}`,
    y: `+=${((Math.random() - 0.5) * 400).toFixed(0)}`,
    duration: 1.2,
    ease: "back.out(2)",
    onComplete: () => driftChibi(el),
  });
}

function handleResize() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  chibiList.value = chibiList.value.map((pet) => ({
    ...pet,
    left: Math.min(Math.max(pet.left, 12), Math.max(vw - 112, 12)),
    top: Math.min(Math.max(pet.top, 12), Math.max(vh - 112, 12)),
  }));
}

onUnmounted(() => {
  observerCard.disconnect();
  if (sentinelObserver) sentinelObserver.disconnect();
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("keydown", onLightboxKey);
  /* 停掉 Q 版小人的无限漂移动画，避免路由切走后还在跑 rAF */
  chibiEls.forEach((el) => gsap.killTweensOf(el));
  chibiEls.length = 0;
  document.body.style.overflow = "";
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
   全局
   ============================================================ */
.suoming-gallery {
  position: relative;
  min-height: 100vh;
  background: $ink;
  font-family: $font-body;
  color: $paper;
  overflow-x: hidden;
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

.bg-glow {
  position: absolute;
  width: 80vw;
  height: 80vw;
  border-radius: 50%;
  filter: blur(120px);

  &--top {
    top: -40%;
    left: 50%;
    transform: translateX(-50%);
    background: radial-gradient(circle, rgba($blood, 0.4) 0%, transparent 60%);
  }
  &--bottom {
    bottom: -40%;
    right: -20%;
    background: radial-gradient(circle, rgba($violet, 0.2) 0%, transparent 60%);
  }
}

.bg-ink {
  position: absolute;
  inset: 0;
}
.ink-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.4;
  &--1 {
    width: 50vw;
    height: 50vw;
    top: 10%;
    left: -10%;
    background: radial-gradient(circle, rgba($red, 0.5), transparent 70%);
    animation: drift 26s ease-in-out infinite;
  }
  &--2 {
    width: 60vw;
    height: 60vw;
    bottom: -20%;
    right: 10%;
    background: radial-gradient(circle, rgba($violet, 0.35), transparent 70%);
    animation: drift 32s ease-in-out infinite reverse;
  }
  &--3 {
    width: 40vw;
    height: 40vw;
    top: 40%;
    left: 40%;
    background: radial-gradient(circle, rgba($gold, 0.15), transparent 70%);
    animation: drift 40s ease-in-out infinite;
  }
}
@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(40px, 30px) scale(1.1);
  }
}

.bg-freq {
  position: absolute;
  inset: 0;
  span {
    position: absolute;
    bottom: -10px;
    border-radius: 50%;
    opacity: 0;
    animation: floatUp linear infinite;
  }
}
@keyframes floatUp {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  20% {
    opacity: 0.9;
  }
  80% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100vh) scale(0.5);
    opacity: 0;
  }
}

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

.bg-grain {
  position: absolute;
  inset: 0;
  opacity: 0.04;
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
  z-index: 10;
  padding: 60px 20px 20px;
  text-align: center;
}

.banner-locks {
  position: absolute;
  top: 0;
  left: 50%;
  width: 800px;
  max-width: 100vw;
  transform: translateX(-50%);
  pointer-events: none;
}
.hang-lock {
  position: absolute;
  width: 10px;
  height: 14px;
  background: $red;
  border: 1px solid $gold;
  border-radius: 2px;
  box-shadow: 0 0 12px rgba($red, 0.6);

  &::before {
    content: "";
    position: absolute;
    top: -6px;
    left: 50%;
    width: 6px;
    height: 6px;
    transform: translateX(-50%);
    border: 1px solid $gold;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
  }
  &::after {
    content: "";
    position: absolute;
    top: -20px;
    left: 50%;
    width: 1px;
    height: 14px;
    background: rgba($gold, 0.6);
  }

  &--l1 {
    top: 30px;
    left: 10%;
    transform-origin: top center;
    animation: swing 4s ease-in-out infinite;
  }
  &--l2 {
    top: 45px;
    left: 25%;
    transform-origin: top center;
    animation: swing 5s ease-in-out infinite reverse;
  }
  &--r1 {
    top: 30px;
    right: 10%;
    transform-origin: top center;
    animation: swing 4.5s ease-in-out infinite;
  }
  &--r2 {
    top: 45px;
    right: 25%;
    transform-origin: top center;
    animation: swing 5.5s ease-in-out infinite reverse;
  }
}
@keyframes swing {
  0%,
  100% {
    transform: rotate(5deg);
  }
  50% {
    transform: rotate(-5deg);
  }
}

.banner-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}
.banner-line {
  width: 100px;
  height: 1px;
  &--left {
    background: linear-gradient(90deg, transparent, $gold);
  }
  &--right {
    background: linear-gradient(90deg, $gold, transparent);
  }
}
.banner-title {
  margin: 0;
  font-family: $font-title;
  font-size: 48px;
  letter-spacing: 0.15em;
  color: $paper;
  text-shadow: 0 0 20px rgba($red, 0.8), 0 0 40px rgba($red, 0.4);
}
.banner-sub {
  margin: 8px 0 0;
  font-family: "Cinzel", serif;
  font-size: 11px;
  letter-spacing: 0.5em;
  color: $gold-lt;
}

.banner-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 14px;
  color: rgba($paper, 0.6);
}
.meta-poem {
  font-family: $font-title;
  font-size: 18px;
  color: $gold-lt;
}
.meta-divider {
  color: $red;
  font-size: 10px;
}
.meta-stat em {
  font-style: normal;
  font-family: "Cinzel", serif;
  font-size: 16px;
  color: $red-glow;
  font-weight: bold;
  margin: 0 4px;
}

/* ============================================================
   主内容区
   ============================================================ */
.main-content {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px 100px;
}

/* 工具条 */
.toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: 32px;
}

.sort-btn {
  background: rgba($ink-2, 0.8);
  border: 1px solid rgba($gold, 0.3);
  color: $gold-lt;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  &:hover {
    border-color: $gold;
    box-shadow: 0 0 15px rgba($gold, 0.2);
  }
  .sort-mark {
    color: $red;
    font-size: 10px;
  }
}

.upload-btn {
  position: relative;
  background: linear-gradient(135deg, $blood, $red);
  border: 1px solid $red-lt;
  color: $paper;
  padding: 8px 24px;
  border-radius: 4px;
  font-family: $font-title;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 0 20px rgba($red, 0.6);
    transform: translateY(-2px);
    .btn-shine {
      left: 150%;
    }
  }
  .btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transform: skewX(-20deg);
    transition: left 0.5s ease;
  }
}

/* ============================================================
   瀑布流画廊
   ============================================================ */
.gallery-note-wrap {
  display: flex;
  justify-content: flex-end;
  margin: -6px 0 18px;
}
.gallery-note {
  font-size: 13.5px;
  line-height: 1.8;
  max-width: 220px;
}

.gallery-masonry {
  column-count: 3;
  column-gap: 24px;
}

.gallery-card {
  position: relative;
  break-inside: avoid;
  margin-bottom: 24px;
  background: $ink-2;
  border: 1px solid rgba($gold, 0.2);
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease,
    box-shadow 0.3s ease;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    border-color: rgba($red-lt, 0.6);
    box-shadow: 0 10px 30px rgba($red, 0.2), inset 0 0 20px rgba($red, 0.1);
    transform: translateY(-4px) !important;

    .card-veil {
      opacity: 0.2;
    }
    .card-overlay {
      opacity: 1;
      transform: translateY(0);
    }
    .card-lock {
      transform: translateX(-50%) rotate(45deg) scale(1.2);
      border-color: $red-lt;
    }
    .card-img-wrap img {
      transform: scale(1.045);
      filter: saturate(1.08) brightness(1.03);
    }
  }
}

/* 四角金属饰片 */
.card-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid rgba($gold, 0.6);
  z-index: 2;
  pointer-events: none;
  &.tl {
    top: 4px;
    left: 4px;
    border-right: none;
    border-bottom: none;
  }
  &.tr {
    top: 4px;
    right: 4px;
    border-left: none;
    border-bottom: none;
  }
  &.bl {
    bottom: 4px;
    left: 4px;
    border-right: none;
    border-top: none;
  }
  &.br {
    bottom: 4px;
    right: 4px;
    border-left: none;
    border-top: none;
  }
}

/* 底部机关锁扣 */
.card-lock {
  position: absolute;
  bottom: -5px;
  left: 50%;
  width: 8px;
  height: 8px;
  transform: translateX(-50%) rotate(45deg);
  background: $ink;
  border: 1px solid $gold;
  z-index: 3;
  transition: all 0.3s;
}

.card-img-wrap {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 2px;
  background: $ink-3;
  min-height: 200px; /* 骨架占位 */

  img {
    display: block;
    width: 100%;
    height: auto;
    transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), filter 0.55s ease;
    will-change: transform;

    &.is-broken {
      visibility: hidden;
    }
  }
  .card-veil {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 60%, rgba($ink, 0.8));
    opacity: 0.6;
    transition: opacity 0.3s;
  }
}

.gallery-card:hover .card-img-wrap img {
  transform: scale(1.03);
}

/* 展开遮罩 */
.card-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba($blood, 0.6);
  backdrop-filter: blur(2px);
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  pointer-events: none;

  .overlay-text {
    font-family: $font-title;
    font-size: 20px;
    color: $gold-lt;
    letter-spacing: 0.1em;
    text-shadow: 0 0 10px rgba($red, 0.8);
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

/* 点赞按钮 */
.like-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba($ink, 0.6);
  border: 1px solid rgba($gold, 0.3);
  padding: 4px 10px;
  border-radius: 20px;
  cursor: pointer;
  z-index: 4;
  backdrop-filter: blur(4px);
  transition: all 0.2s;

  &:hover {
    border-color: $red-lt;
    background: rgba($blood, 0.4);
  }

  .heart {
    width: 12px;
    height: 12px;
    background: $paper;
    clip-path: polygon(50% 100%, 0 40%, 20% 0, 50% 20%, 80% 0, 100% 40%);
    transition: all 0.3s;

    &.liked {
      background: $red-lt;
      box-shadow: 0 0 10px $red-lt;
    }
  }
  .like-count {
    font-family: "Cinzel", serif;
    font-size: 13px;
    color: $paper;
  }
}

/* 骨架/状态 */
.sentinel {
  height: 20px;
}
.loading-more {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 40px;
  color: $gold-lt;
  font-family: $font-title;
  font-size: 18px;
}
.loading-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $gold;
  animation: jump 1s infinite alternate;
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}
@keyframes jump {
  to {
    transform: translateY(-8px);
  }
}
.end-message {
  text-align: center;
  padding: 40px;
  font-family: $font-title;
  font-size: 20px;
  color: rgba($gold, 0.4);
  letter-spacing: 0.15em;
}

/* ============================================================
   排行榜
   ============================================================ */
.ranking-pill {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 40;
  background: rgba($ink-2, 0.9);
  border: 1px solid rgba($gold, 0.3);
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba($red, 0.05);
  backdrop-filter: blur(10px);
  overflow: hidden;
  width: 240px;
  transition: width 0.3s;
}

.pill-head {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba($blood, 0.3);
  cursor: pointer;
  border-bottom: 1px solid rgba($gold, 0.2);

  .pill-icon {
    color: $gold-lt;
    margin-right: 8px;
    font-size: 16px;
    text-shadow: 0 0 10px rgba($gold, 0.6);
  }
  .pill-title {
    flex: 1;
    font-family: $font-title;
    font-size: 18px;
    color: $paper;
  }
  .pill-count {
    font-family: "Cinzel", serif;
    font-size: 12px;
    color: $red-glow;
    margin-right: 12px;
  }
  .pill-toggle {
    color: rgba($paper, 0.5);
    font-size: 12px;
  }
}

.pill-list {
  list-style: none;
  margin: 0;
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: $gold;
  }
}
.pill-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px dashed rgba($gold, 0.1);
  font-size: 13px;
  color: rgba($paper, 0.8);
  &:last-child {
    border: none;
  }

  .rank {
    width: 20px;
    font-family: "Cinzel", serif;
    font-weight: bold;
    color: rgba($paper, 0.4);
    text-align: center;
  }
  .name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .count {
    font-family: "Cinzel", serif;
    color: $gold-lt;
  }

  &.rank-1 .rank {
    color: $gold-lt;
    text-shadow: 0 0 8px $gold;
    font-size: 16px;
  }
  &.rank-2 .rank {
    color: $paper;
  }
  &.rank-3 .rank {
    color: $red-glow;
  }
}

/* ============================================================
   Lightbox (机械观测窗)
   ============================================================ */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba($ink, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.lightbox-frame {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  border: 1px solid rgba($gold, 0.4);
  box-shadow: 0 0 50px rgba($red, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.8);
  padding: 8px;
  background: $ink-2;

  img {
    display: block;
    max-width: 100%;
    max-height: calc(90vh - 16px);
    object-fit: contain;
  }
}

.frame-corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 2px solid $red-lt;
  pointer-events: none;
  &.corner-tl {
    top: -2px;
    left: -2px;
    border-right: none;
    border-bottom: none;
  }
  &.corner-tr {
    top: -2px;
    right: -2px;
    border-left: none;
    border-bottom: none;
  }
  &.corner-bl {
    bottom: -2px;
    left: -2px;
    border-right: none;
    border-top: none;
  }
  &.corner-br {
    bottom: -2px;
    right: -2px;
    border-left: none;
    border-top: none;
  }
}
.frame-crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
  border: 1px solid rgba($gold, 0.3);
  border-radius: 50%;
  pointer-events: none;
  &::before,
  &::after {
    content: "";
    position: absolute;
    background: rgba($gold, 0.4);
  }
  &::before {
    top: 50%;
    left: -10px;
    right: -10px;
    height: 1px;
  }
  &::after {
    left: 50%;
    top: -10px;
    bottom: -10px;
    width: 1px;
  }
}

.close,
.prev,
.next {
  position: absolute;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  background: rgba($ink-2, 0.8);
  border: 1px solid rgba($gold, 0.3);
  border-radius: 50%;
  color: $gold-lt;
  font-family: inherit;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 101;
  &:hover {
    background: $blood;
    border-color: $red-lt;
    box-shadow: 0 0 15px rgba($red, 0.5);
  }
}
.close {
  top: 30px;
  right: 30px;
}
.prev {
  left: 30px;
}
.next {
  right: 30px;
}

.lightbox-count {
  position: absolute;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  font-family: "Courier New", ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: 0.22em;
  color: rgba($gold, 0.6);
}

/* 空图集 */
.gallery-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 70px auto;
  padding: 40px 26px;
  max-width: 380px;
  text-align: center;
  border: 1px dashed rgba($gold, 0.22);

  &__seal {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    font-family: $font-title;
    font-size: 22px;
    color: #ffe9dd;
    background: linear-gradient(160deg, rgba($red, 0.85), rgba($blood, 0.7));
    border: 1px solid rgba($red-lt, 0.45);
    transform: rotate(-4deg);
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
    color: rgba($paper, 0.45);
  }
}

/* ============================================================
   上传弹窗 (机密终端)
   ============================================================ */
.upload-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba($ink, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-modal {
  width: 500px;
  max-width: 90vw;
  background: $ink-2;
  border: 1px solid rgba($red, 0.4);
  box-shadow: 0 0 40px rgba($red, 0.2), inset 0 0 20px rgba($red, 0.05);
  padding: 32px;
  position: relative;

  /* 终端四角 */
  &::before {
    content: "";
    position: absolute;
    inset: 6px;
    border: 1px dashed rgba($gold, 0.2);
    pointer-events: none;
  }
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;

  h3 {
    margin: 0;
    font-family: $font-title;
    font-size: 24px;
    color: $red-glow;
    text-shadow: 0 0 12px rgba($red, 0.6);
  }
  .modal-mark {
    color: $gold;
    font-size: 12px;
  }
}

.tip-container {
  background: rgba($blood, 0.15);
  border-left: 2px solid $red-lt;
  padding: 12px 16px;
  margin-bottom: 20px;
}
.tips-list {
  margin: 0;
  padding-left: 16px;
  font-size: 13px;
  line-height: 1.8;
  color: rgba($paper, 0.7);
  li {
    margin-bottom: 4px;
  }
}

.stats {
  font-family: "Cinzel", serif;
  font-size: 14px;
  color: $gold-lt;
  text-align: center;
  margin-bottom: 24px;
  strong {
    color: $red-glow;
    font-size: 18px;
    margin: 0 4px;
  }
}

.modal-label {
  display: block;
  margin-bottom: 20px;
  .label-text {
    display: block;
    font-size: 13px;
    color: $gold;
    margin-bottom: 8px;
    letter-spacing: 0.1em;
  }
  input {
    width: 100%;
    background: rgba($ink, 0.6);
    border: 1px solid rgba($gold, 0.2);
    border-radius: 2px;
    padding: 10px 12px;
    color: $paper;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s;
    &[type="text"]:focus {
      border-color: rgba($red, 0.6);
    }
    &[type="file"] {
      padding: 8px;
      cursor: pointer;
      &::file-selector-button {
        background: rgba($gold, 0.2);
        border: 1px solid rgba($gold, 0.4);
        color: $gold-lt;
        padding: 6px 12px;
        border-radius: 2px;
        margin-right: 12px;
        cursor: pointer;
        font-family: inherit;
        &:hover {
          background: rgba($gold, 0.3);
        }
      }
    }
  }
}

.tip {
  font-size: 13px;
  color: rgba($paper, 0.6);
  margin-bottom: 20px;
  strong {
    color: $gold-lt;
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
}

.btn-submit {
  position: relative;
  background: linear-gradient(135deg, $red, $blood);
  border: 1px solid $red-lt;
  padding: 10px 32px;
  border-radius: 2px;
  color: $paper;
  font-family: $font-title;
  font-size: 16px;
  letter-spacing: 0.1em;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba($red, 0.4);

  &:hover:not(:disabled) {
    box-shadow: 0 6px 25px rgba($red, 0.7);
    transform: translateY(-2px);
    .btn-shine {
      left: 150%;
    }
  }
  &:disabled {
    opacity: 0.5;
    animation: cursorAnimation_disabled 1s infinite step-start;
  }

  .btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transform: skewX(-20deg);
    transition: left 0.5s ease;
  }
}

.cancel {
  background: transparent;
  border: 1px solid rgba($paper, 0.3);
  color: rgba($paper, 0.6);
  padding: 10px 24px;
  border-radius: 2px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    border-color: $paper;
    color: $paper;
  }
}

/* ============================================================
   Q版小人
   ============================================================ */
.floating-chibis {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
}
.chibi-img {
  position: absolute;
  width: 100px;
  height: 100px;
  object-fit: contain;
  pointer-events: auto;
  cursor: pointer;
  filter: drop-shadow(0 8px 18px rgba($red, 0.4));
}

/* ============================================================
   响应式
   ============================================================ */
@media (max-width: 960px) {
  .gallery-masonry {
    column-count: 2;
  }
}

@media (max-width: 768px) {
  .banner-locks {
    display: none;
  }
  .banner-title {
    font-size: 36px;
  }
  .banner-line {
    width: 40px;
  }
  .banner-meta {
    flex-direction: column;
    gap: 8px;
  }
  .meta-divider {
    display: none;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
    .sort-btn,
    .upload-btn {
      justify-content: center;
    }
  }

  .gallery-masonry {
    column-count: 1;
  }

  .ranking-pill {
    bottom: 20px;
    right: 20px;
    width: 180px;
    &.expanded {
      width: 240px;
    }
  }

  .lightbox-frame {
    padding: 4px;
  }
  .close,
  .prev,
  .next {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
  .close {
    top: 16px;
    right: 16px;
  }
  .prev {
    left: 12px;
  }
  .next {
    right: 12px;
  }

  .upload-modal {
    padding: 24px;
  }
  .modal-actions {
    flex-direction: column-reverse;
  }
  .btn-submit,
  .cancel {
    width: 100%;
    justify-content: center;
  }

  .chibi-img {
    width: 72px;
    height: 72px;
  }
}
</style>
