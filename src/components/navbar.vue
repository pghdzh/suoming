<template>
  <div class="dock-root">
    <!-- ===== 暝色 · 红尘雾光 ===== -->
    <div class="dock-aura" aria-hidden="true"></div>

    <!-- ============================================================
         桌面端：左侧「十契」锁链
         ============================================================ -->
    <aside class="dock" aria-label="锁暝 · 十契导航">
      <span class="dock__veil" aria-hidden="true"></span>
      <span class="dock__veil-shine" aria-hidden="true"></span>
      <span class="dock__corners" aria-hidden="true"></span>

      <!-- ===== 镜印 · 归暝 ===== -->
      <a class="seal" href="#/" aria-label="锁暝 · 归暝" @click.prevent="go('/')">
        <span class="seal__aura" aria-hidden="true"></span>
        <span class="seal__ring" aria-hidden="true"></span>
        <span class="seal__disc" aria-hidden="true"></span>
        <span class="seal__char" aria-hidden="true">锁</span>

        <span class="fly" aria-hidden="true">
          <span class="fly__panel fly__panel--seal">
            <span class="fly__name">锁暝</span>
            <span class="fly__motto">镜锁妄世 · 心照红尘</span>
            <span class="fly__meta">梦州华亭 · 州监 · 执掌谛天鉴</span>
          </span>
        </span>
      </a>

      <span class="dock__rule" aria-hidden="true"></span>

      <!-- ===== 十契 ===== -->
      <nav class="chain" aria-label="页面">
        <span class="chain__wire" aria-hidden="true"></span>
        <span class="chain__flow" aria-hidden="true"></span>
        <span class="chain__flow chain__flow--b" aria-hidden="true"></span>

        <ul class="chain__list">
          <li v-for="(item, i) in navItems" :key="item.path" class="chain__item">
            <a
              class="chain__link"
              :class="{
                'is-active': isActive(item.path),
                'is-sealed': item.disabled,
              }"
              :href="item.disabled ? undefined : '#' + item.path"
              :aria-current="isActive(item.path) ? 'page' : undefined"
              :aria-disabled="item.disabled ? 'true' : undefined"
              :aria-label="item.disabled ? `${item.name} · 未启` : item.name"
              @click.prevent="open(item)"
            >
              <span class="node" aria-hidden="true">
                <span class="node__glyph">{{ item.glyph }}</span>
                <span v-if="item.disabled" class="node__seal">封</span>
              </span>

              <span class="fly" aria-hidden="true">
                <span class="fly__panel">
                  <span class="fly__num">{{ nums[i] }}</span>
                  <span class="fly__body">
                    <span class="fly__name">{{ item.name }}</span>
                    <span class="fly__sub">
                      {{ item.en }} · {{ item.disabled ? "尚未开启" : item.hint }}
                    </span>
                  </span>
                </span>
              </span>
            </a>
          </li>

          <!-- 第十契 · 同道 -->
          <li class="chain__item">
            <a
              class="chain__link chain__link--ext"
              :href="extItem.href"
              target="_blank"
              rel="noopener"
              :aria-label="extItem.name"
            >
              <span class="node" aria-hidden="true">
                <span class="node__glyph">{{ extItem.glyph }}</span>
              </span>

              <span class="fly" aria-hidden="true">
                <span class="fly__panel">
                  <span class="fly__num">{{ nums[navItems.length] }}</span>
                  <span class="fly__body">
                    <span class="fly__name">{{ extItem.name }}</span>
                    <span class="fly__sub">{{ extItem.en }} · {{ extItem.hint }}</span>
                  </span>
                </span>
              </span>
            </a>
          </li>
        </ul>
      </nav>

      <span class="dock__rule" aria-hidden="true"></span>

      <!-- ===== 契音 / 在线 ===== -->
      <div class="dock-tools">
        <div class="bgm" :class="{ 'is-playing': isPlaying }">
          <button
            class="bgm__btn"
            type="button"
            :aria-label="isPlaying ? '暂停契音' : '播放契音'"
            @click="togglePlay"
          >
            <span class="bgm__ring" aria-hidden="true"></span>
            <svg v-if="!isPlaying" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.4 5.4v13.2L18.6 12 8.4 5.4Z" />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <rect x="7" y="5" width="3.4" height="14" rx="1.1" />
              <rect x="13.6" y="5" width="3.4" height="14" rx="1.1" />
            </svg>
            <span v-if="isPlaying" class="bgm__eq" aria-hidden="true">
              <i></i><i></i><i></i>
            </span>
          </button>

          <span class="fly">
            <span class="fly__panel fly__panel--tool">
              <span class="fly__sub">{{ isPlaying ? "契音流转中" : "契音已止" }}</span>
              <button class="fly__song" type="button" title="点击切换曲目" @click="switchSong">
                {{ currentSong.name }}
              </button>
              <span class="fly__progress" aria-hidden="true">
                <i :style="{ width: bgmPercent + '%' }"></i>
              </span>
              <span class="fly__meta">点击曲名 · 换一阕</span>
            </span>
          </span>
        </div>

        <div class="online" :title="`当前在线 ${onlineCount ?? 0} 人`">
          <span class="online__dot" aria-hidden="true"></span>
          <span class="online__num">{{ onlineCount ?? "--" }}</span>

          <span class="fly" aria-hidden="true">
            <span class="fly__panel fly__panel--tool">
              <span class="fly__sub">梦州此刻</span>
              <span class="fly__name">{{ onlineCount ?? "--" }} 人在线</span>
            </span>
          </span>
        </div>
      </div>
    </aside>

    <!-- ============================================================
         歌词 · 题于左下
         ============================================================ -->
    <Transition name="lyric">
      <div v-if="isPlaying && currentLyricText" class="lyric" aria-hidden="true">
        <span class="lyric__bar"></span>
        <span class="lyric__seal">契</span>
        <span class="lyric__body">
          <span :key="currentLyricIndex" class="lyric__text">
            {{ currentLyricText }}
          </span>
          <span class="lyric__meta">{{ currentSong.name }}</span>
        </span>
      </div>
    </Transition>

    <!-- ============================================================
         移动端：锁印 + 契卷
         ============================================================ -->
    <button
      v-show="!gateOpen"
      class="fab"
      type="button"
      aria-label="打开十契目录"
      :aria-expanded="gateOpen"
      @click="gateOpen = true"
    >
      <span class="fab__ring" aria-hidden="true"></span>
      <span class="fab__char" aria-hidden="true">锁</span>
    </button>

    <Transition name="gate">
      <div v-if="gateOpen" class="gate">
        <div class="gate__veil" @click="gateOpen = false"></div>

        <div
          ref="gateSheet"
          class="gate__sheet"
          role="dialog"
          aria-modal="true"
          aria-label="十契目录"
        >
          <span class="gate__edge" aria-hidden="true"></span>

          <header class="gate__head">
            <span class="gate__seal" aria-hidden="true">锁</span>
            <span class="gate__title">
              <span class="gate__name">锁暝</span>
              <span class="gate__sub">禁锁十契 · SUO MING</span>
            </span>
            <button class="gate__close" type="button" aria-label="关闭" @click="gateOpen = false">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <ul class="gate__list">
            <li
              v-for="(item, i) in navItems"
              :key="item.path"
              :style="{ '--d': `${i * 45}ms` }"
            >
              <a
                class="gate__item"
                :class="{ 'is-active': isActive(item.path), 'is-sealed': item.disabled }"
                :href="item.disabled ? undefined : item.path"
                :aria-disabled="item.disabled ? 'true' : undefined"
                @click.prevent="open(item)"
              >
                <span class="gate__num">{{ nums[i] }}</span>
                <span class="gate__glyph">{{ item.glyph }}</span>
                <span class="gate__label">
                  <span class="gate__label-name">{{ item.name }}</span>
                  <span class="gate__label-sub">
                    {{ item.en }} · {{ item.disabled ? "尚未开启" : item.hint }}
                  </span>
                </span>
                <span class="gate__arrow" aria-hidden="true">
                  {{ item.disabled ? "封" : "›" }}
                </span>
              </a>
            </li>

            <li :style="{ '--d': `${navItems.length * 45}ms` }">
              <a class="gate__item gate__item--ext" :href="extItem.href" target="_blank" rel="noopener">
                <span class="gate__num">{{ nums[navItems.length] }}</span>
                <span class="gate__glyph">{{ extItem.glyph }}</span>
                <span class="gate__label">
                  <span class="gate__label-name">{{ extItem.name }}</span>
                  <span class="gate__label-sub">{{ extItem.en }} · {{ extItem.hint }}</span>
                </span>
                <span class="gate__arrow" aria-hidden="true">›</span>
              </a>
            </li>
          </ul>

          <footer class="gate__foot">
            <span class="gate__stat">
              <span class="online__dot" aria-hidden="true"></span>
              <span>{{ onlineCount ?? "--" }} 人在线</span>
            </span>
            <button class="gate__bgm" type="button" @click="togglePlay">
              <span class="gate__bgm-mark" aria-hidden="true">♪</span>
              <span>{{ isPlaying ? "止" : "奏" }} · {{ currentSong.name }}</span>
            </button>
          </footer>

          <p class="gate__hint" aria-hidden="true">
            点击锁印 · 或按 Esc 收起契卷
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { io } from "socket.io-client";

