<template>
  <el-switch
    v-model="is_dark"
    class="mt-2"
    inline-prompt
    :active-icon="Moon"
    :inactive-icon="Sunny"
    :class="$style.switch"
  />
</template>

<script setup>
import { ref, watch } from "vue";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { useDarkStore } from "@/store";

let is_dark = ref(true);
const darkStore = useDarkStore();

watch(is_dark, (newval) => {
  darkStore.isDark = newval;
});
</script>

<style module lang="less">
.switch {
  --el-switch-on-color: rgba(7, 25, 47, 0.1);
  --el-switch-off-color: rgb(124, 144, 242, 0.1);
}
</style>
