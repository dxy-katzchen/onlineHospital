<template>
  <div :class="$style.content">
    <i
      class="iconfont icon-zuojiantou_huaban"
      @click="router.back(-1)"
      :class="$style.leftIcon"
    ></i>
    <div :class="$style.titleInfo">
      <div :class="$style.title">Details of medical records</div>
      <span :class="$style.author">
        doctor name : {{ appointmentData.doc_name }} &nbsp;&nbsp;&nbsp; patient
        name :
        {{ appointmentData.patient_name }}
        &nbsp;&nbsp;&nbsp; Department :
        {{ appointmentData.dept_name }} &nbsp;&nbsp;&nbsp; doctor Title :
        {{ appointmentData.title_name }} &nbsp;&nbsp;&nbsp; Type of consultation
        :
        {{
          appointmentData.consult_type === 0
            ? "Chat Consultation"
            : "Video Consultation"
        }}
      </span>
      <span :class="$style.date">
        <i class="iconfont icon-clock" :class="$style.clock" />
        Creation time :{{ medicalHistory.time }} &nbsp;&nbsp;&nbsp;
        <i class="iconfont icon-clock" :class="$style.clock" />
        Appointment Time :{{ appointmentData.time }}
      </span>
    </div>
    <MdEditor
      :class="$style.editor"
      v-model="medicalHistory.description"
      preview-only
    />
  </div>
  <div></div>
</template>

<script setup>
import { onMounted, computed, reactive } from "vue";
import MdEditor from "md-editor-v3";
import { useRoute, useRouter } from "vue-router";
import "md-editor-v3/lib/style.css";
import api from "@/axios";
import { ElMessage } from "element-plus";
const medicalHistory = reactive({});
const appointmentData = reactive({});
const route = useRoute();
const router = useRouter();
const { med_hist_id } = route.query;

onMounted(async () => {
  await getMedicalHistory();
  await getAppointment();
});
const getMedicalHistory = async () => {
  try {
    const { status, message, data } = await api.getSingleMedicalHistory(
      med_hist_id
    );

    if (status === 0 && data.length === 1) {
      Object.assign(medicalHistory, data[0]);

      return;
    }
    ElMessage.error(message);
  } catch (error) {
    ElMessage.error(error);
  }
};
const getAppointment = async () => {
  try {
    const { status, message, data } = await api.getAppointment(
      medicalHistory.appt_id
    );

    if (status === 0) {
      Object.assign(appointmentData, data);

      return;
    }
    ElMessage.error(message);
  } catch (error) {
    ElMessage.error(error);
  }
};
</script>

<style module lang="less">
.content {
  z-index: 888;
  position: relative;
  background-color: #fff;
  top: 4vh;
  width: 66vw;
  margin: 0 auto;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.3);
  padding: 2.5rem 5rem 5rem 5rem;
  border-radius: 2rem;
  .leftIcon {
    font-size: 2.3rem;
    cursor: pointer;
    position: absolute;
    left: 3rem;
    top: 2.3rem;
    color: rgba(0, 0, 0, 0.4);
  }
  .titleInfo {
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      font-size: 1.8rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .author {
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.7);
      margin-top: 1.5rem;
    }
    .date {
      font-size: 0.9rem;
      margin-bottom: 0;
      color: rgba(0, 0, 0, 0.5);
      .clock {
        margin-right: 0.2rem;
      }
    }
  }
  .editor {
    height: 100%;
  }
}
</style>