/* ========== 十契目录 ========== */
interface NavItem {
  name: string;
  en: string;
  hint: string;
  glyph: string;
  path: string;
  /** 契未启：只显牌位，不入路由 */
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { name: "首页", en: "HOME", hint: "归暝", glyph: "暝", path: "/" },
  { name: "人物介绍", en: "PROFILE", hint: "生平", glyph: "人", path: "/timeLine" },
  { name: "留言板", en: "MESSAGE", hint: "契言", glyph: "言", path: "/message" },
  { name: "图集", en: "GALLERY", hint: "镜影", glyph: "影", path: "/gallery" },
  { name: "资源分享", en: "RESOURCE", hint: "藏鉴", glyph: "鉴", path: "/resources" },
  { name: "AI对话", en: "DIALOGUE", hint: "问契", glyph: "问", path: "/talk" },
  // 第七契 · 合：路由已暂时注释（src/router/index.ts），故此处封印
  // { name: "合成心月狐", en: "GAME", hint: "合契", glyph: "合", path: "/game", disabled: true },
  { name: "曲库", en: "MUSIC", hint: "梵音", glyph: "音", path: "/music" },
  { name: "文本分享", en: "TEXT", hint: "文录", glyph: "文", path: "/wiki" },
];

const extItem = {
  name: "其他角色",
  en: "ECHOES",
  hint: "同道",
  glyph: "他",
  href: "https://slty.site/#/redirector",
};

/* 禁锁十契 · 壹至拾 */
const nums = ["壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾"];

const route = useRoute();
const router = useRouter();

/* ========== 移动端契卷 ========== */
const gateOpen = ref(false);

function go(path: string) {
  gateOpen.value = false;
  if (route.path !== path) router.push(path);
}

function open(item: NavItem) {
  if (item.disabled) return;
  go(item.path);
}

function isActive(path: string) {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") gateOpen.value = false;
}

watch(
  () => route.path,
  () => {
    gateOpen.value = false;
  }
);

/* ========== 在线人数（Socket） ========== */
const siteId = "suoming";
const onlineCount = ref<number | null>(null);
let socket: ReturnType<typeof io> | null = null;

/* ========== 契音 · BGM 播放器 ========== */
const songs = [
  {
    name: "千劫起，一念生",
    url: `${import.meta.env.VITE_API_BASE_URL}/music/千劫起，一念生.mp3`,
    /* 用 BASE_URL 拼：base:'./' 部署到子目录时也能找到歌词 */
    lrcUrl: encodeURI(`${import.meta.env.BASE_URL}千劫起，一念生.lrc`),
  },
  {
    name: "万相倾覆，天坠地逆",
    url: `${import.meta.env.VITE_API_BASE_URL}/music/万相倾覆，天坠地逆.mp3`,
    lrcUrl: encodeURI(`${import.meta.env.BASE_URL}万相倾覆，天坠地逆.lrc`),
  },
];

