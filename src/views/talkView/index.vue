<template>
  <div class="suoming-chat">
    <!-- ===== 动态背景：伞骨光环 + 锁链 + 频率余烬 ===== -->
    <div class="bg-layer" aria-hidden="true">
      <!-- 旋转伞骨 -->
      <span class="umb-ring umb-ring--outer"></span>
      <span class="umb-ring umb-ring--inner"></span>

      <!-- 垂直锁链 -->
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

      <!-- 底部升腾的余烬 -->
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

      <!-- 纹理与暗角 -->
      <span class="bg-grain"></span>
      <span class="bg-vignette"></span>
    </div>

    <!-- ===== 顶部横幅 ===== -->
    <header class="top-banner">
      <div class="banner-inner">
        <span class="banner-line banner-line--left" aria-hidden="true"></span>
        <div class="banner-text">
          <h1 class="banner-title">梦枢终端</h1>
          <p class="banner-sub">S U O M I N G &nbsp;·&nbsp; T E R M I N A L</p>
        </div>
        <span class="banner-line banner-line--right" aria-hidden="true"></span>
      </div>
      <p class="banner-poem">「伞下故影，锁尽妄执」</p>
    </header>

    <!-- ===== 主布局 ===== -->
    <div class="main-layout">
      <!-- 左侧：契约档案 -->
      <aside class="left-panel">
        <div class="char-card" v-reveal>
          <!-- 四角锁扣装饰 -->
          <span class="card-corner tl"></span>
          <span class="card-corner tr"></span>
          <span class="card-corner bl"></span>
          <span class="card-corner br"></span>

          <span class="char-aura"></span>
          <div class="char-avatar">
            <img src="@/assets/avatar/suoming.png" alt="锁暝" />
          </div>
          <div class="char-name">
            <span class="name-main">锁暝</span>
            <span class="name-sub">SUOMING</span>
          </div>
          <p class="char-title">禁锁十契 · 契主</p>
        </div>

        <div class="left-stats">
          <p class="stat-line">
            已铭刻 <span class="stat-num">{{ stats.totalChats }}</span> 道频率
          </p>
          <p class="stat-line">
            同调 <span class="stat-num">{{ stats.activeDates.length }}</span> 天
          </p>
        </div>

        <button class="settings-btn" @click="showSettingsModal = true">
          <span class="btn-shine"></span>
          <span class="btn-icon">✦</span>
          <span class="btn-text">调整契印设定</span>
        </button>

        <p class="char-note sm-note">她不太会用这种终端，<br />回得慢，请见谅哦。</p>
      </aside>

      <!-- 右侧：对话监控区 -->
      <section class="right-panel">
        <!-- 数据监控终端 -->
        <div class="stats-panel" v-reveal="{ delay: 90 }">
          <div class="stats-header">
            <span class="stats-mark" aria-hidden="true">✦</span>
            <span class="stats-title">共鸣记录</span>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">总频率</span>
              <span class="stat-value">{{ stats.totalChats }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">首次接入</span>
              <span class="stat-value">{{ firstDateLabel }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">同调天数</span>
              <span class="stat-value">{{ stats.activeDates.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">今日解析</span>
              <span class="stat-value">{{ todayChats }}</span>
            </div>
          </div>
          <button class="detail-btn" @click="showModal = true">详细档案</button>
        </div>

        <!-- 对话消息流 -->
        <div class="messages" ref="msgList">
          <div v-if="!chatLog.length" class="chat-empty">
            <span class="chat-empty__seal" aria-hidden="true">契</span>
            <p class="chat-empty__title">终端刚接通</p>
            <p class="chat-empty__desc">
              说点什么吧——<br />锁暝在伞下等着听。
            </p>
            <div class="chat-empty__chips">
              <button
                v-for="q in quickPrompts"
                :key="q"
                type="button"
                class="chat-chip"
                @click="input = q"
              >
                {{ q }}
              </button>
            </div>
          </div>

          <transition-group name="msg" tag="div" class="msg-inner">
            <div
              v-for="msg in chatLog"
              :key="msg.id"
              :class="[
                'message',
                msg.role,
                { error: msg.isError, egg: msg.isEgg },
              ]"
            >
              <div class="avatar" :class="msg.role"></div>
              <div class="bubble">
                <div class="content" v-html="renderText(msg.text)"></div>
              </div>
            </div>
            <div v-if="loading" class="message bot" key="loading">
              <div class="avatar bot"></div>
              <div class="bubble loading">
                <span class="loading-text">频率解析中</span>
                <span class="dots">
                  <span class="dot">.</span>
                  <span class="dot">.</span>
                  <span class="dot">.</span>
                </span>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- 输入终端 -->
        <form class="input-area" @submit.prevent="sendMessage">
          <textarea
            v-model="input"
            ref="inputEl"
            placeholder="向锁暝发送频率讯息…（Enter 发送，Shift + Enter 换行）"
            :disabled="loading"
            @keydown="handleKeydown"
            @input="autoGrow"
            rows="1"
          ></textarea>

          <div class="input-actions">
            <button
              type="button"
              class="clear-btn"
              @click="clearChat"
              :disabled="loading"
              title="清空记录"
            >
              <span>清除痕迹</span>
            </button>
            <span class="input-hint">{{ input.length }}/2000</span>
            <button
              type="submit"
              class="send-btn"
              :disabled="!input.trim() || loading"
            >
              <span class="btn-shine"></span>
              <span v-if="!loading">铭刻</span>
              <span v-else>解析中</span>
            </button>
          </div>
        </form>
      </section>
    </div>

    <!-- 详细档案弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <span class="modal-mark" aria-hidden="true">✦</span>
          <h3>终端监控详情</h3>
          <span class="modal-mark" aria-hidden="true">✦</span>
        </div>
        <ul class="detail-list">
          <li>
            <span class="detail-label">总频率数</span>
            <span class="detail-value">{{ stats.totalChats }}</span>
          </li>
          <li>
            <span class="detail-label">首次接入</span>
            <span class="detail-value">{{ firstDateLabel }}</span>
          </li>
          <li>
            <span class="detail-label">同调天数</span>
            <span class="detail-value">{{ stats.activeDates.length }} 天</span>
          </li>
          <li>
            <span class="detail-label">今日解析</span>
            <span class="detail-value">{{ todayChats }} 次</span>
          </li>
          <li>
            <span class="detail-label">共度时长</span>
            <span class="detail-value">{{
              formatDuration(stats.totalTime)
            }}</span>
          </li>
          <li>
            <span class="detail-label">连续同调</span>
            <span class="detail-value">{{ stats.currentStreak }} 天</span>
          </li>
          <li>
            <span class="detail-label">最长同调</span>
            <span class="detail-value">{{ stats.longestStreak }} 天</span>
          </li>
        </ul>
        <button class="close-btn" @click="showModal = false">关闭卷宗</button>
      </div>
    </div>

    <!-- 设定弹窗 -->
    <div
      v-if="showSettingsModal"
      class="modal-overlay"
      @click.self="showSettingsModal = false"
    >
      <div class="modal-content settings-modal">
        <div class="modal-header">
          <span class="modal-mark" aria-hidden="true">✦</span>
          <h3>契印参数覆写</h3>
          <span class="modal-mark" aria-hidden="true">✦</span>
        </div>
        <div class="settings-form">
          <div class="setting-item">
            <label>临时指令 <span class="optional">（新增设定）</span></label>
            <textarea
              v-model="tempAdditionalPrompt"
              placeholder="例如：熟悉XX，与XX是好友"
              rows="3"
              maxlength="200"
            ></textarea>
            <div class="char-counter">
              {{ tempAdditionalPrompt.length }} / 200
            </div>
            <div class="hint">
              追加在角色底层逻辑之后，可临时改变 AI 的行为模式与语气。
            </div>
          </div>
          <div class="setting-item">
            <label
              >频率扰动 <span class="optional">（Temperature）</span></label
            >
            <div class="temperature-control">
              <input
                type="range"
                v-model.number="tempTemperature"
                min="0.1"
                max="1.9"
                step="0.05"
              />
              <span class="temp-value">{{ tempTemperature.toFixed(2) }}</span>
            </div>
            <div class="hint">
              数值越高，回答越发散；数值越低，逻辑越严密。建议维持 0.5~1.2。
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showSettingsModal = false">
            取消
          </button>
          <button class="save-btn" @click="saveSettings">确认覆写</button>
        </div>
      </div>
    </div>

    <!-- 浮动 Q 版小人 -->
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
import {
  reactive,
  ref,
  computed,
  onMounted,
  nextTick,
  watch,
  onBeforeUnmount,
} from "vue";
import { sendMessageToHui } from "@/api/deepseekApi";
import { ElMessage, ElMessageBox } from "element-plus";
import { localDateKey } from "@/utils/format";
import gsap from "gsap";

const STORAGE_KEY = "suoming_chat_log_v1";
const STORAGE_STATS_KEY = "suoming_chat_stats_v1";
const STORAGE_SETTINGS_KEY = "suoming_chat_settings_v1";

interface Stats {
  firstTimestamp: number;
  totalChats: number;
  activeDates: string[];
  dailyChats: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
  totalTime: number;
}

const defaultStats: Stats = {
  firstTimestamp: Date.now(),
  totalChats: 0,
  activeDates: [],
  dailyChats: {},
  currentStreak: 0,
  longestStreak: 0,
  totalTime: 0,
};

/* ===== 背景粒子与锁链 ===== */
const colors = ["#ff3a56", "#c2a061", "#a98bff", "#ff8a9b"];
const embers = Array.from({ length: 22 }, () => ({
  left: Math.random() * 96 + 2,
  dur: 9 + Math.random() * 10,
  delay: -Math.random() * 19,
  size: 2 + Math.random() * 4,
  color: colors[Math.floor(Math.random() * colors.length)],
}));

const chainsBg = Array.from({ length: 12 }, () => ({
  left: Math.random() * 96 + 2,
  dur: 15 + Math.random() * 10,
  delay: -Math.random() * 20,
  opacity: 0.05 + Math.random() * 0.1,
}));

function loadStats(): Stats {
  const saved = localStorage.getItem(STORAGE_STATS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return { ...defaultStats, ...parsed };
    } catch {
      console.warn("加载统计数据失败");
    }
  }
  return { ...defaultStats };
}

function saveStats() {
  localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
}

function updateActive(date: string) {
  if (!stats.activeDates.includes(date)) {
    stats.activeDates.push(date);
    updateStreak();
    saveStats();
  }
}

function updateStreak() {
  const dates = [...stats.activeDates].sort();
  let curr = 0,
    max = stats.longestStreak,
    prevTs = 0;
  const todayStr = localDateKey();
  dates.forEach((d) => {
    const ts = new Date(d).getTime();
    if (prevTs && ts - prevTs === 86400000) curr++;
    else curr = 1;
    max = Math.max(max, curr);
    prevTs = ts;
  });
  stats.currentStreak = dates[dates.length - 1] === todayStr ? curr : 0;
  stats.longestStreak = max;
  saveStats();
}

function updateDaily(date: string) {
  stats.dailyChats[date] = (stats.dailyChats[date] || 0) + 1;
  saveStats();
}

function formatDuration(ms: number): string {
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h ? `${h} 小时 ${m} 分钟` : `${m} 分钟`;
}

const stats = reactive<Stats>(loadStats());
/* 今日日期键（本地时区），模板里直接用，别在模板里 new Date() */
const todayKey = computed(() => localDateKey());
const todayChats = computed(() => stats.dailyChats[todayKey.value] || 0);
let sessionStart = Date.now();

interface ChatMsg {
  id: number;
  role: "user" | "bot";
  text: string;
  isError?: boolean;
  isEgg?: boolean;
}

const chatLog = ref<ChatMsg[]>(loadChatLog());
const input = ref("");
const inputEl = ref<HTMLTextAreaElement>();
const loading = ref(false);
const msgList = ref<HTMLElement>();
const MAX_INPUT = 2000;

/* 首屏没有对话时的引导句 */
const quickPrompts = [
  "你是谁？",
  "讲讲契印的事",
  "今天雨很大",
];

const showModal = ref(false);
const showSettingsModal = ref(false);

const tempAdditionalPrompt = ref("");
const tempTemperature = ref(0.7);
const currentAdditionalPrompt = ref("");
const currentTemperature = ref(0.7);

function loadSettings() {
  const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      currentAdditionalPrompt.value = settings.additionalPrompt || "";
      currentTemperature.value = settings.temperature ?? 0.7;
      tempAdditionalPrompt.value = currentAdditionalPrompt.value;
      tempTemperature.value = currentTemperature.value;
    } catch (e) {
      console.warn("加载设定失败", e);
    }
  }
}

