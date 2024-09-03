<template>
  <div :class="$style.psDetail">
    <i
      class="iconfont icon-zuojiantou_huaban"
      @click="router.back(-1)"
      :class="$style.leftIcon"
    ></i>
    <span :class="$style.title">Prescription details</span>
    <div :class="$style.dtlInfo">
      <div :class="$style.infoItem">
        <div :class="$style.prop">Patient's name&nbsp;:&nbsp;&nbsp;</div>
        <div :class="$style.content">{{ psInfo.patient_name }}</div>
      </div>
      <div :class="$style.infoItem">
        <div :class="$style.prop">Doctor's name&nbsp;:&nbsp;&nbsp;</div>
        <div :class="$style.content">{{ psInfo.doc_name }}</div>
      </div>
      <div :class="$style.infoItem">
        <div :class="$style.prop">Title&nbsp;:&nbsp;&nbsp;</div>
        <div :class="$style.content">{{ psInfo.title_name }}</div>
      </div>
      <div :class="$style.infoItem">
        <div :class="$style.prop">Department&nbsp;:&nbsp;&nbsp;</div>
        <div :class="$style.content">{{ psInfo.dept_name }}</div>
      </div>
      <br />
      <div :class="$style.infoItem">
        <div :class="$style.prop">Appointment Time&nbsp;:&nbsp;&nbsp;</div>
        <div :class="$style.content">{{ psInfo.time }}</div>
      </div>
      <div :class="$style.infoItem">
        <div :class="$style.prop">
          Prescription order issuance time&nbsp;:&nbsp;&nbsp;
        </div>
        <div :class="$style.content">{{ psInfo.create_time }}</div>
      </div>
      <div :class="$style.infoItem">
        <div :class="$style.prop">&nbsp;:&nbsp;&nbsp;</div>
        <div :class="$style.content">{{ psInfo.fee }}</div>
      </div>
      <div :class="$style.infoItem">
        <div :class="$style.prop">Type of consultation&nbsp;:&nbsp;&nbsp;</div>
        <div :class="$style.content">
          {{
            psInfo.consult_type === 0
              ? "Chat Consultation"
              : "Video Consultation"
          }}
        </div>
      </div>
    </div>
    <el-table :data="psDrugList" border>
      <el-table-column prop="drug_name" label="Drug name" align="center" />
      <el-table-column prop="quantity" label="quantities" align="center" />
      <el-table-column prop="price" label="subtotal" align="center" />
    </el-table>
    <div
      :class="$style.payBtn"
      @click="exportPsExcel"
      v-if="(role === 1 && psInfo.paid) || role === 2"
    >
      Export Prescription Orders
    </div>
    <div :class="$style.totalPrice">
      Total $<span :class="$style.totalPriceNum">
        {{ psInfo.total_price }}</span
      >
    </div>
    <div
      :class="$style.payBtn"
      v-if="role === 1 && !psInfo.paid"
      @click="PayCodeVisible = true"
    >
      Paying a total of ${{ psInfo.total_price }}
    </div>
  </div>
  <el-dialog v-model="PayCodeVisible" title="Payment">
    <img src="@/assets/payImg.jpg" alt="payment code" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="PayCodeVisible = false">Cancel</el-button>
        <el-button type="primary" @click="pay"> I've paid </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import api from "@/axios";
import { useRoutes } from "@/router/useRoutes.js";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { useInfoStore } from "@/store";
import exportExcel from "@/Hooks/ExportExcel.js";
const userInfo = useInfoStore();
const route = useRoute();
const router = useRouter();
const psDrugList = ref([]);
const psInfo = reactive({});
const { fromRoute } = useRoutes();
const { role } = userInfo.user;
const Ps_id = ref();
const Appt_id = ref();
const PayCodeVisible = ref(false);

