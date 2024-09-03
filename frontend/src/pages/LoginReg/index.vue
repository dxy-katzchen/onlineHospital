<template>
  <BackGround>
    <div :class="$style.left">
      <TopBar />
      <div :class="$style.titleContent">
        <span :class="$style.Title">OnlineHospital</span>
        <span :class="$style.subTitle"> We care about your wellbeing... </span>
      </div>
    </div>
    <div :class="$style.right">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </div>
  </BackGround>
</template>

<script setup>
import TopBar from "./TopBar.vue";
import BackGround from "./BackGround.vue";
</script>

<style module lang="less">
.left {
  display: inline-block;
  width: 55vw;
  height: 100vh;

  .titleContent {
    color: #fff;
    height: calc(100vh - 5rem);
    display: flex;
    justify-content: center;
    flex-direction: column;
    box-sizing: border-box;
    padding-left: 4rem;
    .Title {
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
      font-weight: bold;
    }
    .subTitle {
      font-size: 1.5rem;
    }
  }
}
.right {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 45vw;
  height: 100vh;
}
</style>
<style>
/* 渐变设置 */
.fade-enter-from {
  transform: translateY(-30rem);
  opacity: 0;
}
.fade-leave-to {
  transform: translateY(10rem);
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.fade-enter-active {
  transition: all 0.7s ease;
}
.fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.6, 0.6, 1);
}
</style>
