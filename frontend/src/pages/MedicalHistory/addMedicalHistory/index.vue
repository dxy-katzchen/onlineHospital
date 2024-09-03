<template>
  <div :class="$style.top">
    <i
      class="iconfont icon-zuojiantou_huaban"
      @click="router.back(-1)"
      :class="$style.leftIcon"
    ></i>

    <button :class="$style.submitBtn" @click="submit">Submit</button>
  </div>
  <div :class="$style.editorContent">
    <MdEditor
      :class="$style.editor"
      @onUploadImg="Upload"
      v-model="med_hist_dtl.description"
    />
  </div>
</template>

<script setup>
import { reactive, onBeforeMount } from "vue";

import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import model from "./medicalHistoryModel";
import UploadImg from "@/Hooks/UpLoadImg.js";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import api from "@/axios";

const med_hist_dtl = reactive({
  description: "",
});
const route = useRoute();
const router = useRouter();

onBeforeMount(() => {
  med_hist_dtl.description = model;
});

const Upload = async (files, callback) => {
  await UploadImg(files, callback);
};
const submit = async () => {
  try {
    const { status, message } = await api.addMedicalHistory(
      route.query.appt_id,
      med_hist_dtl.description
    );
    if (status === 0) {
      ElMessage.success(message);
      route.back(-1);
      return;
    }
    ElMessage.error(message);
  } catch (error) {
    ElMessage.error(error);
  }
};
</script>

<style module lang="less">
.top {
  background: #d3a2f1;
  position: fixed;
  top: 3.5rem;
  width: calc(100vw - 13rem);
  height: 3.5rem;
  padding: 0 2rem 0 1rem;
  box-sizing: border-box;
  line-height: 3.5rem;
  display: flex;
  justify-content: space-between;
  color: #fff;
  z-index: 999;
  .leftIcon {
    font-size: 2rem;
    cursor: pointer;
    flex: 0 0;
  }

  .submitBtn {
    margin-top: 0.35rem;
    width: 9rem;
    height: 2.8rem;
    font-size: 1.1rem;
    border: 0;
    background-color: #9025d2;
    color: #fff;
    border-radius: 2rem;
    transition: all 0.2s;
    &:hover {
      border: 2px solid #9025d2;
      color: #9025d2;
      background: #fff;
      transition: all 0.2s;
    }
  }
}
.editorContent {
  position: relative;
  padding-top: 3.5rem;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  .editor {
    height: 100%;
  }
}
</style>
