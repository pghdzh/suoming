<template>
  <div class="suoming-wiki">
    <!-- ===== 动态背景：伞骨 + 锁链 + 频率余烬 ===== -->
    <div class="bg-layer" aria-hidden="true">
      <!-- 伞骨旋转环 -->
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

      <span class="bg-grain"></span>
      <span class="vignette"></span>
    </div>

    <!-- ===== 顶部横幅 ===== -->
    <header class="wiki-header">
      <div class="header-inner">
        <span class="header-line header-line--left" aria-hidden="true"></span>
        <div class="header-text">
          <h1 class="header-title">频率秘库</h1>
          <p class="header-sub">S U O M I N G &nbsp;·&nbsp; A R C H I V E S</p>
        </div>
        <span class="header-line header-line--right" aria-hidden="true"></span>
      </div>
      <p class="header-poem">「锁尽妄执，伞下故影」</p>
      <p class="header-note sm-note">
        可以放二创小说，AI人设等等任何文本内容哦<br />希望能有列表被铺满的一天呢。
      </p>
    </header>

    <!-- ===== 主内容 ===== -->
    <main class="wiki-main" v-reveal>
      <!-- 工具条 -->
      <div class="toolbar">
        <div class="search-lamp">
          <span class="search-mark" aria-hidden="true">✦</span>
          <input
            v-model="search"
            class="search-input"
            placeholder="检索频率标识或标题…"
            aria-label="搜索词条"
          />
          <button
            v-if="search"
            class="search-clear"
            @click="search = ''"
            aria-label="清除搜索"
          >
            ✕
          </button>
        </div>

        <button class="new-btn" @click="openCreate">
          <span class="btn-shine"></span>
          <span class="btn-mark" aria-hidden="true">✦</span>
          <span class="btn-text">铭刻新档案</span>
        </button>
      </div>

      <!-- 统计栏 -->
      <div class="stats-bar">
        <span class="stats-item">
          共 <em>{{ entries.length }}</em> 份档案
        </span>
        <span class="stats-divider">◆</span>
        <span class="stats-item">
          检索到 <em>{{ filteredEntries.length }}</em> 份频率
        </span>
        <label class="stats-sort">
          <span class="stats-sort__label">排序</span>
          <select v-model="sortBy" aria-label="排序方式">
            <option value="likes">按共鸣度</option>
            <option value="time">按最近覆写</option>
          </select>
        </label>
      </div>

      <!-- 词条列表 -->
      <div class="entry-scroll">
        <div v-if="loading" class="skeleton-list" aria-hidden="true">
          <div
            v-for="n in 3"
            :key="n"
            class="skeleton-card"
            :style="{ animationDelay: n * 0.12 + 's' }"
          ></div>
        </div>

        <div v-else-if="filteredEntries.length === 0" class="empty-message">
          <span class="empty-mark" aria-hidden="true">✦</span>
          <span class="empty-text">
            {{
              search
                ? "未检索到匹配的频率，请更换关键词"
                : "秘库空空如也，等待第一道频率接入"
            }}
          </span>
          <button
            v-if="!search"
            class="empty-btn"
            type="button"
            @click="openCreate"
          >
            写第一份档案
          </button>
        </div>

        <div class="entry-list">
          <article
            v-for="(entry, idx) in filteredEntries"
            :key="entry.id"
            class="entry-card"
            v-reveal="{ delay: Math.min(idx, 6) * 45, y: 14 }"
          >
            <!-- 四角金属锁扣 -->
            <span class="card-corner tl"></span>
            <span class="card-corner tr"></span>
            <span class="card-corner bl"></span>
            <span class="card-corner br"></span>

            <!-- 左侧能量引线 -->
            <span class="card-wick" aria-hidden="true"></span>

            <!-- 标题区域（点击查看详情） -->
            <div class="entry-main" @click="openDetail(entry)">
              <div class="entry-title-row">
                <h2 class="entry-title">{{ entry.title }}</h2>
                <span v-if="entry.slug" class="entry-badge">
                  #{{ entry.slug }}
                </span>
              </div>
              <div class="entry-meta-row">
                <span class="meta-item"
                  >录入者 · {{ entry.author || "无名频率" }}</span
                >
                <span class="meta-dot">/</span>
                <span class="meta-item">{{ formatTime(entry.updatedAt) }}</span>
              </div>
            </div>

            <!-- 操作区域 -->
            <div class="entry-actions">
              <button
                class="like-btn"
                :class="{ active: isLiked(entry.id) }"
                :aria-pressed="isLiked(entry.id)"
                @click.stop="toggleLike(entry.id)"
              >
                <span
                  class="heart"
                  :class="{ liked: isLiked(entry.id) }"
                ></span>
                <span class="like-count">{{ entry.likes }}</span>
              </button>

              <div v-if="canEdit(entry.id)" class="edit-delete">
                <button
                  class="action-btn edit-btn"
                  @click.stop="openEdit(entry)"
                >
                  覆写
                </button>
                <button
                  class="action-btn delete-btn"
                  @click.stop="remove(entry.id)"
                >
                  销毁
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>

    <!-- ===== Edit / Create Modal ===== -->
    <transition name="fade-zoom">
      <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
        <div class="modal">
          <header class="modal-header">
            <span class="modal-mark" aria-hidden="true">✦</span>
            <h3>{{ editing ? "覆写频率档案" : "新建频率档案" }}</h3>
            <span class="modal-mark" aria-hidden="true">✦</span>
            <button class="close" @click="closeModal">✕</button>
          </header>
          <section class="modal-body">
            <label>
              <span class="label-text">标识名称</span>
              <input v-model="form.title" placeholder="为这份档案命名" />
            </label>
            <label>
              <span class="label-text">频率标签</span>
              <input
                v-model="form.slug"
                placeholder="例如：剧情、考据、机制等"
              />
            </label>
            <label>
              <span class="label-text">录入者</span>
              <input v-model="form.author" placeholder="留下你的契主署名" />
            </label>
            <label>
              <span class="label-text">频率内容</span>
              <textarea
                v-model="form.content"
                rows="8"
                placeholder="在此铭刻档案的具体内容……"
              ></textarea>
            </label>
          </section>
          <footer class="modal-footer">
            <button class="btn cancel-btn" @click="closeModal">取消</button>
            <button class="btn submit-btn" @click="submit" :disabled="isSubmitting">
              <span class="btn-shine"></span>
              <span>{{
                isSubmitting ? "铭刻中…" : editing ? "覆写" : "结契"
              }}</span>
            </button>
          </footer>
        </div>
      </div>
    </transition>

    <!-- ===== Detail Modal ===== -->
    <transition name="fade-zoom">
      <div
        class="modal-overlay"
        v-if="detailEntry"
        @click.self="detailEntry = null"
      >
        <div class="modal detail-modal">
          <header class="modal-header">
            <span class="modal-mark" aria-hidden="true">✦</span>
            <h3>{{ detailEntry.title }}</h3>
            <span class="modal-mark" aria-hidden="true">✦</span>
            <button class="close" @click="detailEntry = null">✕</button>
          </header>
          <section class="modal-body">
            <div class="detail-meta">
              <span v-if="detailEntry.slug" class="entry-badge">
                #{{ detailEntry.slug }}
              </span>
              <span class="meta-item">
                录入者 · {{ detailEntry.author || "无名频率" }}
              </span>
              <span class="meta-item">
                {{ formatTime(detailEntry.updatedAt) }}
              </span>
            </div>
            <div class="detail-content">{{ detailEntry.content }}</div>
          </section>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getWikiList,
  createWiki,
  updateWiki,
  deleteWiki,
  likeWiki,
} from "@/api/modules/wiki";

