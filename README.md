# 锁暝 · 伞下故影

鸣潮角色「锁暝」的非官方电子设定集。深墨底、朱红与旧金，配一点纸和印章的手感。

## 技术栈

- Vue 3 `<script setup>` + TypeScript + Vite 6
- vue-router 4（hash 模式，带路由过渡与进度条）
- SCSS（设计令牌集中在 `src/styles/theme.scss`）
- three.js（仅首页背景，懒加载）
- gsap（浮动 Q 版小人与入场动效）
- socket.io-client（导航栏在线人数）
- axios（统一封装在 `src/api/axios.ts`）
- Element Plus（**仅**按需引入 `ElMessage` 及其样式）

## 常用命令

```bash
npm install
npm run dev        # 本地开发，http://localhost:9527
npm run build      # 生产构建，输出到 dist/
npm run preview    # 预览构建产物
npm run typecheck  # vue-tsc 类型检查
```

## 目录速览

```
src/
├─ api/              # 接口封装（images / message / music / ranking / resource / wiki / deepseek）
├─ assets/           # 图片、字体、reset.css
├─ components/       # navbar.vue（左侧十契竖排导航 + 移动端锁印抽屉）
├─ router/           # 路由表、标题、进度条、404 兜底
├─ styles/           # theme.scss：色板、字体、滚动条、焦点环、便利贴与朱印
└─ views/
   ├─ page1/         # 首页（three.js 机关伞 + 飘落的竖排台词）
   ├─ timeLine/      # 人物介绍（剧情纪事 / 核心机制 / 共鸣状况 / 专武 / 珍物 / 共鸣链 / 角色故事）
   ├─ messageView/   # 留言板（契约纸左右交错）
   ├─ galleryView/   # 图集（瀑布流 + 灯箱 + 上传 + 排行榜）
   ├─ resourcesView/ # 资源分享
   ├─ wikiView/      # 文本分享（频率档案）
   ├─ talkView/      # AI 对话（梦枢终端）
   ├─ musicView/     # 曲库（黑胶转盘 + 频率档案列表）
   └─ NotFoundView.vue
```

## 环境变量

- `.env.development`：`VITE_API_BASE_URL=http://36.150.237.25:3000`
- `.env.production`：留空即走同源（站点与接口部署在同一域名下时最省事）

## 设计约定

- 配色只从 `--sm-*` 变量取，不要再在页面里硬编码十六进制。
- 说明性文字用宋体（`--sm-font-body`），大标题才用马善政书法体（`--sm-font-title`）——小字用书法体会发虚。
- 装饰性动画请同时考虑 `prefers-reduced-motion`（theme.scss 里已做全局兜底）。
- 手写感的点缀用 `.sm-note`（便利贴）、`.sm-seal`（朱印），别在每个页面重新发明一遍。
- 图片路径一律走 `import.meta.env.BASE_URL` 或 `@/assets/...`，不要写死 `/xxx.png`（本站以 `base: './'` 构建，可能部署在子目录）。
