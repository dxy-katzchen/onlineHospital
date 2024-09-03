<template>
  <div :class="$style.aside">
    <el-menu
      router
      :default-active="$route.path"
      :class="$style.menu"
      background-color="blueviolet"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-sub-menu index="1">
        <template #title>
          <span>Hospital Lobby</span>
        </template>
        <el-menu-item index="/myInfo">My info</el-menu-item>
        <el-menu-item v-if="role === 1" index="/addAppointment">
          Appointment
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2" v-if="role !== 3">
        <template #title>
          <span>About me</span>
        </template>
        <el-menu-item index="/myAppointmentList"
          >Appointment Record</el-menu-item
        >
        <el-menu-item index="/medicalHistoryList"
          >Medical Records List</el-menu-item
        >
        <el-menu-item index="/getMyPsList">Prescriptions List</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3" v-if="role === 3">
        <template #title>
          <span>Edit</span>
        </template>
        <el-menu-item index="/manageDrug">Drug information</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { useInfoStore } from "@/store";

const userInfo = useInfoStore();
const { role } = userInfo.user;
</script>

<style module lang="less">
.aside {
  position: fixed;
  top: 3.5em;
  bottom: 0;
  left: 0;
  width: 13rem;
  background-color: rgba(255, 255, 255, 0.5);

  overflow: hidden;
  padding-top: 0;

  .menu {
    height: 100%;
  }
}
</style>
<style lang="less" scoped>
:deep(.el-menu-item:hover) {
  // background-color: #4ba8d799 !important;
  transition: all 0.3s;
  // color: #fff;
}
</style>