function saveSettings() {
  if (tempAdditionalPrompt.value.length > 200) {
    ElMessage.warning("指令不能超过 200 个字符");
    return;
  }
  currentAdditionalPrompt.value = tempAdditionalPrompt.value;
  currentTemperature.value = tempTemperature.value;
  localStorage.setItem(
    STORAGE_SETTINGS_KEY,
    JSON.stringify({
      additionalPrompt: currentAdditionalPrompt.value,
      temperature: currentTemperature.value,
    })
  );
  showSettingsModal.value = false;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text || loading.value) return;
  if (text.length > MAX_INPUT) {
    input.value = text.slice(0, MAX_INPUT);
    return;
  }
  if (stats.totalChats === 0 && !localStorage.getItem(STORAGE_STATS_KEY)) {
    stats.firstTimestamp = Date.now();
    saveStats();
  }

  const userText = text;
  chatLog.value.push({ id: Date.now(), role: "user", text: userText });
  input.value = "";
  resetInputHeight();
  loading.value = true;

  try {
    /* 历史里要去掉刚 push 的这句，否则最后一句会重复发送 */
    const history = chatLog.value
      .slice(0, -1)
      .filter((msg) => !msg.isEgg && !msg.isError);
    const options: any = { character: "suoming" };
    if (currentAdditionalPrompt.value && currentAdditionalPrompt.value.trim()) {
      options.additionalPrompt = currentAdditionalPrompt.value.trim();
    }
    if (
      currentTemperature.value !== undefined &&
      currentTemperature.value !== null
    ) {
      options.temperature = currentTemperature.value;
    }
    const botReply = await sendMessageToHui(userText, history, options);
    if (botReply === "error") {
      chatLog.value.push({
        id: Date.now() + 2,
        role: "bot",
        text: "频率接口断开，请通知管理员补充接口额度。",
        isError: true,
      });
    } else {
      chatLog.value.push({
        id: Date.now() + 1,
        role: "bot",
        text: String(botReply ?? ""),
      });
      /* 只有真的聊过一轮才算一次铭刻 */
      const date = localDateKey();
      stats.totalChats++;
      updateActive(date);
      updateDaily(date);
      saveStats();
    }
  } catch (e) {
    console.error(e);
    chatLog.value.push({
      id: Date.now() + 3,
      role: "bot",
      text: "频率在传输中散掉了，稍后再试一次吧。",
      isError: true,
    });
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
}

