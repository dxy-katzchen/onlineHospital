<template>
  <TabBar />
  <Aside />

  <div :class="$style.main">
    <router-view />
  </div>
</template>

<script setup>
import TabBar from "./TabBar.vue";
import Aside from "./aside.vue";
</script>

<style module lang="less">
.main {
  font-size: 1rem;
  // background-color: green;
  padding: 3.5rem 0 0 13rem;
  // background: url("@/assets/tableBg1.svg");
  height: calc(100vh - 3.5rem);
}
</style>
