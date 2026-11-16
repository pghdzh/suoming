<template>
  <div id="app">
    <ScrollProgress />
    <navbar />

    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import navbar from "@/components/navbar.vue";
import ScrollProgress from "@/components/ScrollProgress.vue";
</script>

<style scoped lang="scss">
#app {
  position: relative;
  min-height: 100vh;
  background: #05040a;
  /* 手绘光标：原来 1s 走完 8 帧偏急，放慢到 1.6s 更接近呼吸 */
  animation: cursorAnimation 1.6s infinite step-start;
}

/* 左侧「十契」锁链导航：桌面端为其预留宽度，避免压住正文 */
@media (min-width: 1201px) {
  .main-content {
    padding-left: 92px;
  }
}

/* 移动端底部留白，别让 FAB 压住页面最后一屏内容 */
@media (max-width: 1200px) {
  .main-content {
    padding-bottom: 84px;
  }
}

/* ---------- 换页：像翻过一页纸 ---------- */
.page-enter-active {
  transition: opacity 0.42s ease, transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.42s ease;
}
.page-leave-active {
  transition: opacity 0.26s ease, transform 0.26s ease, filter 0.26s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
  filter: blur(3px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
  filter: blur(2px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.2s linear;
  }
  .page-enter-from,
  .page-leave-to {
    transform: none;
    filter: none;
  }
}
</style>
