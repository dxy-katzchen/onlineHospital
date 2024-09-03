<template>
  <div ref="loginBg" :class="$style.loginBackGround">
    <slot></slot>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

import { useDarkStore } from "@/store";
const darkStore = useDarkStore();

const loginBg = ref(null);

const darkOption = {
  backgroundColor: 0x1746,
  color1: 0x4a00ff,
  color2: 0x95ff00,
  colorMode: "varianceGradient",
};
const lightOption = {
  backgroundColor: 0x7c90f2,
  color1: 0x9116e8,
  color2: 0xb4c065,
  colorMode: "variance",
};
let effect = null;

onMounted(() => {
  effect = VANTA.BIRDS({
    el: loginBg.value,
    colorMode: "varianceGradient",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: window.innerHeight,
    minWidth: window.innerWidth,
    scale: 1.0,
    scaleMobile: 1.0,
    backgroundColor: 0x1746,
    color1: 0x4a00ff,
    color2: 0x95ff00,
  });
});

watch(
  () => darkStore.isDark,
  (newval) => {
    effect.setOptions(newval === true ? darkOption : lightOption);
  }
);

onUnmounted(() => {
  if (effect) {
    effect.destroy();
  }
});
</script>

<style module lang="less">
.loginBackGround {
  z-index: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