/* ===== 输入框：Enter 发送、Shift+Enter 换行、输入法不误发 ===== */
function handleKeydown(e: KeyboardEvent) {
  if (e.key !== "Enter") return;
  if (e.shiftKey || e.isComposing || e.keyCode === 229) return;
  e.preventDefault();
  sendMessage();
}

function autoGrow() {
  const el = inputEl.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 160) + "px";
  if (input.value.length > MAX_INPUT) {
    input.value = input.value.slice(0, MAX_INPUT);
  }
}

function resetInputHeight() {
  const el = inputEl.value;
  if (el) el.style.height = "auto";
}

/* ===== 只放行极少数标签，AI 返回的 HTML 一律转义（原来直接 v-html 有注入风险） ===== */
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderText(raw: string) {
  let s = escapeHtml(String(raw ?? ""));
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\n/g, "<br>");
  return s;
}

/* 首次接入日期：脏数据也不再让整页抛 RangeError */
const firstDateLabel = computed(() => {
  const d = new Date(stats.firstTimestamp);
  if (Number.isNaN(d.getTime())) return "刚刚接通";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
});

async function clearChat() {
  try {
    await ElMessageBox.confirm(
      "清除后这段频率就散掉了，只剩一句自我介绍。",
      "清除所有铭刻？",
      {
        confirmButtonText: "清除",
        cancelButtonText: "算了",
        type: "warning",
      }
    );
  } catch {
    return;
  }
  chatLog.value = [
    {
      id: Date.now(),
      role: "bot",
      text: "禁锁十契契主，梦州谛天鉴州监，锁暝。",
    },
  ];
  localStorage.removeItem(STORAGE_KEY);
  ElMessage.success("痕迹已抹去");
}