const LS_MY_WIKI_IDS = "suoming:wiki:my_ids";
const LS_LIKED_IDS = "suoming:wiki:liked_ids";

/* 本地缓存被写坏时不该整页白屏 */
function readIds(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch (e) {
    console.warn(`读取 ${key} 失败，已忽略`, e);
    return [];
  }
}

const myWikiIds: string[] = readIds(LS_MY_WIKI_IDS);

const markAsMine = (id: string | number) => {
  if (!myWikiIds.includes(String(id))) {
    myWikiIds.push(String(id));
    try {
      localStorage.setItem(LS_MY_WIKI_IDS, JSON.stringify(myWikiIds));
    } catch (e) {
      console.warn("保存我的档案记录失败", e);
    }
  }
};
const canEdit = (id: string | number) => myWikiIds.includes(String(id));

const entries = ref<any[]>([]);
const loading = ref(true);
const sortBy = ref<"likes" | "time">("likes");

const likedIds = ref<string[]>(readIds(LS_LIKED_IDS));

const showModal = ref(false);
const editing = ref(false);
const editingId = ref<string | number | null>(null);
const detailEntry = ref<any>(null);
const form = reactive({ title: "", slug: "", author: "", content: "" });
const search = ref("");
const isSubmitting = ref(false);

/* ===== 背景：锁链与余烬 ===== */
const colors = ["#ff3a56", "#c2a061", "#a98bff", "#ff8a9b"];
const embers = Array.from({ length: 24 }, () => ({
  left: Math.random() * 96 + 2,
  dur: 10 + Math.random() * 10,
  delay: -Math.random() * 20,
  size: 2 + Math.random() * 4,
  color: colors[Math.floor(Math.random() * colors.length)],
}));