const currentSongIndex = ref(0);
const currentSong = computed(() => songs[currentSongIndex.value]);
const isPlaying = ref(false);
const audio = ref<HTMLAudioElement | null>(null);
const lyrics = ref<{ time: number; text: string }[]>([]);
const currentLyricIndex = ref(0);
const currentLyricText = computed(() => {
  if (lyrics.value.length === 0) return "";
  return lyrics.value[currentLyricIndex.value]?.text || "";
});

/* 契音进度：悬停面板上的一线细光 */
const bgmTime = ref(0);
const bgmDuration = ref(0);
const bgmPercent = computed(() =>
  bgmDuration.value
    ? Math.min(100, Math.max(0, (bgmTime.value / bgmDuration.value) * 100))
    : 0
);

function connectSocket() {
  try {
    socket = io(import.meta.env.VITE_API_BASE_URL, {
      query: { siteId },
      reconnectionAttempts: 5,
      timeout: 8000,
    });
    socket.on("onlineCount", (count: number) => {
      onlineCount.value = Number(count) || 0;
    });
    /* 后台没起来就安静显示占位符，别让访客看到报错 */
    socket.on("connect_error", () => {
      onlineCount.value = null;
    });
  } catch (err) {
    console.warn("在线人数连接失败", err);
  }
}

/* 契卷展开时锁住背后页面，合上再还回去 */
const gateSheet = ref<HTMLElement | null>(null);

watch(gateOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
  if (open) {
    nextTick(() => {
      gateSheet.value
        ?.querySelector<HTMLElement>(".gate__close")
        ?.focus({ preventScroll: true });
    });
  }
});

onMounted(() => {
  connectSocket();

  audio.value = new Audio();
  audio.value.addEventListener("timeupdate", handleTimeUpdate);
  audio.value.addEventListener("ended", () => {
    isPlaying.value = false;
  });
  loadSong(currentSongIndex.value);

  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  socket?.disconnect();
  socket = null;

  if (audio.value) {
    audio.value.pause();
    audio.value.removeEventListener("timeupdate", handleTimeUpdate);
    audio.value = null;
  }
  document.body.style.overflow = "";
  window.removeEventListener("keydown", onKeydown);
});

async function loadSong(index: number, autoPlay = false) {
  if (!audio.value) return;
  const song = songs[index];
  audio.value.src = song.url;
  audio.value.load();
  isPlaying.value = false;
  lyrics.value = [];
  currentLyricIndex.value = 0;

  fetch(song.lrcUrl)
    .then((res) => {
      if (!res.ok) throw new Error("LRC load failed");
      return res.text();
    })
    .then((text) => {
      lyrics.value = parseLrc(text);
    })
    .catch(() => {
      lyrics.value = [];
      console.warn(`歌词加载失败：${song.lrcUrl}`);
    });

  /* 切歌续播：等音源就绪再 play，避免直接 play 落空 */
  if (autoPlay) {
    try {
      await audio.value.play();
      isPlaying.value = true;
    } catch (err) {
      console.warn("续播失败", err);
      isPlaying.value = false;
    }
  }
}

function parseLrc(lrcText: string): { time: number; text: string }[] {
  const lines = lrcText.split("\n");
  const result: { time: number; text: string }[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
  for (const line of lines) {
    const text = line.replace(timeRegex, "").trim();
    if (!text) continue;
    const times = [...line.matchAll(timeRegex)].map((match) => {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const millis = parseInt(match[3].padEnd(3, "0"));
      return minutes * 60 + seconds + millis / 1000;
    });
    for (const t of times) {
      result.push({ time: t, text });
    }
  }
  return result.sort((a, b) => a.time - b.time);
}

async function togglePlay() {
  if (!audio.value) return;
  if (isPlaying.value) {
    audio.value.pause();
    isPlaying.value = false;
    return;
  }
  if (!audio.value.src) {
    loadSong(currentSongIndex.value);
  }
  try {
    await audio.value.play();
    isPlaying.value = true; /* 等 play() 真的成功再切状态 */
  } catch (err) {
    console.warn("播放失败", err);
    isPlaying.value = false;
  }
}

function switchSong() {
  const wasPlaying = isPlaying.value;
  currentSongIndex.value = (currentSongIndex.value + 1) % songs.length;
  loadSong(currentSongIndex.value, wasPlaying);
}

function handleTimeUpdate() {
  if (!audio.value) return;
  bgmTime.value = audio.value.currentTime || 0;
  bgmDuration.value = Number.isFinite(audio.value.duration)
    ? audio.value.duration
    : 0;
  if (lyrics.value.length === 0) return;
  const currentTime = audio.value.currentTime;
  let index = 0;
  for (let i = 0; i < lyrics.value.length; i++) {
    if (currentTime >= lyrics.value[i].time) {
      index = i;
    } else {
      break;
    }
  }
  currentLyricIndex.value = index;
}
</script>

<style scoped lang="scss">
/* 字体统一在 src/styles/theme.scss 声明，这里不再重复 @font-face */

/* ============================================================
   锁暝配色 · 以绯红为骨，契金为饰，紫电为气
   暝黑 / 血绯 / 电紫 / 契金 / 镜银
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

$font-brush: "MaShanZheng", "Noto Serif SC", "Source Han Serif SC", "Songti SC",
  Georgia, serif;
$font-ui: "Inter", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
$font-mono: ui-monospace, "SF Mono", "Cascadia Mono", Consolas, monospace;

/* 契牌六角 */
$hex: polygon(50% 0%, 100% 22%, 100% 78%, 50% 100%, 0% 78%, 0% 22%);

/* ============================================================
   根容器
   ============================================================ */
.dock-root {
  position: fixed;
  inset: 0;
  z-index: 900;
  pointer-events: none;
  font-family: $font-ui;
  -webkit-font-smoothing: antialiased;

  --hex: #{$hex};
  --tile: clamp(30px, 4vh, 42px);
  --gap: clamp(4px, 0.85vh, 9px);
}

/* 红尘雾光：左侧一抹血色，衬紫电一线 */
.dock-aura {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -18vw;
  width: 66vw;
  pointer-events: none;
  background: radial-gradient(44% 64% at 0% 30%, rgba($red, 0.4), transparent 72%),
    radial-gradient(34% 46% at 1% 76%, rgba($blood, 0.5), transparent 74%),
    radial-gradient(22% 26% at 4% 52%, rgba($violet, 0.16), transparent 76%);
  filter: blur(26px);
  opacity: 0.92;
}

/* ============================================================
   侧栏
   ============================================================ */
.dock {
  position: absolute;
  left: clamp(8px, 1.1vw, 18px);
  top: 50%;
  z-index: 2;
  transform: translateY(-50%);
  width: 68px;
  max-height: calc(100vh - 16px);
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-radius: 30px;
  border: 1px solid rgba($red, 0.26);
  pointer-events: auto;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    left: 50%;
    top: -1px;
    width: 28px;
    height: 1px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, transparent, $gold-lt, transparent);
    opacity: 0.9;
    z-index: 3;
  }

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -1px;
    width: 22px;
    height: 1px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, transparent, $red-lt, transparent);
    opacity: 0.85;
    z-index: 3;
  }
}

