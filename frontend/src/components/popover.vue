<template>
  <el-popover trigger="hover" placement="bottom" popper-class="infoPopover">
    <template #reference>
      <img :src="userInfo.user.avatar || peach" alt="" class="avatar" />
    </template>
    <template class="popoverList" #default>
      <router-link :to="{ name: 'MyInfo' }" class="popoverItem"
        >Profile</router-link
      >
      <div class="popoverItem" @click="logout">Log out</div>
    </template>
  </el-popover>
</template>

<script setup>
import peach from "@/assets/peach.svg";
import { useInfoStore } from "@/store";
import { useRouter } from "vue-router";

const router = useRouter();
const userInfo = useInfoStore();

const { role } = userInfo.user;
const logout = () => {
  router.push({ name: "Login" });
  userInfo.$reset();
};
</script>

<style>
.avatar {
  object-fit: cover;
}
</style>
