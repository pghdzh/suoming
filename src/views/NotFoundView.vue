<template>
  <section class="nf">
    <div class="nf__bg" aria-hidden="true"></div>

    <div class="nf__inner">
      <p class="nf__code">404</p>
      <h1 class="nf__title">伞骨收拢，此处无契</h1>
      <p class="nf__desc">
        你要找的那一页，或许是落在雨里了。<br />
        不妨回到伞下，从「十契」里重新走一遍。
      </p>

      <div class="nf__actions">
        <RouterLink class="nf__btn nf__btn--main" to="/">回到伞下</RouterLink>
        <RouterLink class="nf__btn" to="/timeLine">看人物档案</RouterLink>
      </div>

      <span class="sm-seal nf__seal" aria-hidden="true">锁</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped lang="scss">
.nf {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 96px 24px;
  overflow: hidden;
  background: #060305;

  &__bg {
    position: absolute;
    inset: -10%;
    background:
      radial-gradient(46% 38% at 50% 42%, rgba(192, 20, 47, 0.2), transparent 70%),
      radial-gradient(30% 26% at 78% 78%, rgba(106, 58, 224, 0.16), transparent 70%);
    filter: blur(30px);
    animation: nfFloat 14s ease-in-out infinite alternate;
  }

  &__inner {
    position: relative;
    z-index: 1;
    max-width: 560px;
    text-align: center;
  }

  &__code {
    margin: 0 0 6px;
    font-family: "Cinzel", serif;
    font-size: clamp(64px, 16vw, 128px);
    line-height: 1;
    letter-spacing: 0.08em;
    background: linear-gradient(180deg, #ffc9d1 0%, #c0142f 62%, #5c0a16 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    opacity: 0.85;
  }

  &__title {
    margin: 0 0 14px;
    font-family: "MaShanZheng", "全字库正宋体", serif;
    font-size: clamp(26px, 4.6vw, 38px);
    font-weight: 400;
    letter-spacing: 0.08em;
    color: #f2ddab;
  }

  &__desc {
    margin: 0 auto 32px;
    max-width: 30em;
    font-size: 15px;
    line-height: 2;
    color: rgba(233, 221, 224, 0.62);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    justify-content: center;
  }

  &__btn {
    display: inline-block;
    padding: 11px 26px;
    font-size: 14px;
    letter-spacing: 0.18em;
    color: rgba(253, 244, 245, 0.78);
    text-decoration: none;
    border: 1px solid rgba(194, 160, 97, 0.34);
    background: rgba(255, 255, 255, 0.02);
    transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease,
      transform 0.3s ease;

    &:hover {
      color: #f2ddab;
      border-color: rgba(242, 221, 171, 0.7);
      background: rgba(192, 20, 47, 0.12);
      transform: translateY(-2px);
    }

    &--main {
      color: #ffe9dd;
      border-color: rgba(192, 20, 47, 0.65);
      background: linear-gradient(180deg, rgba(192, 20, 47, 0.32), rgba(92, 10, 22, 0.2));
    }
  }

  &__seal {
    position: absolute;
    right: -18px;
    bottom: -54px;
    width: 46px;
    height: 46px;
    font-size: 22px;
    opacity: 0.75;
  }
}

@keyframes nfFloat {
  from {
    transform: translate3d(-2%, 1%, 0) scale(1);
  }
  to {
    transform: translate3d(2%, -2%, 0) scale(1.06);
  }
}

@media (max-width: 640px) {
  .nf__seal {
    display: none;
  }
}
</style>