/* 玻璃底 · 暝色带血 */
.dock__veil {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba($ink-3, 0.96) 0%, rgba($ink-2, 0.94) 48%, rgba($ink, 0.95) 100%),
    radial-gradient(72% 16% at 50% 0%, rgba($red, 0.34), transparent 74%);
  backdrop-filter: blur(22px) saturate(170%);
  -webkit-backdrop-filter: blur(22px) saturate(170%);
  box-shadow: 0 30px 78px -40px #000, inset 0 1px 0 rgba($gold-lt, 0.12),
    inset 0 -1px 0 rgba($red, 0.22), 0 0 50px -28px rgba($red-lt, 0.95);
}

/* 镜面反光 */
.dock__veil-shine {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  overflow: hidden;
  background: linear-gradient(
    118deg,
    transparent 30%,
    rgba($mirror, 0.09) 43%,
    rgba($mirror, 0.02) 49%,
    transparent 58%
  );
  pointer-events: none;
}

/* 四角契角 */
.dock__corners {
  position: absolute;
  inset: 7px;
  border-radius: 24px;
  pointer-events: none;
  opacity: 0.42;
  background: linear-gradient($gold-lt, $gold-lt) left top / 7px 1px no-repeat,
    linear-gradient($gold-lt, $gold-lt) left top / 1px 7px no-repeat,
    linear-gradient($gold-lt, $gold-lt) right top / 7px 1px no-repeat,
    linear-gradient($gold-lt, $gold-lt) right top / 1px 7px no-repeat,
    linear-gradient($red-lt, $red-lt) left bottom / 7px 1px no-repeat,
    linear-gradient($red-lt, $red-lt) left bottom / 1px 7px no-repeat,
    linear-gradient($red-lt, $red-lt) right bottom / 7px 1px no-repeat,
    linear-gradient($red-lt, $red-lt) right bottom / 1px 7px no-repeat;
}

/* 分隔线 */
.dock__rule {
  width: 62%;
  height: 1px;
  flex: none;
  background: linear-gradient(
    90deg,
    transparent,
    rgba($red, 0.55) 28%,
    rgba($gold, 0.55) 50%,
    rgba($red, 0.55) 72%,
    transparent
  );
  opacity: 0.65;
}

/* ============================================================
   镜印 · 锁
   ============================================================ */
.seal {
  position: relative;
  flex: none;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  text-decoration: none;
  border-radius: 50%;
  transition: transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);

  &:hover {
    transform: scale(1.06);
  }

  &:hover .seal__char {
    text-shadow: 0 0 12px rgba($gold-lt, 1), 0 0 30px rgba($red-lt, 1),
      0 0 56px rgba($red, 0.9);
  }

  &:focus-visible {
    outline: 1px solid rgba($gold-lt, 0.85);
    outline-offset: 3px;
  }
}

.seal__aura {
  position: absolute;
  inset: -48%;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba($red, 0.62) 0%, rgba($blood, 0.34) 44%, transparent 68%);
  filter: blur(10px);
  opacity: 0.85;
  animation: auraBreath 6s ease-in-out infinite;
  pointer-events: none;
}

.seal__disc {
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  background: radial-gradient(circle at 34% 24%, rgba($red-lt, 0.72) 0%, rgba($red, 0.62) 38%, rgba($ink-3, 0.98) 84%),
    radial-gradient(circle at 70% 84%, rgba($blood, 0.9), transparent 62%);
  border: 1px solid rgba($gold, 0.62);
  box-shadow: inset 0 0 16px rgba($gold, 0.24), inset 0 0 28px rgba($red, 0.5),
    0 0 26px -6px rgba($red-lt, 0.95);
}

.seal__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px dashed rgba($gold, 0.46);
  animation: sealSpin 30s linear infinite;

  &::after {
    content: "";
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    border: 1px solid transparent;
    border-top-color: rgba($red-lt, 0.95);
    border-bottom-color: rgba($gold-lt, 0.6);
    animation: sealSpin 9s linear infinite reverse;
  }
}

.seal__char {
  position: relative;
  z-index: 2;
  font-family: $font-brush;
  font-size: 23px;
  line-height: 1;
  color: rgba($gold-lt, 0.98);
  text-shadow: 0 0 10px rgba($red-lt, 0.95), 0 0 28px rgba($red, 0.85);
  transition: text-shadow 0.4s ease;
  animation: charBreath 4.2s ease-in-out infinite;
}

/* ============================================================
   十契锁链
   ============================================================ */
.chain {
  position: relative;
  flex: 0 1 auto;
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 链身：绯红为主，金为节点 */
.chain__wire {
  position: absolute;
  left: 50%;
  top: 6px;
  bottom: 6px;
  width: 1px;
  transform: translateX(-50%);
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba($red, 0.4) 6%,
    rgba($gold, 0.42) 26%,
    rgba($red, 0.5) 52%,
    rgba($gold, 0.36) 74%,
    rgba($red, 0.34) 92%,
    transparent 100%
  );
  pointer-events: none;
}