const chainsBg = Array.from({ length: 12 }, () => ({
  left: Math.random() * 96 + 2,
  dur: 15 + Math.random() * 10,
  delay: -Math.random() * 20,
  opacity: 0.05 + Math.random() * 0.1,
}));

function formatTime(ts: string | number | null | undefined) {
  if (!ts) return "未知时间";
  const date = new Date(ts);
  if (isNaN(date.getTime())) return "未知时间";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

async function loadEntries() {
  loading.value = true;
  try {
    const res: any = await getWikiList();
    // 注意：如果你的后端做了角色区分，可能需要传 character_key: 'suoming' 之类的
    const list = Array.isArray(res?.data) ? res.data : [];
    entries.value = list.map((e: any) => ({
      ...e,
      createdAt: e.createdAt || e.created_at,
      updatedAt: e.updatedAt || e.updated_at,
    }));
  } catch (err) {
    console.error(err);
    ElMessage.error("加载档案失败");
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editing.value = false;
  editingId.value = null;
  form.title = "";
  form.slug = "";
  form.author = "";
  form.content = "";
  showModal.value = true;
}

function openEdit(entry: any) {
  if (!canEdit(entry.id)) {
    ElMessage.warning("只有创建者可以覆写");
    return;
  }
  editing.value = true;
  editingId.value = entry.id;
  form.title = entry.title;
  form.slug = entry.slug;
  form.author = entry.author;
  form.content = entry.content;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

const canSubmit = computed(() => form.title.trim() && form.content.trim());

async function submit() {
  if (!canSubmit.value) {
    ElMessage.warning("请填写标识与内容");
    return;
  }
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  const payload: any = {
    title: form.title.trim(),
    author: form.author.trim() || "无名频率",
    content: form.content.trim(),
    slug: null,
  };
  if (form.slug.trim()) payload.slug = form.slug.trim();
  try {
    if (editing.value && editingId.value) {
      await updateWiki(editingId.value, payload);
      ElMessage.success("覆写成功");
    } else {
      const res: any = await createWiki(payload);
      const newId = res?.data?.id;
      /* 接口可能只回 success 不回 data，别让这里把已建好的档案当成失败 */
      if (newId !== undefined && newId !== null) {
        markAsMine(newId);
        editingId.value = newId;
      }
      ElMessage.success("铭刻成功");
    }
    showModal.value = false;
    loadEntries();
  } catch (err) {
    console.error(err);
    ElMessage.error("提交失败");
  } finally {
    isSubmitting.value = false;
  }
}

async function remove(id: string | number) {
  if (!canEdit(id)) {
    ElMessage.warning("只有创建者可以销毁");
    return;
  }
  try {
    await ElMessageBox.confirm(
      "这一页会从秘库里彻底消失，连备份都没有。",
      "销毁这份档案？",
      {
        confirmButtonText: "销毁",
        cancelButtonText: "留着",
        type: "warning",
      }
    );
  } catch {
    return;
  }
  try {
    await deleteWiki(id);
    const index = myWikiIds.indexOf(String(id));
    if (index !== -1) myWikiIds.splice(index, 1);
    localStorage.setItem(LS_MY_WIKI_IDS, JSON.stringify(myWikiIds));
    ElMessage.success("销毁成功");
    loadEntries();
  } catch (err) {
    console.error(err);
    ElMessage.error("销毁失败");
  }
}

function persistLikedIds() {
  try {
    localStorage.setItem(LS_LIKED_IDS, JSON.stringify(likedIds.value));
  } catch (e) {
    console.warn("保存 likedIds 失败", e);
  }
}

function isLiked(id: string | number) {
  return likedIds.value.includes(String(id));
}

async function toggleLike(id: string | number) {
  const entry = entries.value.find((e) => e.id === id);
  if (!entry) return;

  const idStr = String(id);
  const wasLiked = likedIds.value.includes(idStr);

  if (wasLiked) {
    entry.likes = Math.max(0, (entry.likes || 0) - 1);
    likedIds.value = likedIds.value.filter((x) => x !== idStr);
  } else {
    entry.likes = (entry.likes || 0) + 1;
    likedIds.value.push(idStr);
  }
  persistLikedIds();

  try {
    const action = wasLiked ? "unlike" : "like";
    await likeWiki(id, action);
  } catch (err) {
    console.error("toggleLike error", err);
    if (wasLiked) {
      entry.likes = (entry.likes || 0) + 1;
      if (!likedIds.value.includes(idStr)) likedIds.value.push(idStr);
    } else {
      entry.likes = Math.max(0, (entry.likes || 0) - 1);
      likedIds.value = likedIds.value.filter((x) => x !== idStr);
    }
    persistLikedIds();
    ElMessage.error("共鸣失败，请稍后重试");
  }
}

function openDetail(entry: any) {
  detailEntry.value = entry;
}

const filteredEntries = computed(() => {
  const q = String(search.value || "")
    .trim()
    .toLowerCase();
  let list = entries.value;
  if (q) {
    list = list.filter(
      (e) =>
        (e.title || "").toLowerCase().includes(q) ||
        (e.slug || "").toLowerCase().includes(q)
    );
  }
  const arr = [...list];
  if (sortBy.value === "time") {
    const ts = (e: any) =>
      new Date(e.updatedAt || e.createdAt || 0).getTime() || 0;
    arr.sort((a, b) => ts(b) - ts(a));
  } else {
    arr.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }
  return arr;
});

/* 弹层：Esc 关闭 + 锁背景滚动，别让人点不到遮罩就出不去 */
function onKeydown(e: KeyboardEvent) {
  if (e.key !== "Escape") return;
  if (showModal.value) {
    showModal.value = false;
    return;
  }
  if (detailEntry.value) {
    detailEntry.value = null;
  }
}

watch(
  () => showModal.value || !!detailEntry.value,
  (locked) => {
    document.body.style.overflow = locked ? "hidden" : "";
  }
);

onMounted(() => {
  loadEntries();
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
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
.suoming-wiki {
  position: relative;
  min-height: 100vh;
  padding: 60px clamp(16px, 3vw, 44px) 60px;
  background: $ink;
  font-family: $font-body;
  color: $paper;
  overflow-x: hidden;
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
.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 30%, $ink 90%);
}

/* ============================================================
   顶部横幅
   ============================================================ */
.wiki-header {
  position: relative;
  z-index: 5;
  text-align: center;
  margin-bottom: 36px;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
}

.header-line {
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

.header-title {
  margin: 0;
  font-family: $font-title;
  font-size: clamp(38px, 5.4vw, 72px);
  font-weight: 400;
  letter-spacing: 0.14em;
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

.header-sub {
  margin: 8px 0 0;
  font-family: $font-en;
  font-size: clamp(10px, 1.1vw, 12px);
  letter-spacing: 0.48em;
  color: rgba($red-glow, 0.6);
  padding-left: 0.48em;
}

.header-poem {
  margin: 14px 0 0;
  font-family: $font-title;
  font-size: 16px;
  letter-spacing: 0.24em;
  color: rgba($gold-lt, 0.8);
  text-shadow: 0 0 12px rgba($red, 0.5);
}

.header-note {
  margin: 22px 0 4px;
  font-size: 13.5px;
  line-height: 1.85;
  text-align: left;
  vertical-align: top;
}

/* ============================================================
   主内容
   ============================================================ */
.wiki-main {
  position: relative;
  z-index: 5;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 工具条 */
.toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

/* 搜索框 */
.search-lamp {
  flex: 1;
  min-width: 240px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: rgba($ink-2, 0.8);
  border: 1px solid rgba($gold, 0.2);
  backdrop-filter: blur(10px);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus-within {
    border-color: rgba($red, 0.6);
    box-shadow: 0 0 0 2px rgba($red, 0.15), inset 0 0 20px rgba($red, 0.1);
  }

  .search-mark {
    font-size: 12px;
    color: $gold-lt;
    animation: pulseDot 3s infinite;
  }

  .search-input {
    flex: 1;
    padding: 2px 0;
    border: none;
    background: transparent;
    color: $paper;
    font-family: $font-title;
    font-size: 16px;
    letter-spacing: 0.1em;
    outline: none;
    min-width: 0;

    &::placeholder {
      color: rgba($paper, 0.3);
    }
  }

  .search-clear {
    background: transparent;
    border: none;
    color: rgba($paper, 0.5);
    cursor: pointer;
    font-size: 14px;
    &:hover {
      color: $red-lt;
    }
  }
}

/* 新建按钮 */
.new-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 1px solid $red-lt;
  background: linear-gradient(135deg, $blood, $red);
  color: $paper;
  font-family: $font-title;
  font-size: 16px;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba($red, 0.4);
  overflow: hidden;
  flex-shrink: 0;

  .btn-mark {
    color: $gold-lt;
    font-size: 12px;
    position: relative;
    z-index: 1;
  }
  .btn-text {
    position: relative;
    z-index: 1;
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
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba($red, 0.6);
    .btn-shine {
      left: 150%;
    }
  }
}

/* 统计栏 */
.stats-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 4px;
  font-family: $font-title;
  font-size: 14px;
  letter-spacing: 0.12em;
  color: rgba($paper, 0.5);

  .stats-item em {
    font-family: $font-mono;
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    color: $gold-lt;
    text-shadow: 0 0 10px rgba($gold, 0.5);
    padding: 0 4px;
  }

  .stats-divider {
    color: rgba($red, 0.6);
    font-size: 10px;
  }

  .stats-sort {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    font-size: 12px;
    letter-spacing: 0.08em;
    color: rgba($paper, 0.42);

    &__label {
      font-family: $font-body;
    }

    select {
      padding: 4px 8px;
      font-family: $font-body;
      font-size: 12px;
      color: rgba($paper, 0.75);
      background: rgba($ink, 0.7);
      border: 1px solid rgba($gold, 0.2);
      border-radius: 2px;
      cursor: pointer;
      outline: none;

      &:focus-visible {
        border-color: rgba($gold-lt, 0.6);
      }

      option {
        background: $ink-2;
        color: $paper;
      }
    }
  }
}

/* 加载骨架 */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.skeleton-card {
  height: 118px;
  border: 1px solid rgba($gold, 0.1);
  background: linear-gradient(
    100deg,
    rgba($ink-2, 0.85) 20%,
    rgba($gold, 0.06) 40%,
    rgba($ink-2, 0.85) 60%
  );
  background-size: 240% 100%;
  animation: wikiSkeleton 1.5s ease-in-out infinite;
}
@keyframes wikiSkeleton {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -40% 0;
  }
}

/* ============================================================
   档案列表卡片
   ============================================================ */
.entry-scroll {
  padding-bottom: 30px;
}
.entry-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 空状态 */
.empty-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 80px 20px;
  text-align: center;

  .empty-mark {
    font-size: 22px;
    color: $gold-lt;
    text-shadow: 0 0 14px rgba($gold, 0.9), 0 0 30px rgba($red, 0.6);
    animation: pulseDot 3.4s ease-in-out infinite;
  }
  .empty-text {
    font-family: $font-title;
    font-size: 16px;
    letter-spacing: 0.15em;
    color: rgba($gold-lt, 0.6);
    text-shadow: 0 0 12px rgba($red, 0.4);
  }
  .empty-btn {
    margin-top: 4px;
    padding: 8px 22px;
    font-family: $font-body;
    font-size: 12.5px;
    letter-spacing: 0.16em;
    color: rgba($paper, 0.8);
    background: transparent;
    border: 1px solid rgba($gold, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      color: $gold-lt;
      border-color: rgba($gold-lt, 0.7);
      background: rgba($blood, 0.22);
    }
  }
}

.entry-card {
  position: relative;
  padding: 26px 32px 24px 48px;
  background: rgba($ink-2, 0.85);
  border: 1px solid rgba($gold, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);

  &:hover {
    transform: translateY(-3px);
    border-color: rgba($red-lt, 0.6);
    box-shadow: 0 10px 30px rgba($red, 0.15), inset 0 0 20px rgba($red, 0.05);

    .card-wick {
      opacity: 1;
      width: 4px;
      box-shadow: 0 0 15px $red;
    }
    .entry-title {
      color: $gold-lt;
      text-shadow: 0 0 14px rgba($gold, 0.6);
    }
  }

  /* 四角金属折角 */
  .card-corner {
    position: absolute;
    width: 10px;
    height: 10px;
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

  /* 左侧垂直能量引线 */
  .card-wick {
    position: absolute;
    top: 16px;
    bottom: 16px;
    left: 20px;
    width: 2px;
    background: linear-gradient(180deg, transparent, $red-lt, transparent);
    opacity: 0.5;
    transition: all 0.3s ease;
  }

  /* 标题区 */
  .entry-main {
    cursor: pointer;
    margin-bottom: 16px;
    position: relative;
    z-index: 1;

    .entry-title-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 8px;

      .entry-title {
        margin: 0;
        font-family: $font-title;
        font-size: 24px;
        font-weight: 400;
        letter-spacing: 0.08em;
        color: $paper;
        transition: color 0.3s ease, text-shadow 0.3s ease;
        line-height: 1.3;
      }

      .entry-badge {
        padding: 2px 8px;
        font-family: $font-en;
        font-size: 12px;
        letter-spacing: 0.08em;
        color: rgba($violet-lt, 0.9);
        border: 1px solid rgba($violet, 0.4);
        background: rgba($violet, 0.1);
      }
    }

    .entry-meta-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;

      .meta-item {
        font-size: 13px;
        letter-spacing: 0.04em;
        color: rgba($paper, 0.5);
      }
      .meta-dot {
        font-size: 13px;
        color: rgba($red, 0.5);
      }
    }
  }

  /* 操作区 */
  .entry-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    padding-top: 14px;
    border-top: 1px dashed rgba($gold, 0.15);
    position: relative;
    z-index: 1;

    /* 点赞按钮 (共鸣结晶) */
    .like-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border: 1px solid rgba($gold, 0.2);
      background: rgba($ink, 0.5);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba($red-lt, 0.6);
        background: rgba($blood, 0.3);
      }
      &.active {
        border-color: $red-lt;
        background: rgba($red, 0.2);
      }

      .heart {
        width: 10px;
        height: 10px;
        background: rgba($paper, 0.3);
        transform: rotate(45deg);
        transition: all 0.3s ease;
        &.liked {
          background: $red-lt;
          box-shadow: 0 0 10px rgba($red-lt, 0.8), inset 0 0 4px #fff;
          animation: pulseDot 2s infinite;
        }
      }

      .like-count {
        font-family: $font-mono;
        font-size: 13px;
        font-weight: 700;
        color: rgba($paper, 0.7);
        .active & {
          color: $red-glow;
        }
      }
    }

    /* 编辑/删除 */
    .edit-delete {
      display: flex;
      gap: 10px;
      margin-left: auto;

      .action-btn {
        padding: 4px 12px;
        font-family: $font-title;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.25s ease;
        background: transparent;

        &.edit-btn {
          border: 1px solid rgba($gold, 0.3);
          color: $gold-lt;
          &:hover {
            background: rgba($gold, 0.1);
            border-color: $gold;
          }
        }

        &.delete-btn {
          border: 1px solid rgba($red, 0.3);
          color: $red-glow;
          &:hover {
            background: rgba($red, 0.2);
            border-color: $red-lt;
          }
        }
      }
    }
  }
}

