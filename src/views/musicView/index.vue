<template>
  <section class="suoming-player" aria-label="锁暝频率终端 音乐播放器">
    <!-- ===== 背景层：伞骨光环 + 锁链 + 频率余烬 ===== -->
    <div class="bg-layer" aria-hidden="true">
      <!-- 伞骨旋转环 -->
      <span class="umb-ring umb-ring--outer"></span>
      <span class="umb-ring umb-ring--inner"></span>

      <!-- 坠落锁链 -->
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

      <!-- 上升余烬 -->
      <div class="embers">
        <span
          v-for="(e, i) in embers"
          :key="'e-' + i"
          :style="{
            left: e.left + '%',
            animationDuration: e.dur + 's',
            animationDelay: e.delay + 's',
            width: e.size + 'px',
            height: e.size + 'px',
            background: e.color,
            boxShadow: `0 0 10px ${e.color}`,
          }"
        ></span>
      </div>

      <!-- 噪点与暗角 -->
      <span class="bg-grain"></span>
      <span class="vignette"></span>
    </div>

    <!-- ===== 顶部横幅 ===== -->
    <header class="top-banner">
      <div class="banner-inner">
        <span class="banner-line banner-line--left" aria-hidden="true"></span>
        <div class="banner-text">
          <h1 class="banner-title">梦枢音频终端</h1>
          <p class="banner-sub">S U O M I N G &nbsp;·&nbsp; A U D I O</p>
        </div>
        <span class="banner-line banner-line--right" aria-hidden="true"></span>
      </div>
      <p class="banner-poem">「伞下故影，锁尽妄执」</p>
    </header>

    <!-- ===== 主舞台 ===== -->
    <div class="stage">
      <!-- ===== 左侧：音频解析终端 ===== -->
      <div class="player-deck" role="region" aria-label="播放器控制区">
        <!-- 上半部分：观测窗 + 悬臂 -->
        <div class="deck-top">
          <!-- 机关转盘 -->
          <div class="disc" :class="{ spinning: playing }">
            <!-- 外圈刻度线 -->
            <span class="disc-ticks"></span>

            <!-- 内圈轨道 -->
            <span class="disc-groove disc-groove--1"></span>
            <span class="disc-groove disc-groove--2"></span>

            <!-- 视频观测窗 -->
            <div class="disc-face">
              <video
                v-if="videoSrc"
                class="video-background"
                :src="videoSrc"
                autoplay
                muted
                loop
                playsinline
                aria-hidden="true"
                tabindex="-1"
                :class="videoClass"
              ></video>

              <!-- 加载遮罩 -->
              <div
                v-if="loadingAudio"
                class="loading-overlay"
                aria-hidden="true"
              >
                <div class="spinner" />
                <div class="loading-text">解析中…</div>
              </div>
            </div>

            <!-- 外圈金属保护环 -->
            <span class="disc-ring" aria-hidden="true"></span>
          </div>

          <!-- 机械悬臂 -->
          <span class="tonearm" :class="{ playing }" aria-hidden="true">
            <span class="tonearm-base"></span>
            <span class="tonearm-arm"></span>
            <span class="tonearm-head"></span>
          </span>

          <!-- 状态标签 -->
          <span class="deck-label" aria-hidden="true">
            <span class="deck-label__dot"></span>
            <span>{{
              playing ? "TERMINAL · 解析中" : "TERMINAL · 已挂起"
            }}</span>
          </span>
        </div>

        <!-- 下半部分：控制台 -->
        <div class="deck-bottom">
          <!-- 曲名 -->
          <div class="track-title" :title="current?.title || '未选择频率'">
            {{ current?.title || "未选择频率" }}
          </div>

          <!-- 时间 -->
          <div class="track-time">
            <span class="time time--current">{{
              formatTime(currentTime, "00:00")
            }}</span>
            <span class="time-divider">/</span>
            <span class="time time--total">{{ formatTime(duration) }}</span>
          </div>

          <!-- 频谱：跟着节拍跳的几根小灯 -->
          <div class="spectrum" :class="{ on: playing }" aria-hidden="true">
            <span v-for="i in 7" :key="i" :style="{ '--i': i - 1 }"></span>
          </div>

          <!-- 能量进度条 -->
          <div
            class="progress-wrap"
            ref="progressWrap"
            @click="seekByClick"
            @pointerdown.prevent="onPointerDownProgress"
            @keydown.left.prevent="seekStep(-5)"
            @keydown.right.prevent="seekStep(5)"
            @keydown.home.prevent="seekTo(0)"
            @keydown.end.prevent="seekTo(duration)"
            role="slider"
            tabindex="0"
            :aria-valuemin="0"
            :aria-valuemax="Math.round(duration)"
            :aria-valuenow="Math.round(currentTime)"
            :aria-valuetext="`${formatTime(
              currentTime,
              '00:00'
            )} / ${formatTime(duration)}`"
            aria-label="播放进度，方向键可微调"
          >
            <div class="progress-bar">
              <div
                class="progress"
                :style="{ width: progressPercent + '%' }"
              ></div>
              <div
                class="progress-glow"
                :style="{ width: progressPercent + '%' }"
              ></div>
            </div>
            <!-- 菱形滑块 -->
            <div
              class="progress-handle"
              :style="{ left: progressPercent + '%' }"
              aria-hidden="true"
            ></div>
          </div>

          <!-- 操作控制 -->
          <div class="console">
            <div class="console-main">
              <button
                class="ctrl-btn ctrl-btn--side"
                @click="prev"
                aria-label="上一首"
              >
                <span class="ctrl-icon">‹</span>
              </button>
              <button
                class="ctrl-btn ctrl-btn--play"
                @click="togglePlay"
                :aria-pressed="playing"
                :aria-label="playing ? '暂停' : '播放'"
              >
                <span class="play-shine" aria-hidden="true"></span>
                <span class="play-icon" v-if="!playing">▶</span>
                <span class="play-icon play-icon--pause" v-else>❚❚</span>
              </button>
              <button
                class="ctrl-btn ctrl-btn--side"
                @click="next"
                aria-label="下一首"
              >
                <span class="ctrl-icon">›</span>
              </button>
            </div>

            <div class="console-aux">
              <button
                class="mode-btn"
                :class="{ active: shuffle }"
                @click="toggleShuffle"
                title="随机解析"
              >
                <span class="mode-icon">✧</span>
                <span class="mode-label">乱序</span>
              </button>
              <button
                class="mode-btn"
                :class="{ active: repeatMode !== 'off' }"
                @click="toggleRepeat"
                title="循环模式"
              >
                <span class="mode-icon">⟳</span>
                <span class="mode-label">
                  {{
                    repeatMode === "one"
                      ? "单频"
                      : repeatMode === "all"
                      ? "循环"
                      : "顺序"
                  }}
                </span>
              </button>

              <div class="volume" aria-label="音量控制">
                <span class="volume-icon" aria-hidden="true">✦</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  v-model.number="volume"
                  aria-label="音量"
                />
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="error-msg" role="status">
            {{ errorMessage }}
          </div>
        </div>
      </div>

      <!-- ===== 右侧：频率档案列表 ===== -->
      <div
        class="playlist-deck"
        :class="{ collapsed: !playlistOpen && isMobile }"
        role="region"
        aria-label="频率列表"
      >
        <!-- 列表头 -->
        <div class="playlist-header">
          <div class="left-head">
            <h3 class="playlist-title">
              <span class="playlist-title-mark" aria-hidden="true">✦</span>
              曲目
            </h3>
            <button
              class="toggle-list-text"
              @click="togglePlaylist"
              :title="playlistOpen ? '收起列表' : '展开列表'"
            >
              {{ playlistOpen ? "收起" : "展开" }}
            </button>
            <div class="api-hint">
              {{ loading ? "解析中…" : list.length ? "" : "档案为空" }}
            </div>
          </div>

          <div class="search-wrap">
            <span class="search-icon" aria-hidden="true">⌕</span>
            <input
              v-model="searchTerm"
              placeholder="检索频率标识…"
              aria-label="搜索曲目"
            />
            <button
              v-if="searchTerm"
              class="clear"
              @click="clearSearch"
              aria-label="清除搜索"
            >
              ✕
            </button>
          </div>
        </div>

        <p class="playlist-note" aria-hidden="true">
          曲单是慢慢攒的，听见喜欢的记得记下来。
        </p>

        <!-- 列表主体 -->
        <div class="list-area">
          <div v-if="loading" class="list-loading">
            <div class="small-spinner" />
            读取档案中…
          </div>

          <ul class="playlist" role="list">
            <li
              v-for="(item, idx) in filteredList"
              :key="item.name || idx"
              :class="{
                active: current && item.name === current.name,
                playing: current && item.name === current.name && playing,
              }"
              @click="selectTrackByFiltered(idx)"
              @keyup.enter="selectTrackByFiltered(idx)"
              @keyup.space.prevent="selectTrackByFiltered(idx)"
              tabindex="0"
              role="listitem"
              :aria-label="item.title"
              :aria-current="
                current && item.name === current.name ? 'true' : 'false'
              "
            >
              <!-- 左侧锁扣/指示灯 -->
              <span class="lamp-wick" aria-hidden="true"></span>

              <div class="left-col">
                <div class="title" :title="item.title">{{ item.title }}</div>
                <div class="sub" v-if="current && item.name === current.name">
                  {{ playing ? "解析中" : "已挂起" }}
                </div>
              </div>
              <div class="right-col">
                <div class="len">
                  {{
                    item.duration
                      ? formatTime(item.duration)
                      : current && item.name === current.name && duration
                      ? formatTime(duration)
                      : "--:--"
                  }}
                </div>
              </div>
            </li>
          </ul>

          <!-- 检索不到 / 档案为空 -->
          <div
            v-if="!loading && !filteredList.length"
            class="list-empty"
            role="status"
          >
            <span class="list-empty__seal" aria-hidden="true">空</span>
            <p class="list-empty__title">
              {{ searchTerm ? "没有对上频率的曲目" : "档案柜还是空的" }}
            </p>
            <p class="list-empty__desc">
              {{
                searchTerm
                  ? "换个关键词，或者清空检索符。"
                  : "等第一段音源接入梦枢终端。"
              }}
            </p>
            <button
              v-if="searchTerm"
              class="list-empty__btn"
              @click="clearSearch"
            >
              清空检索
            </button>
          </div>
        </div>
      </div>
    </div>

    <audio
      ref="audioRef"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @loadedmetadata="onLoadedMetadata"
      @error="onAudioError"
      preload="metadata"
    ></audio>
  </section>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import { getMusicList, getMusicUrl } from "@/api/modules/music";

type MusicItem = {
  name: string;
  title: string;
  url?: string;
  duration?: number | null;
};

const list = ref<MusicItem[]>([]);
const loading = ref(false);
const index = ref<number>(-1);
const playing = ref(false);
const audioRef = ref<HTMLAudioElement | null>(null);
const currentTime = ref<number>(0);
const duration = ref<number>(0);
const volume = ref<number>(
  (() => {
    /* localStorage 可能是脏数据（"abc" / 3 / -1），先收敛再赋给 audio.volume */
    const raw = Number(localStorage.getItem("suoming_volume") ?? 0.8);
    if (!Number.isFinite(raw)) return 0.8;
    return Math.min(1, Math.max(0, raw));
  })()
);
const shuffle = ref<boolean>(false);
const repeatMode = ref<"off" | "one" | "all">("off");

const progressWrap = ref<HTMLElement | null>(null);
const dragging = ref(false);
const playlistOpen = ref(true);
const errorMessage = ref<string | null>(null);
const loadingAudio = ref(false);

const isMobile = ref<boolean>(window.innerWidth <= 920);
function onWindowResize() {
  isMobile.value = window.innerWidth <= 920;
}

const videoSrc = ref("");
const videoClass = ref("");

const searchTerm = ref("");

/* ===== 背景：锁链与余烬 ===== */
const colors = ["#ff3a56", "#c2a061", "#a98bff", "#ff8a9b"];
const embers = Array.from({ length: 20 }, () => ({
  left: Math.random() * 96 + 2,
  dur: 9 + Math.random() * 10,
  delay: -Math.random() * 19,
  size: 2 + Math.random() * 4,
  color: colors[Math.floor(Math.random() * colors.length)],
}));

const chainsBg = Array.from({ length: 10 }, () => ({
  left: Math.random() * 96 + 2,
  dur: 15 + Math.random() * 10,
  delay: -Math.random() * 20,
  opacity: 0.05 + Math.random() * 0.1,
}));

const current = computed(() =>
  index.value >= 0 && list.value[index.value] ? list.value[index.value] : null
);
const progressPercent = computed(() =>
  duration.value
    ? Math.min(100, Math.max(0, (currentTime.value / duration.value) * 100))
    : 0
);

const filteredList = computed(() => {
  const term = (searchTerm.value || "").trim().toLowerCase();
  if (!term) return list.value;
  return list.value.filter((i) => (i.title || "").toLowerCase().includes(term));
});

async function fetchList() {
  loading.value = true;
  try {
    const res = await getMusicList();
    const items =
      res?.ok && Array.isArray(res.list)
        ? res.list
        : Array.isArray(res)
        ? res
        : res?.list ?? [];
    list.value = items.map((it: any) => ({
      name: it.name,
      title: it.title ?? (it.name ? it.name.replace(/\.mp3$/i, "") : "未知"),
      url: getMusicUrl(it.name),
      duration: null,
    }));
  } catch (e) {
    console.error("获取音乐列表失败", e);
    list.value = [];
    errorMessage.value = "加载目录失败";
  } finally {
    loading.value = false;
  }
}

async function safeSetSrc(url: string) {
  const a = audioRef.value!;
  errorMessage.value = null;
  loadingAudio.value = true;
  try {
    a.src = url;
    a.load();
  } catch (err) {
    console.error("设置音源失败", err);
    errorMessage.value = "无法加载音频资源";
    throw err;
  }
}

async function loadCurrent(doPlay = false) {
  const a = audioRef.value;
  const curr = current.value;
  if (!a || !curr) return;
  a.pause();
  duration.value = 0;
  currentTime.value = 0;
  try {
    await safeSetSrc(curr.url || getMusicUrl(curr.name));
    if (doPlay) await play();
  } catch {
    playing.value = false;
    loadingAudio.value = false;
  }
}

async function play() {
  const a = audioRef.value;
  if (!a) return;
  try {
    await a.play();
    playing.value = true;
    errorMessage.value = null;
  } catch (e: any) {
    console.warn("播放失败", e);
    playing.value = false;
    errorMessage.value = "播放被浏览器阻止或资源不可用";
  }
}

function pause() {
  audioRef.value?.pause();
  playing.value = false;
}

function togglePlay() {
  const a = audioRef.value;
  if (!a) return;
  if (playing.value) {
    pause();
    return;
  }
  // 还没选曲时，按播放自动挑第一首
  if (index.value < 0 || !current.value) {
    if (!list.value.length) return;
    selectTrack(0);
    return;
  }
  play();
}

/** 原始下标：数据列表里的位置，不受搜索筛选影响 */
function selectTrack(originalIndex: number) {
  const item = list.value[originalIndex];
  if (!item) return;
  if (originalIndex === index.value) {
    togglePlay();
    return;
  }
  index.value = originalIndex;
  loadCurrent(true);
}

/** 模板 v-for 的是筛选后的列表，这里换算回原始下标 */
function selectTrackByFiltered(idxInFiltered: number) {
  const item = filteredList.value[idxInFiltered];
  if (!item) return;
  const originalIndex = list.value.findIndex((it) => it.name === item.name);
  if (originalIndex === -1) return;
  selectTrack(originalIndex);
}

function onTimeUpdate(e: Event) {
  const t = e.target as HTMLAudioElement;
  currentTime.value = t.currentTime || 0;
}

function onLoadedMetadata(e: Event) {
  const t = e.target as HTMLAudioElement;
  duration.value = isFinite(t.duration) ? t.duration : 0;
  if (current.value && !current.value.duration)
    current.value.duration = duration.value;
  loadingAudio.value = false;
}

function onEnded() {
  loadingAudio.value = false;
  if (repeatMode.value === "one") {
    if (audioRef.value) {
      audioRef.value.currentTime = 0;
      play();
    }
    return;
  }
  if (shuffle.value) {
    playRandom();
    return;
  }
  if (index.value < list.value.length - 1) selectTrack(index.value + 1);
  else {
    if (repeatMode.value === "all") selectTrack(0);
    else playing.value = false;
  }
}

function onAudioError() {
  console.error("audio error", audioRef.value?.error);
  errorMessage.value = "音频解析出错";
  playing.value = false;
  loadingAudio.value = false;
}

function next() {
  if (!list.value.length) return;
  if (shuffle.value) {
    playRandom();
    return;
  }
  if (index.value < list.value.length - 1) selectTrack(index.value + 1);
  else if (repeatMode.value === "all") selectTrack(0);
}

function prev() {
  if (!audioRef.value) return;
  if (audioRef.value.currentTime > 4) {
    audioRef.value.currentTime = 0;
    return;
  }
  if (index.value > 0) selectTrack(index.value - 1);
  else if (repeatMode.value === "all") selectTrack(list.value.length - 1);
}

function playRandom() {
  if (!list.value.length) return;
  if (list.value.length === 1) {
    selectTrack(0);
    return;
  }
  let i = index.value;
  while (i === index.value) i = Math.floor(Math.random() * list.value.length);
  selectTrack(i);
}

/* ---------- 进度条拖拽 ---------- */
function seekByClick(e: MouseEvent) {
  if (!progressWrap.value || !duration.value || !audioRef.value) return;
  const rect = progressWrap.value.getBoundingClientRect();
  const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
  audioRef.value.currentTime = (x / rect.width) * duration.value;
  currentTime.value = audioRef.value.currentTime;
}

/** 键盘微调：方向键 ±5 秒，Home/End 跳首尾 */
function seekTo(sec: number) {
  const a = audioRef.value;
  if (!a || !duration.value) return;
  const v = Math.min(Math.max(0, sec), duration.value);
  a.currentTime = v;
  currentTime.value = v;
}

function seekStep(delta: number) {
  const a = audioRef.value;
  if (!a || !duration.value) return;
  seekTo(a.currentTime + delta);
}

function onPointerDownProgress(e: PointerEvent) {
  if (!progressWrap.value || !audioRef.value || !duration.value) return;
  dragging.value = true;
  (e.target as Element).setPointerCapture?.(e.pointerId);
  window.addEventListener("pointermove", onPointerMoveProgress);
  window.addEventListener("pointerup", onPointerUpProgress);
  handlePointer(e);
}

function onPointerMoveProgress(e: PointerEvent) {
  handlePointer(e);
}

function onPointerUpProgress() {
  dragging.value = false;
  window.removeEventListener("pointermove", onPointerMoveProgress);
  window.removeEventListener("pointerup", onPointerUpProgress);
}

function handlePointer(e: PointerEvent) {
  if (!progressWrap.value || !audioRef.value || !duration.value) return;
  const rect = progressWrap.value.getBoundingClientRect();
  const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
  audioRef.value.currentTime = (x / rect.width) * duration.value;
  currentTime.value = audioRef.value.currentTime;
}

watch(volume, (v) => {
  if (audioRef.value) audioRef.value.volume = v;
  localStorage.setItem("suoming_volume", String(v));
});

function toggleShuffle() {
  shuffle.value = !shuffle.value;
}
function toggleRepeat() {
  if (repeatMode.value === "off") repeatMode.value = "all";
  else if (repeatMode.value === "all") repeatMode.value = "one";
  else repeatMode.value = "off";
}

function togglePlaylist() {
  playlistOpen.value = !playlistOpen.value;
  if (playlistOpen.value)
    nextTick(() => {
      const el = document.querySelector(".playlist li.active");
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
}

function clearSearch() {
  searchTerm.value = "";
}

function formatTime(sec?: number, fallback = "--:--") {
  if (sec === undefined || sec === null || !isFinite(sec)) return fallback;
  const s = Math.floor(sec % 60);
  const m = Math.floor(sec / 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** 观测窗视频：随屏幕方向切换素材 */
function pickVideo() {
  const base = import.meta.env.BASE_URL;
  const folder = isMobile.value ? "mp1" : "mp2";
  const idx = Math.floor(Math.random() * 3) + 1;
  videoSrc.value = `${base}${folder}/1 (${idx}).mp4`;
  videoClass.value = isMobile.value ? "landscape" : "portrait";
}

watch(isMobile, () => pickVideo());

onMounted(async () => {
  if (audioRef.value) audioRef.value.volume = volume.value;

  pickVideo();
  window.addEventListener("resize", onWindowResize);

  await fetchList();
  window.addEventListener("keydown", globalKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", globalKeydown);
  window.removeEventListener("resize", onWindowResize);
  window.removeEventListener("pointermove", onPointerMoveProgress);
  window.removeEventListener("pointerup", onPointerUpProgress);
  const a = audioRef.value;
  if (a) {
    a.pause();
    a.removeAttribute("src");
    a.load();
  }
});

function globalKeydown(e: KeyboardEvent) {
  if (e.code === "Escape") {
    pause();
    return;
  }
  if (e.code !== "Space") return;

  const el = document.activeElement as HTMLElement | null;
  const tag = el?.tagName ?? "";
  const isTyping =
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    !!el?.isContentEditable;
  /* 焦点在按钮/滑块上时，交给浏览器自己的空格行为，避免双触发 */
  const isControl = tag === "BUTTON" || el?.getAttribute("role") === "slider";
  if (isTyping || isControl) return;

  e.preventDefault();
  togglePlay();
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
@keyframes chainFall {
  from {
    transform: translateY(-100%) rotate(1deg);
  }
  to {
    transform: translateY(100%) rotate(-1deg);
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
@keyframes discSpin {
  to {
    transform: rotate(360deg);
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
@keyframes handlePulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba($red, 0.6);
  }
  50% {
    box-shadow: 0 0 0 8px rgba($red, 0);
  }
}

/* ============================================================
   根容器
   ============================================================ */
.suoming-player {
  position: relative;
  min-height: 100vh;
  padding: 60px clamp(16px, 3vw, 44px) 40px;
  background: $ink;
  font-family: $font-body;
  color: $paper;
  overflow-x: hidden;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  font-size: 16px;
  outline: none;
  display: flex;
  flex-direction: column;
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

.umb-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  &--outer {
    width: 150vw;
    height: 150vw;
    border: 1px dashed rgba($red, 0.15);
    animation: spin 70s linear infinite;
  }
  &--inner {
    width: 100vw;
    height: 100vw;
    border: 1px solid rgba($gold, 0.08);
    animation: spin 50s linear infinite reverse;
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
      rgba($gold, 0.4) 20%,
      rgba($red-lt, 0.5) 80%,
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

.embers {
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

.bg-grain {
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.vignette {
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
  text-align: center;
  margin-bottom: 32px;
}

.banner-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
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

.banner-title {
  margin: 0;
  font-family: $font-title;
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 400;
  letter-spacing: 0.15em;
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
  filter: drop-shadow(0 0 20px rgba($red, 0.5));
  animation: titleShimmer 8s linear infinite;
}

.banner-sub {
  margin: 8px 0 0;
  font-family: $font-en;
  font-size: clamp(10px, 1.1vw, 12px);
  letter-spacing: 0.5em;
  color: rgba($red-glow, 0.6);
  padding-left: 0.5em;
}

.banner-poem {
  margin: 14px 0 0;
  font-family: $font-title;
  font-size: 16px;
  letter-spacing: 0.2em;
  color: rgba($gold-lt, 0.8);
  text-shadow: 0 0 12px rgba($red, 0.5);
}

/* ============================================================
   主舞台
   ============================================================ */
.stage {
  position: relative;
  z-index: 5;
  display: flex;
  gap: clamp(20px, 3vw, 40px);
  max-width: 1200px;
  margin: 0 auto;
  align-items: flex-start;
  width: 100%;
}

/* ============================================================
   左侧：音频解析终端
   ============================================================ */
.player-deck {
  flex: 0 0 400px;
  padding: 24px 24px 22px;
  background: rgba($ink-2, 0.85);
  border: 1px solid rgba($gold, 0.2);
  box-shadow: inset 0 0 30px rgba($red, 0.1), 0 20px 50px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, $red-lt, transparent);
    box-shadow: 0 0 12px $red;
  }
}

/* ---- 观测窗与悬臂 ---- */
.deck-top {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  max-width: 340px;
  margin: 0 auto 20px;
  display: grid;
  place-items: center;
}

/* 机关盘 */
.disc {
  position: relative;
  width: 90%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(
      circle at 38% 32%,
      rgba($gold, 0.1) 0%,
      transparent 50%
    ),
    conic-gradient(
      from 0deg,
      $ink-3 0deg,
      #0d0508 40deg,
      $ink-3 80deg,
      #0d0508 130deg,
      $ink-3 180deg,
      #0d0508 230deg,
      $ink-3 280deg,
      #0d0508 330deg,
      $ink-3 360deg
    );
  border: 2px solid rgba($gold, 0.4);
  box-shadow: 0 0 0 8px rgba($ink-3, 0.8), 0 0 0 9px rgba($red, 0.2),
    0 20px 40px -10px rgba($red, 0.5), inset 0 0 60px rgba($red, 0.2);
  display: grid;
  place-items: center;
  transition: transform 0.5s ease;

  &.spinning {
    animation: discSpin 24s linear infinite;
  }
}

/* 外圈刻度 */
.disc-ticks {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px dashed rgba($gold, 0.2);
}

/* 内部轨道 */
.disc-groove {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba($gold, 0.1);
  pointer-events: none;
  &--1 {
    inset: 6%;
    border-color: rgba($red, 0.2);
  }
  &--2 {
    inset: 12%;
    border-color: rgba($gold, 0.15);
  }
}

/* 核心观测窗 */
.disc-face {
  position: relative;
  width: 78%;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba($gold, 0.6);
  box-shadow: inset 0 0 30px rgba($red, 0.4), 0 0 20px rgba($red, 0.3);
  background: $ink;
}

.video-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  &.landscape {
    aspect-ratio: 16 / 9;
  }
  &.portrait {
    aspect-ratio: 9 / 16;
  }
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba($ink, 0.8);
  z-index: 5;
}

.spinner,
.small-spinner {
  border-radius: 50%;
  border: 2px solid rgba($gold, 0.1);
  border-top-color: $red-lt;
  animation: spin 1s linear infinite;
}
.spinner {
  width: 36px;
  height: 36px;
}
.small-spinner {
  width: 18px;
  height: 18px;
  border-width: 3px;
  margin-right: 8px;
}
.loading-text {
  margin-top: 8px;
  color: $gold-lt;
  font-family: $font-title;
  letter-spacing: 0.15em;
  font-size: 14px;
}

/* 外圈保护环 */
.disc-ring {
  position: absolute;
  inset: 2%;
  border-radius: 50%;
  pointer-events: none;
  border: 1px dashed rgba($red, 0.4);
  animation: discSpin 60s linear infinite reverse;
  &::before {
    content: "";
    position: absolute;
    top: -4px;
    left: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transform: translateX(-50%);
    background: $gold-lt;
    box-shadow: 0 0 16px 4px rgba($gold, 0.9), 0 0 32px 8px rgba($red, 0.5);
  }
}

/* 机械悬臂 */
.tonearm {
  position: absolute;
  top: 4%;
  right: 2%;
  width: 60px;
  height: 120px;
  pointer-events: none;
  z-index: 4;
  transform-origin: top right;
  transform: rotate(-38deg);
  transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);

  &.playing {
    transform: rotate(-8deg);
  }

  .tonearm-base {
    position: absolute;
    top: 0;
    right: 0;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: radial-gradient(circle at 36% 30%, $gold-lt, $red 72%);
    box-shadow: 0 0 16px 3px rgba($red, 0.8), inset 0 0 8px rgba($gold, 0.4);
    z-index: 3;
  }
  .tonearm-arm {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 3px;
    height: 96px;
    background: linear-gradient(
      180deg,
      $gold-lt 0%,
      $gold 50%,
      rgba($gold, 0.6) 100%
    );
    border-radius: 2px;
    box-shadow: 0 0 8px rgba($gold, 0.6);
    transform-origin: top center;
  }
  .tonearm-head {
    position: absolute;
    bottom: 0;
    left: 4px;
    width: 20px;
    height: 16px;
    border-radius: 4px 4px 8px 8px;
    background: linear-gradient(180deg, $red, $blood);
    border: 1px solid rgba($gold, 0.5);
    box-shadow: 0 4px 12px -4px rgba($red, 1);
  }
}

/* 状态标签 */
.deck-label {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba($blood, 0.8);
  border: 1px solid $red-lt;
  font-family: $font-en;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: $gold-lt;
  z-index: 5;

  &__dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: $red-lt;
    box-shadow: 0 0 8px $red-lt;
    animation: pulseDot 1.4s ease-in-out infinite;
  }
}

/* ---- 下半部分控制台 ---- */
.deck-bottom {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.track-title {
  font-family: $font-title;
  font-size: 20px;
  letter-spacing: 0.08em;
  color: $paper;
  text-shadow: 0 0 14px rgba($red, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  min-height: 1.4em;
}

.track-time {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: $font-mono;
  font-size: 13px;
  color: rgba($paper, 0.5);
  .time--current {
    color: $gold-lt;
    text-shadow: 0 0 8px rgba($gold, 0.5);
  }
  .time-divider {
    color: rgba($red, 0.5);
  }
}

/* 频谱灯：播放时才跳，停下就伏回一条细线 */
.spectrum {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 16px;
  margin-top: 8px;
  opacity: 0.35;
  transition: opacity 0.4s ease;

  span {
    width: 2px;
    height: 3px;
    border-radius: 1px;
    background: linear-gradient(180deg, $gold-lt, $red);
    box-shadow: 0 0 6px rgba($red, 0.5);
    transition: height 0.3s ease;
  }

  &.on {
    opacity: 1;
    span {
      animation: spectrumJump 1.05s ease-in-out infinite;
      animation-delay: calc(var(--i) * 0.11s);
    }
  }
}

@keyframes spectrumJump {
  0%,
  100% {
    height: 4px;
  }
  35% {
    height: 15px;
  }
  60% {
    height: 8px;
  }
}

/* 能量进度条 */
.progress-wrap {
  position: relative;
  cursor: pointer;
  touch-action: none;
  padding: 8px 0;
}

.progress-bar {
  height: 4px;
  background: rgba($gold, 0.15);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, $blood, $red-lt, $gold-lt);
  border-radius: 2px;
  transition: width 120ms linear;
  position: relative;
  z-index: 1;
}

.progress-glow {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(90deg, $blood, $red-lt, $gold-lt);
  filter: blur(4px);
  opacity: 0.6;
  border-radius: 2px;
  transition: width 120ms linear;
}

/* 菱形滑块 */
.progress-handle {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  background: $paper;
  border: 1px solid $red-lt;
  transform: translate(-50%, -50%) rotate(45deg);
  box-shadow: 0 0 10px $red-lt, inset 0 0 4px $red;
  animation: handlePulse 2s ease-in-out infinite;
  pointer-events: none;
}

/* 按钮控制 */
.console {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 4px;
}
.console-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.ctrl-btn {
  position: relative;
  border: none;
  background: none;
  color: $gold-lt;
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;

  &--side {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    background: rgba($ink, 0.6);
    border: 1px solid rgba($gold, 0.3);
    clip-path: polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%);
    transition: all 0.3s ease;
    .ctrl-icon {
      font-size: 20px;
      line-height: 1;
      color: $gold-lt;
    }

    &:hover {
      transform: translateY(-2px);
      background: rgba($blood, 0.4);
      border-color: $red-lt;
      box-shadow: 0 4px 15px rgba($red, 0.3);
    }
    &:active {
      transform: translateY(0) scale(0.95);
    }
  }

  &--play {
    width: 64px;
    height: 64px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, $blood, $red);
    border: 1px solid $red-lt;
    clip-path: polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%);
    box-shadow: 0 4px 20px rgba($red, 0.5);
    overflow: hidden;

    .play-shine {
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
      animation: shineSweep 3s ease-in-out infinite;
      pointer-events: none;
    }

    .play-icon {
      position: relative;
      z-index: 1;
      font-size: 22px;
      color: $paper;
      text-shadow: 0 0 10px rgba($gold, 0.8);
      &--pause {
        font-size: 18px;
        letter-spacing: 2px;
      }
    }

    &:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 25px rgba($red, 0.7);
    }
    &:active:not(:disabled) {
      transform: translateY(0) scale(0.98);
    }
  }
}

/* 辅助控制（随机、循环、音量） */
.console-aux {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px dashed rgba($gold, 0.2);
  flex-wrap: wrap;
}

.mode-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba($ink, 0.5);
  border: 1px solid rgba($gold, 0.2);
  color: rgba($paper, 0.6);
  font-family: $font-title;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.1em;

  .mode-icon {
    font-size: 12px;
  }

  &:hover {
    border-color: rgba($red, 0.5);
    color: $paper;
  }
  &.active {
    border-color: $red-lt;
    background: rgba($blood, 0.3);
    color: $gold-lt;
    box-shadow: inset 0 0 10px rgba($red, 0.2);
  }
}

.volume {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  .volume-icon {
    font-size: 12px;
    color: $gold-lt;
  }

  input[type="range"] {
    width: 80px;
    height: 3px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba($gold, 0.2);
    border-radius: 2px;
    outline: none;
    cursor: pointer;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 10px;
      height: 10px;
      background: $red-lt;
      transform: rotate(45deg);
      box-shadow: 0 0 8px $red;
    }
  }
}

.error-msg {
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba($blood, 0.3);
  border-left: 2px solid $red-lt;
  color: $red-glow;
  font-size: 13px;
}

/* ============================================================
   右侧：频率档案列表
   ============================================================ */
.playlist-deck {
  flex: 1;
  min-width: 0;
  max-height: 78vh;
  display: flex;
  flex-direction: column;
  padding: 20px 22px;
  background: rgba($ink-2, 0.85);
  border: 1px solid rgba($gold, 0.2);
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5), 0 20px 50px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  transition: max-height 0.36s ease;

  &.collapsed {
    max-height: 72px;
  }
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  margin-bottom: 12px;
  border-bottom: 1px dashed rgba($gold, 0.2);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 50px;
    height: 1px;
    background: linear-gradient(90deg, $red-lt, transparent);
    box-shadow: 0 0 10px $red;
  }
}

.left-head {
  display: flex;
  gap: 12px;
  align-items: center;
}

.playlist-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-family: $font-title;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0.15em;
  color: $paper;
  text-shadow: 0 0 12px rgba($red, 0.4);
  &-mark {
    font-size: 12px;
    color: $red-lt;
    animation: pulseDot 3.2s ease-in-out infinite;
  }
}

.api-hint {
  color: rgba($paper, 0.4);
  font-size: 13px;
}
.toggle-list-text {
  display: none;
  padding: 4px 10px;
  background: transparent;
  border: 1px solid rgba($gold, 0.3);
  color: $gold-lt;
  font-family: $font-title;
  font-size: 12px;
  cursor: pointer;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba($ink, 0.6);
  border: 1px solid rgba($gold, 0.2);
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: rgba($red, 0.6);
  }
  .search-icon {
    font-size: 14px;
    color: rgba($gold-lt, 0.5);
  }
  input {
    padding: 2px 0;
    border: none;
    background: transparent;
    color: $paper;
    font-family: inherit;
    font-size: 14px;
    width: 140px;
    outline: none;
    &::placeholder {
      color: rgba($paper, 0.3);
    }
  }
  .clear {
    background: transparent;
    border: none;
    color: rgba($paper, 0.4);
    cursor: pointer;
    &:hover {
      color: $red-lt;
    }
  }
}

/* 曲单脚注：手写的一句 */
.playlist-note {
  margin: 0 20px 10px;
  padding-top: 10px;
  border-top: 1px dashed rgba($gold, 0.14);
  font-family: "MaShanZheng", "Noto Serif SC", serif;
  font-size: 12.5px;
  letter-spacing: 0.06em;
  line-height: 1.7;
  color: rgba($gold, 0.42);
  text-align: right;
}

.list-area {
  position: relative;
  flex: 1;
  overflow: auto;
  min-height: 0;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba($red, 0.4);
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba($red-lt, 0.7);
  }
}
.list-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba($paper, 0.5);
  padding: 20px 0;
  font-family: $font-title;
  letter-spacing: 0.1em;
}

.playlist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  li {
    position: relative;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 16px 12px 34px;
    cursor: pointer;
    background: rgba($ink, 0.4);
    border: 1px solid rgba($gold, 0.1);
    transition: all 0.3s ease;

    /* 左侧状态指示（锁扣） */
    .lamp-wick {
      position: absolute;
      top: 50%;
      left: 12px;
      width: 8px;
      height: 8px;
      margin-top: -4px;
      border: 1px solid rgba($gold, 0.5);
      transform: rotate(45deg);
      background: $ink;
      transition: all 0.3s ease;
    }

    .left-col {
      flex: 1;
      min-width: 0;
      .title {
        font-size: 15px;
        color: rgba($paper, 0.8);
        letter-spacing: 0.02em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.3s ease;
      }
    }

    .right-col {
      flex-shrink: 0;
      .len {
        font-family: $font-mono;
        font-size: 13px;
        color: rgba($paper, 0.4);
      }
    }

    &:hover {
      border-color: rgba($red, 0.4);
      background: rgba($blood, 0.15);
      transform: translateX(4px);
      .lamp-wick {
        border-color: $red-lt;
        box-shadow: 0 0 8px $red;
      }
      .title {
        color: $paper;
      }
    }

    &.active {
      border-color: $red-lt;
      background: linear-gradient(90deg, rgba($blood, 0.4), rgba($ink, 0.4));
      box-shadow: inset 3px 0 0 $red-lt;
      .lamp-wick {
        background: $red-lt;
        border-color: $paper;
        box-shadow: 0 0 10px $red-lt;
        animation: pulseDot 2s infinite;
      }
      .title {
        color: $gold-lt;
        font-weight: 600;
        text-shadow: 0 0 8px rgba($gold, 0.5);
      }
      .len {
        color: $red-glow;
      }
    }
  }
}

/* 曲目副标：正在解析 / 已挂起 */
.playlist li .left-col .sub {
  margin-top: 3px;
  font-size: 11px;
  letter-spacing: 0.22em;
  color: rgba($red-glow, 0.7);
}
.playlist li.playing .lamp-wick {
  background: $gold-lt;
  box-shadow: 0 0 12px $gold;
}

/* 空列表 / 检索无果 */
.list-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin: 26px 4px 8px;
  padding: 34px 20px 30px;
  text-align: center;
  border: 1px dashed rgba($gold, 0.22);
  background: rgba($ink, 0.35);

  &__seal {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    margin-bottom: 8px;
    font-family: $font-title;
    font-size: 19px;
    color: rgba($paper, 0.85);
    border: 1px solid rgba($red, 0.55);
    background: rgba($blood, 0.35);
    transform: rotate(-3deg);
  }

  &__title {
    margin: 0;
    font-family: $font-title;
    font-size: 19px;
    letter-spacing: 0.08em;
    color: rgba($gold-lt, 0.85);
  }

  &__desc {
    margin: 0;
    font-size: 13px;
    line-height: 1.9;
    color: rgba($paper, 0.42);
  }

  &__btn {
    margin-top: 12px;
    padding: 7px 18px;
    font-size: 12px;
    letter-spacing: 0.16em;
    color: rgba($paper, 0.75);
    background: transparent;
    border: 1px solid rgba($gold, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      color: $gold-lt;
      border-color: rgba($gold-lt, 0.7);
      background: rgba($blood, 0.25);
    }
  }
}

/* 进度条获得焦点时给一条可见的提示光 */
.progress-wrap:focus-visible {
  outline: none;
  box-shadow: 0 0 0 1px rgba($gold-lt, 0.45), 0 0 14px rgba($red, 0.35);
}

/* ============================================================
   响应式
   ============================================================ */
@media (max-width: 920px) {
  .suoming-player {
    padding: 40px 14px 28px;
  }
  .top-banner {
    margin-bottom: 22px;
  }
  .banner-inner {
    gap: 12px;
  }
  .banner-line {
    width: 40px;
  }
  .banner-title {
    letter-spacing: 0.1em;
  }

  .stage {
    flex-direction: column;
    gap: 20px;
  }
  .player-deck {
    flex: 0 0 auto;
    width: 100%;
    padding: 20px 20px 18px;
  }
  .deck-top {
    max-width: 260px;
    margin-bottom: 16px;
  }
  .tonearm {
    width: 50px;
    height: 100px;
  }
  .track-title {
    font-size: 18px;
  }
  .ctrl-btn--play {
    width: 56px;
    height: 56px;
  }

  .playlist-deck {
    max-height:  calc(100vh - 320px);
    width: 100%;
  }
  .toggle-list-text {
    display: inline-block;
  }
  .search-wrap input {
    width: 120px;
  }
}

@media (max-width: 520px) {
  .player-deck {
    padding: 18px 16px;
  }
  .deck-top {
    max-width: 220px;
  }
  .console-aux {
    gap: 8px;
  }
  .mode-btn {
    padding: 5px 10px;
    font-size: 12px;
  }
  .volume {
    margin-left: 0;
    flex: 1;
    input[type="range"] {
      width: 100%;
    }
  }
  .search-wrap {
    padding: 5px 10px;
    input {
      width: 100px;
      font-size: 13px;
    }
  }
  .playlist li {
    padding: 10px 12px 10px 30px;
    .title {
      font-size: 14px;
    }
  }
}

/* ============================================================
   减弱动效
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .umb-ring,
  .bg-chains span,
  .embers span,
  .disc,
  .disc-ring,
  .deck-label__dot,
  .progress-handle,
  .play-shine,
  .banner-title,
  .playlist-title-mark,
  .lamp-wick {
    animation: none !important;
  }
  .disc.spinning {
    animation: none;
  }
  .tonearm {
    transition: none;
  }
  .ctrl-btn,
  .mode-btn,
  .playlist li {
    transition: none !important;
  }
}
</style>