/* 频率游走：一道绯色，一道紫电 */
.chain__flow {
  position: absolute;
  left: 50%;
  width: 2px;
  height: 34px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, transparent, rgba($red-lt, 1) 44%, rgba($gold-lt, 0.95) 66%, transparent);
  filter: drop-shadow(0 0 8px rgba($red-lt, 0.95));
  animation: chainFlow 7.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  pointer-events: none;

  &--b {
    height: 22px;
    background: linear-gradient(180deg, transparent, rgba($violet-lt, 1) 50%, transparent);
    filter: drop-shadow(0 0 7px rgba($violet-lt, 0.95));
    animation-duration: 11s;
    animation-delay: 3.4s;
  }
}

.chain__list {
  position: relative;
  z-index: 2;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  justify-items: center;
  gap: var(--gap);
}

.chain__item {
  position: relative;
  width: 100%;
  display: grid;
  place-items: center;

  /* 链扣：牌与牌之间的菱形 */
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: calc(var(--gap) / -2 - 2px);
    width: 4px;
    height: 4px;
    transform: translateX(-50%) rotate(45deg);
    background: rgba($red, 0.9);
    box-shadow: 0 0 7px rgba($red-lt, 0.85);
    pointer-events: none;
  }

  &:last-child::after {
    display: none;
  }
}

.chain__link {
  position: relative;
  width: var(--tile);
  height: var(--tile);
  display: grid;
  place-items: center;
  text-decoration: none;
  border-radius: 8px;

  &::before {
    content: "";
    position: absolute;
    inset: -70%;
    z-index: -1;
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba($red, 0.62), transparent 66%);
    filter: blur(9px);
    opacity: 0;
    transition: opacity 0.45s ease;
    pointer-events: none;
  }

  &:hover .node,
  &:focus-visible .node {
    transform: scale(1.07);
  }

  &:hover::before,
  &:focus-visible::before {
    opacity: 0.8;
  }

  &:hover .node__glyph,
  &:focus-visible .node__glyph {
    color: $paper;
    text-shadow: 0 0 12px rgba($red-lt, 0.95), 0 0 28px rgba($red, 0.75);
  }

  &:focus-visible {
    outline: 1px solid rgba($gold-lt, 0.8);
    outline-offset: 4px;
  }
}

/* 契牌 */
.node {
  position: relative;
  width: var(--tile);
  height: var(--tile);
  display: grid;
  place-items: center;
  clip-path: var(--hex);
  background: linear-gradient(158deg, rgba($gold, 0.78) 0%, rgba($red, 0.66) 48%, rgba($blood, 0.85) 100%);
  transition: transform 0.42s cubic-bezier(0.22, 0.61, 0.36, 1), filter 0.42s ease,
    background 0.42s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 1.4px;
    clip-path: var(--hex);
    background: linear-gradient(168deg, rgba($ink-3, 0.99) 0%, rgba($ink-2, 0.99) 54%, rgba(30, 8, 15, 0.99) 100%),
      radial-gradient(60% 60% at 30% 18%, rgba($red, 0.38), transparent 72%);
    transition: background 0.42s ease;
  }
}

.node__glyph {
  position: relative;
  z-index: 2;
  font-family: $font-brush;
  font-size: calc(var(--tile) * 0.48);
  line-height: 1;
  color: rgba($paper, 0.8);
  transition: color 0.36s ease, text-shadow 0.36s ease;
}

/* 封印中的契 */
.node__seal {
  position: absolute;
  right: 1px;
  bottom: 1px;
  z-index: 3;
  font-family: $font-brush;
  font-size: 9px;
  line-height: 1;
  color: rgba($gold-lt, 0.9);
  text-shadow: 0 0 6px rgba($red, 0.95);
}

/* 当前所在 */
.chain__link.is-active {
  &::before {
    opacity: 0.95;
    animation: auraBreath 3.4s ease-in-out infinite;
  }

  .node {
    background: linear-gradient(158deg, rgba($gold-lt, 1) 0%, rgba($red-lt, 0.95) 44%, rgba($red, 0.98) 100%);
    filter: drop-shadow(0 0 10px rgba($red-lt, 0.9));
  }

  .node::before {
    background: linear-gradient(168deg, rgba(74, 10, 22, 0.98) 0%, rgba(30, 7, 14, 0.99) 58%, rgba(14, 3, 7, 0.99) 100%),
      radial-gradient(62% 62% at 32% 20%, rgba($red-lt, 0.42), transparent 72%);
  }

  .node__glyph {
    color: $gold-lt;
    text-shadow: 0 0 12px rgba($gold, 0.95), 0 0 28px rgba($red-lt, 0.9);
    animation: glyphGlow 3.6s ease-in-out infinite;
  }
}

/* 未启之契 */
.chain__link.is-sealed {
  cursor: default;

  .node {
    background: linear-gradient(158deg, rgba($gold, 0.28), rgba($mirror, 0.16) 50%, rgba($blood, 0.4));
  }

  .node::before {
    background: linear-gradient(168deg, rgba(12, 8, 10, 0.98), rgba(8, 4, 6, 0.99));
  }

  .node__glyph {
    color: rgba($mirror, 0.34);
    text-shadow: none;
  }

  &:hover::before {
    opacity: 0.2;
  }

  &:hover .node {
    transform: none;
  }
}

.chain__link--ext .node::before {
  background: linear-gradient(168deg, rgba(16, 8, 12, 0.99) 0%, rgba(10, 4, 7, 0.99) 60%, rgba(24, 8, 14, 0.99) 100%),
    radial-gradient(60% 60% at 30% 18%, rgba($violet, 0.3), transparent 72%);
}

/* ============================================================
   浮出 · 契签
   ============================================================ */
.fly {
  position: absolute;
  left: 100%;
  top: 50%;
  z-index: 6;
  padding-left: 12px;
  transform: translate(-8px, -50%);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.32s ease, transform 0.38s cubic-bezier(0.22, 0.61, 0.36, 1), visibility 0.32s;
}

.chain__link:hover .fly,
.chain__link:focus-visible .fly,
.seal:hover .fly,
.seal:focus-visible .fly,
.bgm:hover .fly,
.bgm:focus-within .fly,
.online:hover .fly {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translate(0, -50%);
}