/* ============================================================
   弹窗 (终端)
   ============================================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($ink, 0.9);
  backdrop-filter: blur(10px);
  padding: 20px;
}

.modal {
  position: relative;
  width: 560px;
  max-width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 30px 32px;
  background: $ink-2;
  border: 1px solid rgba($gold, 0.3);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba($red, 0.1);

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

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba($red, 0.5);
  }

  &.detail-modal {
    width: 660px;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px dashed rgba($gold, 0.2);
  position: relative;

  h3 {
    margin: 0;
    font-family: $font-title;
    font-size: 24px;
    font-weight: 400;
    letter-spacing: 0.1em;
    color: $paper;
    max-width: 70%;
    text-align: center;
  }

  .modal-mark {
    font-size: 12px;
    color: $red-lt;
    animation: pulseDot 3s infinite;
  }

  .close {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    background: rgba($red, 0.1);
    border: 1px solid rgba($red, 0.3);
    color: $paper;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      background: rgba($red, 0.3);
      border-color: $red-lt;
    }
  }
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 18px;

  label {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .label-text {
      font-size: 14px;
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
        background: $red-lt;
      }
    }

    input,
    textarea {
      padding: 12px 16px;
      background: rgba($ink, 0.6);
      border: 1px solid rgba($gold, 0.2);
      color: $paper;
      font-family: inherit;
      font-size: 14.5px;
      outline: none;
      transition: all 0.25s ease;

      &::placeholder {
        color: rgba($paper, 0.2);
      }
      &:focus {
        border-color: rgba($red, 0.6);
        box-shadow: inset 0 0 15px rgba($red, 0.1);
      }
    }
    textarea {
      resize: vertical;
      min-height: 140px;
      line-height: 1.8;
    }
  }

  /* 详情界面 */
  .detail-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;

    .entry-badge {
      padding: 2px 8px;
      font-family: $font-en;
      font-size: 12px;
      color: rgba($violet-lt, 0.9);
      border: 1px solid rgba($violet, 0.4);
    }
    .meta-item {
      font-size: 13px;
      color: rgba($paper, 0.5);
    }
  }

  .detail-content {
    max-height: 55vh;
    overflow-y: auto;
    padding: 20px 24px;
    background: rgba($ink, 0.5);
    border: 1px solid rgba($gold, 0.15);
    font-size: 15.5px;
    line-height: 2.1;
    color: rgba($paper, 0.85);
    white-space: pre-wrap;
    word-break: break-word;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba($red, 0.4);
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;

  .btn {
    position: relative;
    padding: 10px 24px;
    font-family: $font-title;
    font-size: 15px;
    letter-spacing: 0.15em;
    cursor: pointer;
    transition: all 0.25s ease;
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

  .submit-btn {
    background: linear-gradient(135deg, $blood, $red);
    border: 1px solid $red-lt;
    color: $paper;
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
}

/* 过渡动画 */
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.35s ease;
}
.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* ============================================================
   响应式
   ============================================================ */
@media (max-width: 768px) {
  .suoming-wiki {
    padding: 40px 14px 40px;
  }
  .wiki-header {
    margin-bottom: 24px;
  }
  .header-line {
    width: 40px;
  }
  .header-title {
    letter-spacing: 0.1em;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .new-btn {
    justify-content: center;
  }

  .entry-card {
    padding: 22px 20px 20px 40px;
  }
  .entry-card .card-wick {
    left: 16px;
  }
  .entry-card .entry-title {
    font-size: 20px !important;
  }
  .entry-card .edit-delete {
    width: 100%;
    justify-content: flex-end;
    margin-top: 10px;
  }

  .modal {
    padding: 24px 20px;
  }
  .modal-header h3 {
    font-size: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .umb-ring,
  .bg-chains span,
  .embers span,
  .header-title,
  .search-mark,
  .btn-shine,
  .card-wick,
  .like-btn .heart.liked {
    animation: none !important;
  }
  .entry-card,
  .entry-card .card-wick,
  .like-btn,
  .action-btn {
    transition: none !important;
  }
  .entry-card:hover {
    transform: none;
  }
}
</style>