onMounted(async () => {
  if (fromRoute.value?.name === "MyAppointmentList") {
    const { appt_id } = route.query;
    Appt_id.value = appt_id;
    await getPsId();
  } else if (fromRoute.value?.name === "GetMyPsList") {
    const { ps_id } = route.query;
    Ps_id.value = ps_id;

    await getApptId();
  }

  await getPsDrugInfo();
  await getApptInfo();
});

const exportPsExcel = () => {
  const titleArr = ["Name of drug", "quantities", "subtotal"];

  exportExcel(
    psDrugList.value,
    `prescription_${Ps_id.value}`,
    titleArr,
    "Prescription"
  );
};
const pay = async () => {
  try {
    const { status, message } = await api.psPay(Ps_id.value);
    if (status === 0) {
      PayCodeVisible.value = false;
      await getPsDrugInfo();
      return;
    }
    ElMessage.error(message);
  } catch (error) {
    ElMessage.error(error);
  }
};
const getApptId = async () => {
  try {
    const { status, message, appt_id } = await api.getApptId(Ps_id.value);

    if (status === 0) {
      Appt_id.value = appt_id;
      return;
    }
    ElMessage.error(message);
  } catch (error) {
    ElMessage.error(error);
  }
};
const getPsId = async () => {
  try {
    const { ps_id, status, message } = await api.getPsId(Appt_id.value);

    if (status === 0) {
      Ps_id.value = ps_id;
      return;
    }
    ElMessage.error(message);
  } catch (error) {
    ElMessage.error(error);
  }
};
const getPsDrugInfo = async () => {
  try {
    const { drugList, generalInfo, status, message } = await api.getPsDetail(
      Ps_id.value
    );
    if (status === 0) {
      Object.assign(psInfo, generalInfo);
      const drugList1 = drugList.map((obj) => {
        const { ps_id, ...rest } = obj;
        return rest;
      });
      psDrugList.value = drugList1;

      return;
    }
    ElMessage.error(message);
  } catch (error) {
    ElMessage.error(error);
  }
};
const getApptInfo = async () => {
  try {
    const { data, status, message } = await api.getAppointment(Appt_id.value);
    if (status === 0) {
      Object.assign(psInfo, data);
      return;
    }
    ElMessage.error(message);
  } catch (error) {
    ElMessage.error(error);
  }
};
</script>

<style module lang="less">
.psDetail {
  position: relative;
  margin: 1.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  border-radius: 1.2rem;
  padding: 1.5rem 2rem 6rem 2rem;
  min-height: calc(100vh - 15rem);
  .totalPrice {
    font-size: 1.2rem;

    position: absolute;
    left: 2rem;
    bottom: 1.2rem;
    .totalPriceNum {
      color: #f46600;
      font-size: 2rem;
      font-weight: bold;
      margin: 0 4px;
    }
  }
  .payBtn {
    background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    cursor: pointer;
    box-shadow: 0 1px 10px rgb(0 0 0 / 20%);
    position: absolute;

    text-align: center;
    min-width: 10rem;
    height: 2.8rem;
    color: #fff;
    padding: 0 1rem;
    line-height: 2.8rem;
    border-radius: 2rem;
    transition: all 0.3s ease;
    right: 2rem;
    bottom: 1.5rem;
    &:hover {
      transform: translateY(-0.2rem);
      box-shadow: rgb(38, 57, 77) 0px 20px 20px -10px;
      transition: all 0.3s ease;
    }
  }
  .title {
    text-align: center;
    display: block;
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
  .dtlInfo {
    width: 100%;

    text-align: center;
    display: inline-block;
    margin-bottom: 1.5rem;
    .infoItem {
      display: inline-block;
      margin: 0 1rem 0.5rem 1rem;

      .prop {
        font-size: 0.9rem;
        font-weight: 500;
        display: inline-block;
      }
      .content {
        font-size: 0.8rem;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.7);
        display: inline-block;
        text-decoration: underline;
      }
    }
  }
  .leftIcon {
    font-size: 2.3rem;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.4);
  }
}
img {
  display: block;
  margin: 0 auto;
}
</style>