/* 浮签与链身之间的引线 */
.fly::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 12px;
  height: 1px;
  background: linear-gradient(90deg, rgba($red-lt, 0.9), rgba($gold, 0.5));
  box-shadow: 0 0 6px rgba($red, 0.85);
}

.fly__panel {
  position: relative;
  display: grid;
  grid-auto-flow: column;
  align-content: center;
  gap: 10px;
  padding: 9px 16px 10px 11px;
  border-radius: 3px 14px 14px 3px;
  border: 1px solid rgba($red, 0.32);
  border-left: 2px solid rgba($red-lt, 0.9);
  background: linear-gradient(118deg, rgba(30, 8, 14, 0.97) 0%, rgba(8, 3, 6, 0.96) 100%);
  box-shadow: 0 22px 48px -26px #000, 0 0 28px -14px rgba($red, 0.95),
    inset 0 1px 0 rgba($gold-lt, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  white-space: nowrap;
}

.fly__panel--seal,
.fly__panel--tool {
  grid-auto-flow: row;
  gap: 3px;
  padding: 11px 18px 12px 14px;
}

.fly__num {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  align-self: center;
  border-radius: 50%;
  border: 1px solid rgba($gold, 0.46);
  background: radial-gradient(circle at 34% 26%, rgba($red, 0.85), rgba($ink, 0.92));
  font-family: $font-brush;
  font-size: 12px;
  color: $gold-lt;
  text-shadow: 0 0 8px rgba($red-lt, 0.95);
}

.fly__body {
  display: grid;
  gap: 1px;
  align-content: center;
}

.fly__name {
  font-family: $font-brush;
  font-size: 16px;
  line-height: 1.25;
  letter-spacing: 0.12em;
  color: rgba($paper, 0.97);
  text-shadow: 0 0 14px rgba($red, 0.7);
}

.fly__motto {
  font-family: $font-brush;
  font-size: 12.5px;
  line-height: 1.5;
  letter-spacing: 0.16em;
  color: rgba($red-glow, 0.92);
  text-shadow: 0 0 12px rgba($red, 0.8);
}

.fly__sub {
  font-family: $font-mono;
  font-size: 9.5px;
  line-height: 1.4;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba($red-lt, 0.85);
}

.fly__progress {
  display: block;
  width: 100%;
  height: 2px;
  margin: 7px 0 6px;
  overflow: hidden;
  background: rgba($paper, 0.12);
  border-radius: 2px;

  i {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, rgba($red, 0.9), rgba($gold-lt, 0.95));
    box-shadow: 0 0 8px rgba($red-lt, 0.8);
    transition: width 0.35s linear;
  }
}

.fly__meta {
  font-family: $font-ui;
  font-size: 11px;
  line-height: 1.5;
  letter-spacing: 0.08em;
  color: rgba($paper, 0.5);
}

.fly__song {
  display: block;
  margin: 1px 0 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  font-family: $font-brush;
  font-size: 15px;
  letter-spacing: 0.1em;
  color: rgba($gold-lt, 0.95);
  transition: color 0.25s ease, text-shadow 0.25s ease;

  &:hover {
    color: #fff;
    text-shadow: 0 0 14px rgba($red-lt, 0.95);
  }
}

/* ============================================================
   契音 / 在线
   ============================================================ */
.dock-tools {
  flex: none;
  width: 100%;
  display: grid;
  justify-items: center;
  gap: 8px;
}

.bgm {
  position: relative;
  display: grid;
  place-items: center;
}

.bgm__btn {
  position: relative;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid rgba($gold, 0.42);
  border-radius: 50%;
  cursor: pointer;
  color: $paper;
  background: radial-gradient(circle at 34% 26%, rgba($red, 0.9), rgba($ink-2, 0.97) 74%),
    radial-gradient(circle at 70% 86%, rgba($blood, 0.9), transparent 66%);
  box-shadow: inset 0 0 12px rgba($red, 0.45), 0 0 20px -8px rgba($red-lt, 0.95);
  transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.25s ease;

  svg {
    position: relative;
    z-index: 2;
    width: 12px;
    height: 12px;
    fill: currentColor;
    display: block;
    filter: drop-shadow(0 0 5px rgba($red-lt, 0.9));
  }

  &:hover {
    border-color: rgba($gold-lt, 0.78);
    box-shadow: inset 0 0 14px rgba($red, 0.6), 0 0 26px -6px rgba($red-lt, 1);
  }

  &:active {
    transform: scale(0.94);
  }
}

.bgm__ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid transparent;
  border-top-color: rgba($red-lt, 0.75);
  border-left-color: rgba($gold-lt, 0.45);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.bgm.is-playing .bgm__ring {
  opacity: 1;
  animation: sealSpin 4.5s linear infinite;
}

.bgm__eq {
  position: absolute;
  right: -3px;
  bottom: -2px;
  z-index: 3;
  display: flex;
  align-items: flex-end;
  gap: 1.5px;
  height: 12px;
  padding: 2px 3px;
  border-radius: 4px;
  background: rgba($ink, 0.92);
  border: 1px solid rgba($red-lt, 0.55);

  i {
    display: block;
    width: 2px;
    height: 4px;
    border-radius: 1px;
    background: linear-gradient(180deg, $gold-lt, $red-lt);
    animation: eqBounce 1.1s ease-in-out infinite;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.18s;
    }
    &:nth-child(3) {
      animation-delay: 0.36s;
    }
  }
}

.online {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 7px 3px 6px;
  border-radius: 999px;
  border: 1px solid rgba($red, 0.34);
  background: linear-gradient(120deg, rgba($red, 0.28), rgba($ink-2, 0.9));
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  color: rgba($paper, 0.85);
  white-space: nowrap;
  user-select: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    border-color: rgba($red-lt, 0.6);
    box-shadow: 0 0 18px -6px rgba($red-lt, 0.95);
  }
}

.online__dot {
  position: relative;
  flex: none;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $red-lt;
  box-shadow: 0 0 9px 1px rgba($red-lt, 0.95);
  animation: dotPulse 2.4s ease-in-out infinite;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: $red-lt;
    animation: dotRipple 2.6s ease-out infinite;
  }
}

