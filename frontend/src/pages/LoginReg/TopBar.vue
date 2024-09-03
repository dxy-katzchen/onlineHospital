<template>
  <div :class="$style.topBar">
    <router-link :to="{ name: 'Login' }">Log in</router-link>
    <router-link :to="{ name: 'Register' }">Register</router-link>
    <SwitchDark :class="$style.switch" />
  </div>
</template>

<script setup>
import SwitchDark from "@/components/switchDark.vue";
</script>

<style module lang="less">
.topBar {
  a {
    text-decoration: none;
    color: #fff;
    margin: 0 1rem 0 3rem;
    transition: font-weight 0.3s;
  }
  a:hover {
    transition: font-weight 0.3s;
    font-weight: bold;
  }
  line-height: 5rem;
  height: 5rem;
  width: 100vw;
  // background: red;
}
.switch {
  margin-left: 3rem;
}
</style>