function loadChatLog(): ChatMsg[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("chatLog 解析失败：", e);
    }
  }
  return [
    {
      id: Date.now(),
      role: "bot",
      text: "禁锁十契契主，梦州谛天鉴州监，锁暝。",
    },
  ];
}

async function scrollToBottom() {
  await nextTick();
  if (msgList.value) {
    msgList.value.scrollTop = msgList.value.scrollHeight;
  }
}

watch(
  chatLog,
  async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatLog.value));
    await scrollToBottom();
  },
  { deep: true }
);

function handleBeforeUnload() {
  const now = Date.now();
  if (now <= sessionStart) return;
  stats.totalTime += now - sessionStart;
  sessionStart = now;
  saveStats();
}

/* ===== 浮动 Q 版小人 ===== */
interface Chibi {
  src: string;
  top: number;
  left: number;
}
const chibiList = ref<Chibi[]>([]);
/* 留住 DOM 引用：unmount 时组件已摘除，querySelectorAll 查不到 */
const chibiEls: HTMLImageElement[] = [];
const reducedMotion = !!window.matchMedia?.("(prefers-reduced-motion: reduce)")
  .matches;

function driftChibi(el: HTMLImageElement) {
  const padding = 200;
  const rect = el.getBoundingClientRect();
  let deltaX = (Math.random() - 0.5) * 200;
  let deltaY = (Math.random() - 0.5) * 200;
  const nextX = rect.x + deltaX,
    nextY = rect.y + deltaY;
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

onMounted(async () => {
  scrollToBottom();
  window.addEventListener("beforeunload", handleBeforeUnload);
  loadSettings();

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

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
  /* 离开页面时把这一程的时长结算掉，别等 beforeunload（SPA 内切路由不触发） */
  handleBeforeUnload();
  chibiEls.forEach((el) => gsap.killTweensOf(el));
  chibiEls.length = 0;
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
.suoming-chat {
  position: relative;
  min-height: 100vh;
  background: $ink;
  font-family: $font-body;
  color: $paper;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  font-size: 16px;
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
    width: 140vw;
    height: 140vw;
    border: 1px dashed rgba($red, 0.15);
    animation: spin 60s linear infinite;
  }
  &--inner {
    width: 90vw;
    height: 90vw;
    border: 1px solid rgba($gold, 0.08);
    animation: spin 45s linear infinite reverse;
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
  padding: 60px 32px 20px;
  text-align: center;
  flex-shrink: 0;
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
  margin: 12px 0 0;
  font-family: $font-title;
  font-size: 16px;
  letter-spacing: 0.2em;
  color: rgba($gold-lt, 0.8);
  text-shadow: 0 0 12px rgba($red, 0.5);
}

/* ============================================================
   主布局
   ============================================================ */
.main-layout {
  position: relative;
  z-index: 5;
  flex: 1;
  display: flex;
  gap: clamp(16px, 2.4vw, 28px);
  padding: 0 clamp(16px, 3vw, 44px) 30px;
  min-height: 0;
  max-width: 1500px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* ============================================================
   左侧：契约档案
   ============================================================ */
.left-panel {
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding-top: 8px;
}

.char-card {
  position: relative;
  width: 100%;
  padding: 30px 20px 24px;
  background: rgba($ink-2, 0.85);
  border: 1px solid rgba($gold, 0.2);
  box-shadow: inset 0 0 30px rgba($red, 0.1), 0 10px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  backdrop-filter: blur(10px);

  /* 四角金属锁扣 */
  .card-corner {
    position: absolute;
    width: 12px;
    height: 12px;
    pointer-events: none;
    &.tl {
      top: 6px;
      left: 6px;
      border-top: 1px solid $gold;
      border-left: 1px solid $gold;
    }
    &.tr {
      top: 6px;
      right: 6px;
      border-top: 1px solid $gold;
      border-right: 1px solid $gold;
    }
    &.bl {
      bottom: 6px;
      left: 6px;
      border-bottom: 1px solid $gold;
      border-left: 1px solid $gold;
    }
    &.br {
      bottom: 6px;
      right: 6px;
      border-bottom: 1px solid $gold;
      border-right: 1px solid $gold;
    }
  }
}

.char-aura {
  position: absolute;
  top: -20%;
  left: 50%;
  width: 140%;
  height: 100%;
  margin-left: -70%;
  background: radial-gradient(circle, rgba($red, 0.2) 0%, transparent 70%);
  filter: blur(30px);
  pointer-events: none;
}

.char-avatar {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba($gold, 0.5);
  box-shadow: 0 0 20px rgba($red, 0.4);
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }
}

.char-name {
  margin-top: 16px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  position: relative;
  z-index: 1;

  .name-main {
    font-family: $font-title;
    font-size: 32px;
    letter-spacing: 0.08em;
    color: $paper;
    text-shadow: 0 0 14px rgba($red, 0.6);
  }
  .name-sub {
    font-family: $font-en;
    font-size: 14px;
    letter-spacing: 0.2em;
    color: $gold-lt;
  }
}

.char-title {
  margin: 8px 0 0;
  font-size: 13px;
  letter-spacing: 0.15em;
  color: rgba($paper, 0.5);
  position: relative;
  z-index: 1;
}

.left-stats {
  text-align: center;
  .stat-line {
    font-size: 14px;
    color: rgba($paper, 0.6);
    margin: 6px 0;
    letter-spacing: 0.05em;
    .stat-num {
      font-family: $font-mono;
      font-weight: 700;
      font-size: 18px;
      color: $red-glow;
      text-shadow: 0 0 10px rgba($red, 0.6);
      padding: 0 4px;
    }
  }
}

.settings-btn {
  position: relative;
  margin-top: auto;
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, $blood, $red);
  border: 1px solid $red-lt;
  color: $paper;
  font-family: $font-title;
  font-size: 16px;
  letter-spacing: 0.15em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba($red, 0.3);

  .btn-icon {
    color: $gold-lt;
    font-size: 12px;
  }
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
    transition: left 0.5s ease;
  }

  &:hover {
    box-shadow: 0 8px 25px rgba($red, 0.6);
    transform: translateY(-2px);
    .btn-shine {
      left: 150%;
    }
  }
}

/* 左边的便签：她回得慢，先说一声 */
.char-note {
  margin: 18px 2px 0;
  align-self: flex-start;
  font-size: 13px;
  line-height: 1.8;
  transform: rotate(-1.2deg);
}

/* ============================================================
   右侧：对话区
   ============================================================ */
.right-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 8px;
  min-height: 0;
}