.online__num {
  color: $gold-lt;
  font-weight: 700;
}

/* ============================================================
   歌词 · 题于左下角
   ============================================================ */
.lyric {
  position: absolute;
  left: clamp(14px, 2vw, 22px);
  bottom: 18px;
  z-index: 3;
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  max-width: min(46vw, 430px);
  padding: 8px 22px 9px 10px;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(8, 3, 6, 0.86) 0%, rgba(8, 3, 6, 0.62) 62%, transparent 100%);
  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
  pointer-events: none;
  animation: lyricIn 0.62s cubic-bezier(0.22, 0.61, 0.36, 1);
}

/* 左侧一道竖血线 */
.lyric__bar {
  width: 2px;
  height: 100%;
  min-height: 26px;
  max-height: 38px;
  border-radius: 1px;
  background: linear-gradient(180deg, transparent, $red-lt 26%, $gold 74%, transparent);
  box-shadow: 0 0 10px rgba($red, 0.95);
}

.lyric__seal {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  flex: none;
  border-radius: 50%;
  border: 1px solid rgba($gold, 0.5);
  background: radial-gradient(circle at 34% 26%, rgba($red, 0.9), rgba($ink, 0.94));
  font-family: $font-brush;
  font-size: 12px;
  line-height: 1;
  color: $gold-lt;
  text-shadow: 0 0 8px rgba($red-lt, 0.95);
}

.lyric__body {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.lyric__text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
  text-wrap: pretty;
  font-family: $font-brush;
  font-size: 14.5px;
  line-height: 1.42;
  letter-spacing: 0.12em;
  color: rgba($paper, 0.95);
  text-shadow: 0 0 12px rgba($red, 0.9), 0 0 30px rgba($red, 0.5);
  animation: lyricSwap 0.66s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.lyric__meta {
  font-family: $font-mono;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba($red-lt, 0.72);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lyric-enter-active,
.lyric-leave-active {
  transition: opacity 0.42s ease, transform 0.42s ease;
}

.lyric-enter-from,
.lyric-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* ============================================================
   移动端 · 锁印
   ============================================================ */
.fab {
  position: absolute;
  right: clamp(14px, 3vw, 28px);
  bottom: clamp(14px, 2.6vh, 26px);
  z-index: 4;
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  padding: 0;
  border-radius: 50%;
  border: 1px solid rgba($gold, 0.5);
  background: radial-gradient(circle at 34% 26%, rgba($red, 0.95), rgba($ink-2, 0.97) 74%),
    radial-gradient(circle at 72% 84%, rgba($blood, 0.85), transparent 66%);
  box-shadow: 0 16px 34px -18px #000, inset 0 0 14px rgba($red, 0.5),
    0 0 28px -10px rgba($red-lt, 0.95);
  cursor: pointer;
  pointer-events: auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:active {
    transform: scale(0.94);
  }
}

.fab__ring {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1px dashed rgba($gold, 0.46);
  animation: sealSpin 26s linear infinite;
}

.fab__char {
  position: relative;
  z-index: 2;
  font-family: $font-brush;
  font-size: 23px;
  line-height: 1;
  color: $gold-lt;
  text-shadow: 0 0 12px rgba($red-lt, 0.95), 0 0 30px rgba($red, 0.85);
}

/* ============================================================
   移动端 · 契卷
   ============================================================ */
.gate {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: auto;
}

.gate__veil {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 80% at 0% 0%, rgba($red, 0.32), transparent 62%),
    rgba(4, 1, 3, 0.74);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.gate__sheet {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: min(88vw, 420px);
  max-width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 16px 18px;
  overflow: hidden;
  border-right: 1px solid rgba($red, 0.34);
  background: linear-gradient(160deg, rgba(34, 8, 16, 0.98) 0%, rgba(10, 4, 7, 0.99) 64%, rgba(5, 2, 4, 1) 100%),
    radial-gradient(58% 18% at 18% 0%, rgba($gold, 0.18), transparent 72%);
  box-shadow: 40px 0 90px -50px #000, 0 0 60px -30px rgba($red, 0.95);
}

.gate__edge {
  position: absolute;
  top: 12%;
  bottom: 12%;
  right: 0;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent,
    rgba($gold, 0.75) 18%,
    rgba($red-lt, 0.85) 52%,
    rgba($blood, 0.8) 82%,
    transparent
  );
  opacity: 0.85;
}

.gate__head {
  flex: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 4px 16px;
  border-bottom: 1px solid rgba($red, 0.24);
}

.gate__seal {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: none;
  border-radius: 50%;
  border: 1px solid rgba($gold, 0.55);
  background: radial-gradient(circle at 34% 26%, rgba($red, 0.9), rgba($ink, 0.96) 78%);
  font-family: $font-brush;
  font-size: 19px;
  color: $gold-lt;
  text-shadow: 0 0 12px rgba($red-lt, 0.95);
  box-shadow: inset 0 0 14px rgba($red, 0.45), 0 0 24px -10px rgba($red-lt, 1);
}

.gate__title {
  display: grid;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.gate__name {
  font-family: $font-brush;
  font-size: 20px;
  letter-spacing: 0.2em;
  color: rgba($paper, 0.97);
  text-shadow: 0 0 16px rgba($red, 0.8);
}

.gate__sub {
  font-family: $font-mono;
  font-size: 9.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba($red-lt, 0.8);
}

.gate__close {
  flex: none;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  padding: 0;
  border-radius: 50%;
  border: 1px solid rgba($red, 0.36);
  background: rgba($mirror, 0.04);
  cursor: pointer;
  transition: border-color 0.3s ease, background 0.3s ease;

  svg {
    width: 14px;
    height: 14px;
    fill: none;
    stroke: rgba($paper, 0.75);
    stroke-width: 1.6;
    stroke-linecap: round;
  }

  &:hover {
    border-color: rgba($red-lt, 0.7);
    background: rgba($red, 0.26);
  }
}

.gate__list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  margin: 12px 0 0;
  padding: 0 2px 6px;
  list-style: none;
  display: grid;
  gap: 6px;
  align-content: start;

  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba($red-lt, 0.5);
    border-radius: 2px;
  }

  li {
    animation: gateItem 0.48s cubic-bezier(0.22, 0.61, 0.36, 1) both;
    animation-delay: var(--d, 0ms);
  }
}

