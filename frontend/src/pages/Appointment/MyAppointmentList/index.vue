<template>
  <div :class="$style.content">
    <el-form :inline="true" :model="queryForm" :class="$style.query">
      <el-form-item>
        <el-input
          v-model.trim.number="queryForm.doc_name"
          placeholder="doctor name"
          @blur="query"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="queryForm.patient_name"
          placeholder="patient name"
          @blur="query"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="queryForm.dept_name"
          placeholder="Department"
          @blur="query"
        />
      </el-form-item>

      <el-form-item label="Status">
        <el-select
          v-model="queryForm.status"
          placeholder="Status"
          @change="query"
        >
          <el-option label="Finished" value="Finished" />
          <el-option
            label="Awaiting Consultation"
            value="Awaiting Consultation"
          />
          <el-option
            label="Awaiting medical records"
            value="Awaiting medical records"
          />
          <el-option
            label="Awaiting Prescription"
            value="Awaiting Prescription"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Consultation Type">
        <el-select
          v-model="queryForm.consult_type"
          placeholder="Consultation Type"
          @change="query"
        >
          <el-option label="Chat Consultation" :value="0" />
          <el-option label="Video Consultation" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="reset">Reset</el-button>
      </el-form-item>
    </el-form>
    <div :class="$style.tableCard">
      <el-table :data="pageRef" size="small">
        <el-table-column align="center" prop="appt_id" label="id" width="50" />
        <el-table-column
          align="center"
          prop="doc_name"
          label="Doctor name"
          width="100"
        />
        <el-table-column
          align="center"
          prop="title_name"
          label="Doctor Title"
        />
        <el-table-column
          align="center"
          prop="patient_name"
          label="Patient name"
          width="100"
        />
        <el-table-column
          align="center"
          prop="dept_name"
          label="Department"
          width="100"
        />
        <el-table-column
          align="center"
          prop="time"
          width="170"
          label="Creation time"
        />
        <el-table-column
          align="center"
          prop="fee"
          label="Appointment Fee"
          width="80"
        />
        <el-table-column
          align="center"
          prop="desc"
          width="140"
          label="Description of illness"
          show-overflow-tooltip
        />

        <el-table-column align="center" prop="canceled" label="Canceled">
          <template #default="scope">
            <el-tag
              size="small"
              effect="dark"
              :type="scope.row.canceled === 0 ? 'success' : 'danger'"
              >{{ scope.row.canceled === 0 ? "N" : "Y" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column align="center" prop="finished" label="Status">
          <template #default="scope">
            <el-tag
              size="small"
              :type="
                scope.row.finished || scope.row.status === 'Finished'
                  ? 'info'
                  : 'success'
              "
            >
              {{ scope.row.finished ? "Finished" : scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="consult_type"
          label="Consultation Type"
        >
          <template #default="scope">
            <div
              :class="$style.typeTag"
              :style="{
                background: `${
                  scope.row.consult_type === 0 ? '#951db9' : '#1dbcb6'
                }`,
              }"
            >
              {{ scope.row.consult_type === 0 ? "Chat" : "Video" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" v-if="role === 1 || role === 2">
          <template #header> View </template>
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              plain
              @click="getDetail(scope.$index, scope.row)"
              >Details</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        background
        :class="$style.pagination"
        layout="sizes, prev, pager, next"
        :total="totalNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <el-dialog
    v-model="is_visible"
    title="Consultation information"
    width="50%"
    align-center
  >
    <el-descriptions :column="2" style="margin: 10px 50px">
      <el-descriptions-item label="Appoinement id" width="300">
        {{ detailData.appt_id }}
      </el-descriptions-item>
      <el-descriptions-item label="Appointment Time" width="300">
        {{ detailData.time }}
      </el-descriptions-item>
      <el-descriptions-item label="doctor name">
        {{ detailData.doc_name }}
      </el-descriptions-item>
      <el-descriptions-item label="doctor id">
        {{ detailData.doc_id }}
      </el-descriptions-item>
      <el-descriptions-item label="patient name">
        {{ detailData.patient_name }}
      </el-descriptions-item>
      <el-descriptions-item label="patient id">
        {{ detailData.patient_id }}
      </el-descriptions-item>
      <el-descriptions-item label="Doctor Title">
        {{ detailData.title_name }}
      </el-descriptions-item>
      <el-descriptions-item label="Department">
        {{ detailData.dept_name }}
      </el-descriptions-item>
      <el-descriptions-item label="Appointment Fee">
        {{ detailData.fee }}$
      </el-descriptions-item>
      <el-descriptions-item label="Status">
        <el-tag :type="detailData.status === 'Finished' ? 'info' : ''">
          {{ detailData.status }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Consultation Type">
        <el-tag
          :color="detailData.consult_type === 0 ? '#951db9' : '#1dbcb6'"
          effect="dark"
        >
          {{
            detailData.consult_type === 0
              ? "Chat Consultation"
              : "Video Consultation"
          }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Canceled">
        <el-tag :type="detailData.canceled ? 'info' : 'success'" effect="dark">
          {{ detailData.canceled === 1 ? "Y" : "N" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Medical History">
        <el-tag type="info" v-if="!detailData.med_hist_id && role === 1">
          not available
        </el-tag>
        <el-tag
          type="warning"
          v-if="!detailData.med_hist_id && role === 2"
          style="cursor: pointer"
          @click="addMedicalHistory"
        >
          Fill
        </el-tag>
        <el-tag
          type="success"
          v-if="detailData.med_hist_id"
          style="cursor: pointer"
          @click="viewMedicalHistory"
        >
          Details
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Prescription">
        <el-tag type="info" v-if="!detailData.ps_id && role === 1">
          not available
        </el-tag>
        <el-tag
          type="warning"
          v-if="!detailData.ps_id && role === 2"
          style="cursor: pointer"
          @click="addPs"
        >
          Fill
        </el-tag>
        <el-tag
          type="success"
          v-if="detailData.ps_id"
          @click="viewPs"
          style="cursor: pointer"
        >
          Details
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Consultation">
        <el-tag type="success" style="cursor: pointer" @click="viewConsult">
          Details
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Description of illness">
        {{ detailData.desc }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import api from "@/axios";
import { useInfoStore, useAppointmentStore } from "@/store";
import { useRouter } from "vue-router";
const currentPage = ref(1);
const pageSize = ref(10);
const totalNumber = ref(0);

const userInfo = useInfoStore();
const appointmentStore = useAppointmentStore();
const router = useRouter();
const is_visible = ref(false);
const queryForm = reactive({
  doc_name: "",
  patient_name: "",
  dept_name: "",
  status: "",
  consult_type: null,
});
const detailData = reactive({
  appt_id: null,
  doc_name: "",
  doc_id: null,
  patient_name: "",
  patient_id: null,
  time: "",
});
const role = ref(userInfo.user.role);

const dataRef = ref();
const pageRef = ref();
onMounted(async () => {
  await query();
});
watch(is_visible, async (newval) => {
  if (!newval) {
    await query();
  }
});
const addMedicalHistory = async () => {
  const { appt_id } = detailData;
  router.push({ name: "AddMedicalHistory", query: { appt_id } });
};
const addPs = async () => {
  const { appt_id } = detailData;
  router.push({ name: "CreatePs", query: { appt_id } });
};

const viewPs = async () => {
  const { appt_id } = detailData;
  router.push({ name: "ViewPs", query: { appt_id } });
};
const viewConsult = async () => {
  const { appt_id, consult_type } = detailData;
  appointmentStore.appt_id = appt_id;
  consult_type === 0
    ? router.push({ name: "TextConsultation" })
    : router.push({ name: "VideoChat" });
};
const viewMedicalHistory = async () => {
  const { med_hist_id } = detailData;
  router.push({
    name: "ViewMedicalHistory",
    query: { med_hist_id },
  });
};
const getDetail = async (_, row) => {
  is_visible.value = true;
  Object.assign(detailData, row);
  console.log(detailData);
};
const reset = () => {
  const originObj = {
    doc_name: "",
    patient_name: "",
    dept_name: "",
    status: "",
    consult_type: null,
  };
  Object.assign(queryForm, originObj);
};

const query = async () => {
  try {
    let { doc_name, patient_name, dept_name, consult_type, status } = queryForm;
    let {
      data,
      status: status1,
      message,
    } = await api.getAppointmentList(
      doc_name,
      patient_name,
      dept_name,
      consult_type,
      status
    );

    if (status1 === 0) {
      data = data.map((item) => {
        item.finished =
          item.canceled || (item.med_hist_id && item.ps_id) ? true : false;

        return item;
      });
      dataRef.value = data;
      totalNumber.value = data.length;
      pageList();
      return;
    }
    ElMessage.error(message);
  } catch (error) {
    console.error(error);
    ElMessage.error(error);
  }
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  pageList();
};
const handleCurrentChange = async (val) => {
  currentPage.value = val;
  pageList();
};
const pageList = async () => {
  pageRef.value = dataRef.value.filter(
    (_, index) =>
      index < currentPage.value * pageSize.value &&
      index >= pageSize.value * (currentPage.value - 1)
  );
};
watch(queryForm, async () => {
  await query();
});
</script>

<style module lang="less">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
  height: calc(
    100vh - 3.5rem
  ); // Make the content height 100% of the viewport height

  .query {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    background-color: #fff;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-radius: 0.8rem;
    background-color: #faecfd;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    > * {
      margin: 0 20px 0 0;
    }
    > :nth-child(4) {
      flex: 0 1 12rem;
    }
    > :nth-child(5) {
      flex: 0 1 12rem;
    }
    > :last-child {
      margin-right: 0;
    }
  }

  .tableCard {
    background-color: #fff;
    overflow: auto; // Allow the table to scroll if the content exceeds the container height
    padding: 1rem 0;
    margin: 1rem 0;
    width: 100%;
    box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.3);
    border-radius: 1rem;
    flex-grow: 1; // Make the tableCard grow and fill the remaining space
    display: flex;
    flex-direction: column;

    .typeTag {
      color: #fff;
      font-size: 0.7rem;
      height: 22px;
      line-height: 22px;
      border-radius: 20px;
      padding: 0 7px;
      width: 3.1rem;
      margin: 0 auto;
    }

    .pagination {
      margin: 1rem auto 0 auto;
      display: flex;
      width: 50%;
      min-width: 500px;
      justify-content: center;
      background-color: #faecfd;
      border-radius: 2rem;
      height: 3.5rem;
    }
  }
}
</style>

<style lang="less">
.el-table__body tr:hover > td {
  background-color: #faecfd !important;
  cursor: pointer;
  color: blueviolet;
}
</style>