.stats-panel {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  background: rgba($ink-2, 0.85);
  border: 1px solid rgba($gold, 0.2);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: $red-lt;
  }

  .stats-header {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;

    .stats-mark {
      color: $gold-lt;
      font-size: 12px;
      animation: pulseDot 3s infinite;
    }
    .stats-title {
      font-family: $font-title;
      font-size: 18px;
      letter-spacing: 0.1em;
      color: $paper;
    }
  }

  .stats-grid {
    display: flex;
    gap: 24px;
    flex: 1;
    justify-content: center;

    .stat-item {
      text-align: center;
      position: relative;

      & + .stat-item::before {
        content: "";
        position: absolute;
        left: -12px;
        top: 20%;
        bottom: 20%;
        width: 1px;
        background: rgba($gold, 0.2);
      }

      .stat-label {
        display: block;
        font-size: 12px;
        color: rgba($paper, 0.5);
        margin-bottom: 2px;
      }
      .stat-value {
        display: block;
        font-family: $font-mono;
        font-size: 16px;
        font-weight: 700;
        color: $gold-lt;
      }
    }
  }

  .detail-btn {
    padding: 6px 16px;
    border: 1px solid rgba($gold, 0.4);
    background: rgba($gold, 0.1);
    color: $gold-lt;
    font-size: 13px;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      background: rgba($gold, 0.2);
      border-color: $gold;
    }
  }
}

