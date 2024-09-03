<template>
  <div ref="infoBg" :class="$style.infoBg">
    <slot></slot>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const infoBg = ref(null);

let effect = null;

onMounted(() => {
  effect = VANTA.WAVES({
    el: infoBg.value,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.0,
    scaleMobile: 1.0,
    color: 0x725db9,
    zoom: 0.8,
  });
});

onUnmounted(() => {
  if (effect) {
    effect.destroy();
  }
});
</script>

<style module lang="less">
.infoBg {
  z-index: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