.gate__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 12px;
  border: 1px solid rgba($mirror, 0.07);
  background: rgba($mirror, 0.03);
  text-decoration: none;
  overflow: hidden;
  transition: border-color 0.28s ease, background 0.28s ease, transform 0.28s ease;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 18%;
    bottom: 18%;
    width: 2px;
    background: linear-gradient(180deg, $red-lt, $gold-lt);
    opacity: 0;
    transition: opacity 0.28s ease;
  }

  &:active {
    transform: scale(0.985);
  }

  &:hover,
  &.is-active {
    border-color: rgba($red, 0.4);
    background: linear-gradient(90deg, rgba($red, 0.32), rgba($red, 0.05) 70%, transparent);

    &::before {
      opacity: 1;
    }
  }

  &.is-sealed {
    opacity: 0.5;

    &:hover {
      border-color: rgba($mirror, 0.12);
      background: rgba($mirror, 0.03);
    }
  }
}

.gate__num {
  flex: none;
  width: 20px;
  font-family: $font-brush;
  font-size: 13px;
  text-align: center;
  color: rgba($gold, 0.9);
}

.gate__glyph {
  flex: none;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  clip-path: var(--hex);
  background: linear-gradient(158deg, rgba($gold, 0.7), rgba($red, 0.64) 50%, rgba($blood, 0.85));
  font-family: $font-brush;
  font-size: 16px;
  color: rgba($paper, 0.9);
}

.gate__label {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 2px;
}

.gate__label-name {
  font-family: $font-brush;
  font-size: 16px;
  letter-spacing: 0.12em;
  color: rgba($paper, 0.92);
}

.gate__label-sub {
  font-family: $font-mono;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba($red-lt, 0.72);
}

.gate__arrow {
  flex: none;
  font-size: 18px;
  color: rgba($gold-lt, 0.55);
}

.gate__item.is-active .gate__label-name {
  color: $gold-lt;
  text-shadow: 0 0 14px rgba($red, 0.95);
}

.gate__foot {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 12px;
  padding-top: 14px;
  border-top: 1px solid rgba($red, 0.2);
  font-family: $font-mono;
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: rgba($paper, 0.62);
}

.gate__stat {
  display: flex;
  align-items: center;
  gap: 7px;
  font-variant-numeric: tabular-nums;
}

.gate__bgm {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 62%;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba($gold, 0.32);
  background: rgba($red, 0.2);
  cursor: pointer;
  font-family: $font-brush;
  font-size: 12.5px;
  letter-spacing: 0.08em;
  color: rgba($gold-lt, 0.94);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .gate__bgm-mark {
    flex: none;
    font-size: 11px;
    color: rgba($red-lt, 0.95);
  }

  span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.gate-enter-active,
.gate-leave-active {
  transition: opacity 0.3s ease;
}

.gate-enter-active .gate__sheet,
.gate-leave-active .gate__sheet {
  transition: transform 0.42s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.gate-enter-from,
.gate-leave-to {
  opacity: 0;
}

.gate-enter-from .gate__sheet,
.gate-leave-to .gate__sheet {
  transform: translateX(-100%);
}

/* ============================================================
   动效
   ============================================================ */
@keyframes sealSpin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes auraBreath {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.94);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@keyframes charBreath {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.26);
  }
}

@keyframes glyphGlow {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.35);
  }
}

@keyframes chainFlow {
  0% {
    top: -8%;
    opacity: 0;
  }
  12% {
    opacity: 1;
  }
  86% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

@keyframes dotPulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.76);
  }
}

@keyframes dotRipple {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(3.2);
    opacity: 0;
  }
}

@keyframes eqBounce {
  0%,
  100% {
    height: 3px;
    opacity: 0.7;
  }
  50% {
    height: 9px;
    opacity: 1;
  }
}

@keyframes lyricIn {
  from {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

@keyframes lyricSwap {
  from {
    opacity: 0;
    transform: translateY(6px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

@keyframes gateItem {
  from {
    opacity: 0;
    transform: translateX(-18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* ============================================================
   响应式
   ============================================================ */
@media (min-width: 1201px) {
  .fab {
    display: none;
  }

  /* 让开左侧锁链 */
  .lyric {
    left: 104px;
    bottom: 26px;
  }
}

@media (max-width: 1200px) {
  .dock {
    display: none;
  }

  .lyric {
    bottom: 18px;
    max-width: calc(100vw - 96px);
  }
}

@media (max-height: 700px) {
  .dock {
    gap: 8px;
    padding: 10px 8px;
  }

  .seal {
    width: 46px;
    height: 46px;
  }

  .seal__char {
    font-size: 20px;
  }

  .dock__rule {
    display: none;
  }

  .online {
    display: none;
  }
}

@media (max-height: 560px) {
  .seal {
    display: none;
  }

  .dock-tools {
    display: none;
  }
}

@media (max-width: 720px) {
  .lyric {
    left: 12px;
    bottom: 14px;
    gap: 8px;
    padding: 7px 16px 8px 9px;
    max-width: calc(100vw - 88px);
  }

  .lyric__text {
    font-size: 13px;
    letter-spacing: 0.08em;
  }

  .lyric__seal {
    width: 18px;
    height: 18px;
    font-size: 10px;
  }
}

/* 契卷底部提示 */
.gate__hint {
  margin: 12px 0 2px;
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-align: center;
  text-transform: uppercase;
  color: rgba($paper, 0.28);
}

/* 尊重减弱动效偏好 */
@media (prefers-reduced-motion: reduce) {
  .dock-aura,
  .seal__aura,
  .seal__ring,
  .seal__char,
  .chain__flow,
  .online__dot,
  .online__dot::after,
  .bgm__ring,
  .bgm__eq i,
  .fab__ring,
  .chain__link.is-active .node__glyph,
  .lyric,
  .lyric__text,
  .gate__list li {
    animation: none !important;
  }
}
</style>