/* 消息列表 */
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px 4px;
  display: flex;
  flex-direction: column;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba($red, 0.5);
    border-radius: 2px;
  }
}

/* transition-group 会多包一层，行距必须挂在它身上 */
.msg-inner {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 14px;

  &.user {
    flex-direction: row-reverse;
  }

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 4px;
    flex-shrink: 0;
    position: relative;

    &.bot {
      background-image: url("@/assets/avatar/suoming.png");
      background-size: cover;
      background-position: top;
      border: 1px solid rgba($gold, 0.5);
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.8);
    }
    &.user {
      background: $ink-3;
      border: 1px solid rgba($red, 0.5);
      display: grid;
      place-items: center;
      &::after {
        content: "御";
        font-family: $font-title;
        font-size: 20px;
        color: $red-glow;
      }
    }
  }

  .bubble {
    max-width: 75%;
    padding: 14px 20px;
    background: rgba($ink-2, 0.85);
    backdrop-filter: blur(8px);
    line-height: 1.8;
    word-break: break-word;
    position: relative;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);

    /* 用户（右） */
    .message.user & {
      border-right: 2px solid $red-lt;
      border-radius: 14px 2px 14px 14px;
      background: linear-gradient(90deg, rgba($ink-2, 0.85), rgba($blood, 0.2));
    }

    /* Bot（左） */
    .message.bot & {
      border-left: 2px solid $gold-lt;
      border-radius: 2px 14px 14px 14px;
      background: linear-gradient(90deg, rgba($gold, 0.08), rgba($ink-2, 0.85));
    }

    &.error {
      border-color: $violet-lt;
      background: rgba($violet, 0.15);
    }

    &.loading {
      display: flex;
      align-items: center;
      gap: 8px;
      .loading-text {
        color: $gold-lt;
        font-family: $font-title;
        letter-spacing: 0.1em;
      }
      .dots .dot {
        animation: pulseDot 1.4s infinite;
        color: $red-lt;
        font-size: 18px;
        font-weight: bold;
        &:nth-child(2) {
          animation-delay: 0.2s;
        }
        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }

    .content {
      color: rgba($paper, 0.9);
      font-size: 15px;
    }
  }
}

/* 错误 / 彩蛋气泡：类挂在 .message 上，原来写的 .bubble &.error 永远匹配不到 */
.message.error .bubble {
  border-left-color: $violet-lt;
  border-right-color: $violet-lt;
  background: rgba($violet, 0.16);
}
.message.egg .bubble {
  border-left-color: $gold-lt;
  box-shadow: 0 0 22px rgba($gold, 0.22);
}

.bubble .content {
  strong {
    color: $gold-lt;
    font-weight: 600;
  }
  code {
    padding: 1px 5px;
    font-family: $font-mono;
    font-size: 13px;
    color: $red-glow;
    background: rgba($ink, 0.7);
    border: 1px solid rgba($gold, 0.2);
  }
}

