import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, minimum: 0.12, trickleSpeed: 160 });

const SITE_NAME = "锁暝 · 伞下故影";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      meta: { title: "首页" },
      component: () => import("@/views/page1/index.vue"),
    },
    {
      path: "/timeLine",
      name: "timeline",
      meta: { title: "人物介绍" },
      component: () => import("@/views/timeLine/index.vue"),
    },
    {
      path: "/message",
      name: "message",
      meta: { title: "留言板" },
      component: () => import("@/views/messageView/index.vue"),
    },
    {
      path: "/gallery",
      name: "gallery",
      meta: { title: "契印图集" },
      component: () => import("@/views/galleryView/index.vue"),
    },
    {
      path: "/resources",
      name: "resources",
      meta: { title: "资源分享" },
      component: () => import("@/views/resourcesView/index.vue"),
    },
    {
      path: "/talk",
      name: "talk",
      meta: { title: "梦枢终端" },
      component: () => import("@/views/talkView/index.vue"),
    },
    {
      path: "/wiki",
      name: "wiki",
      meta: { title: "频率秘库" },
      component: () => import("@/views/wikiView/index.vue"),
    },
    {
      path: "/music",
      name: "music",
      meta: { title: "梦枢音频终端" },
      component: () => import("@/views/musicView/index.vue"),
    },
    {
      /* 兜底：九契之外，无人在册 */
      path: "/:pathMatch(.*)*",
      name: "not-found",
      meta: { title: "无此契" },
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) {
      return { el: to.hash, top: 88, behavior: "smooth" };
    }
    return { top: 0 };
  },
});

router.beforeEach((to, _from, next) => {
  NProgress.start();
  next();
});

router.afterEach((to) => {
  NProgress.done();
  const sub = (to.meta?.title as string | undefined) ?? "";
  document.title = sub ? `${sub} · ${SITE_NAME}` : SITE_NAME;
});

/* 懒加载 chunk 在生产更新后可能 404：提示并刷新一次，避免白屏 */
router.onError((error) => {
  NProgress.done();
  const msg = String((error as Error)?.message ?? error);
  if (/dynamically imported module|Importing a module script failed/i.test(msg)) {
    window.location.reload();
  }
});

export default router;