/* 空对话引导 */
.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex: 1;
  padding: 40px 20px;
  text-align: center;

  &__seal {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    font-family: $font-title;
    font-size: 23px;
    color: #ffe9dd;
    background: linear-gradient(160deg, rgba($red, 0.85), rgba($blood, 0.7));
    border: 1px solid rgba($red-lt, 0.45);
    transform: rotate(-4deg);
  }
  &__title {
    margin: 4px 0 0;
    font-family: $font-title;
    font-size: 22px;
    letter-spacing: 0.12em;
    color: rgba($gold-lt, 0.9);
  }
  &__desc {
    margin: 0;
    font-size: 13px;
    line-height: 2;
    color: rgba($paper, 0.42);
  }
  &__chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 14px;
  }
}
.chat-chip {
  padding: 6px 16px;
  font-family: $font-body;
  font-size: 12.5px;
  color: rgba($paper, 0.72);
  background: rgba($ink-2, 0.7);
  border: 1px solid rgba($gold, 0.22);
  cursor: pointer;
  transition: all 0.28s ease;

  &:hover {
    color: $gold-lt;
    border-color: rgba($gold-lt, 0.6);
    background: rgba($blood, 0.25);
  }
}

.input-hint {
  margin-left: auto;
  align-self: center;
  font-family: $font-mono;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: rgba($paper, 0.28);
}

/* 输入终端 */
.input-area {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 16px;
  background: rgba($ink-2, 0.9);
  border: 1px solid rgba($gold, 0.2);
  backdrop-filter: blur(12px);
  flex-shrink: 0;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, $red-lt, transparent);
    box-shadow: 0 0 10px $red;
  }

  textarea {
    flex: 1;
    background: rgba($ink, 0.6);
    border: 1px solid rgba($red, 0.2);
    padding: 12px 16px;
    color: $paper;
    font-size: 15px;
    line-height: 1.5;
    outline: none;
    resize: none;
    min-height: 48px;
    max-height: 140px;
    font-family: inherit;
    transition: border-color 0.3s, box-shadow 0.3s;

    &::placeholder {
      color: rgba($paper, 0.3);
    }
    &:focus {
      border-color: rgba($red-lt, 0.6);
      box-shadow: inset 0 0 15px rgba($red, 0.15);
    }
  }

  .input-actions {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
    padding-bottom: 2px;

    .clear-btn {
      padding: 10px 16px;
      border: 1px solid rgba($paper, 0.2);
      background: transparent;
      color: rgba($paper, 0.5);
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        border-color: $gold;
        color: $gold-lt;
        background: rgba($gold, 0.1);
      }
    }

    .send-btn {
      position: relative;
      padding: 10px 28px;
      background: linear-gradient(135deg, $blood, $red);
      border: 1px solid $red-lt;
      color: $paper;
      font-family: $font-title;
      font-size: 16px;
      letter-spacing: 0.15em;
      cursor: pointer;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba($red, 0.4);
      transition: all 0.3s;

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
        transition: left 0.5s;
      }

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba($red, 0.6);
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
   弹窗
   ============================================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($ink, 0.85);
  backdrop-filter: blur(8px);
  padding: 20px;
}

.modal-content {
  position: relative;
  width: 480px;
  max-width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 32px;
  background: rgba($ink-2, 0.95);
  border: 1px solid rgba($gold, 0.3);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba($red, 0.1);

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: $red;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 24px;
  padding-bottom: 14px;
  border-bottom: 1px dashed rgba($gold, 0.2);
  h3 {
    margin: 0;
    font-family: $font-title;
    font-size: 22px;
    color: $gold-lt;
    letter-spacing: 0.1em;
  }
  .modal-mark {
    color: $red-lt;
    font-size: 12px;
  }
}

.detail-list {
  list-style: none;
  margin: 0 0 24px;
  padding: 0;
  li {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px dashed rgba($gold, 0.1);
    &:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: rgba($paper, 0.6);
      font-size: 14px;
    }
    .detail-value {
      color: $red-glow;
      font-family: $font-mono;
      font-weight: bold;
      font-size: 16px;
    }
  }
}

.settings-form {
  margin-bottom: 24px;
  .setting-item {
    margin-bottom: 24px;
    label {
      display: block;
      font-family: $font-title;
      color: $gold-lt;
      font-size: 16px;
      margin-bottom: 8px;
      position: relative;
      padding-left: 12px;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 4px;
        background: $red-lt;
      }
      .optional {
        font-size: 12px;
        color: rgba($paper, 0.5);
        font-family: $font-body;
      }
    }
    textarea {
      width: 100%;
      background: rgba($ink, 0.5);
      border: 1px solid rgba($red, 0.3);
      padding: 12px;
      color: $paper;
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
      box-sizing: border-box;
      outline: none;
      &:focus {
        border-color: $red-lt;
      }
    }
    .char-counter {
      text-align: right;
      font-size: 12px;
      color: rgba($paper, 0.4);
      margin-top: 4px;
    }
    .temperature-control {
      display: flex;
      align-items: center;
      gap: 16px;
      input[type="range"] {
        flex: 1;
        -webkit-appearance: none;
        height: 4px;
        background: rgba($gold, 0.3);
        border-radius: 2px;
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: $red-lt;
          cursor: pointer;
          box-shadow: 0 0 10px $red;
        }
      }
      .temp-value {
        font-family: $font-mono;
        font-size: 16px;
        color: $gold-lt;
        font-weight: bold;
      }
    }
    .hint {
      font-size: 12px;
      color: rgba($paper, 0.4);
      margin-top: 6px;
      line-height: 1.5;
    }
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  button {
    padding: 10px 24px;
    border-radius: 2px;
    font-family: $font-title;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .cancel-btn {
    background: transparent;
    border: 1px solid rgba($paper, 0.3);
    color: rgba($paper, 0.7);
    &:hover {
      border-color: $paper;
      color: $paper;
    }
  }
  .save-btn {
    background: linear-gradient(135deg, $blood, $red);
    border: 1px solid $red-lt;
    color: $paper;
    &:hover {
      box-shadow: 0 0 15px rgba($red, 0.5);
    }
  }
}

.close-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, $blood, $red);
  border: 1px solid $red-lt;
  color: $paper;
  font-family: $font-title;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    box-shadow: 0 0 15px rgba($red, 0.5);
  }
}

/* ============================================================
   浮动 Q 版小人
   ============================================================ */
.floating-chibis {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  .chibi-img {
    position: absolute;
    width: 72px;
    user-select: none;
    pointer-events: auto;
    filter: drop-shadow(0 6px 14px rgba($red, 0.5));
  }
}

/* ============================================================
   消息过渡
   ============================================================ */
.msg-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
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
  transform: scale(0.95);
}

/* ============================================================
   响应式
   ============================================================ */
@media (max-width: 1024px) {
  .left-panel {
    flex: 0 0 240px;
  }
}

@media (max-width: 768px) {
  .top-banner {
    padding: 40px 20px 16px;
  }
  .banner-line {
    width: 40px;
  }
  .banner-title {
    letter-spacing: 0.1em;
  }

  .main-layout {
    flex-direction: column;
    gap: 14px;
    padding: 0 14px 18px;
  }

  /* 移动端简略左侧面板 */
  .left-panel {
    flex: 0 0 auto;
    flex-direction: row;
    padding: 0;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .char-card {
    padding: 12px 16px;
    border-radius: 4px;
    flex-direction: row;
    gap: 12px;
    width: auto;
    flex: 1;
    min-width: 0;
    .card-corner,
    .char-aura {
      display: none;
    }
  }
  .char-avatar {
    width: 44px;
    height: 44px;
  }
  .char-name {
    margin-top: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    .name-main {
      font-size: 20px;
    }
    .name-sub {
      font-size: 12px;
    }
  }
  .char-title {
    display: none;
  }
  .left-stats {
    display: flex;
    gap: 10px;
    .stat-line {
      font-size: 11px;
      margin: 0;
      .stat-num {
        font-size: 14px;
      }
    }
  }
  .settings-btn {
    margin-top: 0;
    padding: 8px 14px;
    font-size: 13px;
    width: auto;
  }

  .right-panel {
    padding-top: 0;
    gap: 10px;
  }
  .stats-panel {
    padding: 10px 14px;
    gap: 12px;
    .stats-grid {
      display: none;
    } /* 移动端隐藏详细数值，节省空间 */
    .detail-btn {
      padding: 4px 12px;
      font-size: 12px;
    }
  }

  .messages {
    gap: 14px;
  }
  .message {
    .avatar {
      width: 36px;
      height: 36px;
    }
    .bubble {
      max-width: 85%;
      padding: 10px 14px;
      .content {
        font-size: 14px;
      }
    }
  }

  .input-area {
    padding: 12px;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    .input-actions {
      justify-content: space-between;
    }
    .send-btn {
      flex: 1;
      text-align: center;
      justify-content: center;
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
  .banner-title,
  .stats-mark,
  .char-fox,
  .btn-shine {
    animation: none !important;
  }
  .msg-enter-active,
  .msg-leave-active {
    transition-duration: 0.01ms !important;
  }
}
</style>
