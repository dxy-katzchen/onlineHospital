<template>
  <div>
    <el-table
      stripe
      border
      :data="dataRef"
      @expand-change="loadDoctorList"
      row-key="dept_id"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template #default="props">
          <el-table size="small" :data="props.row.doctorList">
            <el-table-column label="Avatar" width="160" align="center">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <img
                    :class="$style.avatar"
                    :src="scope.row.avatar"
                    alt=""
                    srcset=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="doctor id"
              prop="doc_id"
              width="80"
              align="center"
            />
            <el-table-column
              label="doctor name"
              prop="doc_name"
              width="100"
              align="center"
            />
            <el-table-column
              label="Title"
              prop="title_name"
              width="100"
              align="center"
            />
            <el-table-column
              label="Specialization"
              show-overflow-tooltip
              align="center"
              prop="description"
            />
            <el-table-column
              label="Phone"
              prop="phone"
              align="center"
              width="100"
            />
            <el-table-column
              label="Email"
              prop="email"
              width="200"
              align="center"
            />
            <el-table-column
              label="Remaining Reservations"
              prop="doc_spare"
              align="center"
              width="80"
            />
            <el-table-column label="Opeartion" width="150" align="center">
              <template #default="scope">
                <el-button
                  size="small"
                  type="primary"
                  @click="openAppointmentDialog(_, scope.row)"
                >
                  Make Appointment
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="dept_id"
        align="center"
        label="Department id"
        width="100"
      />
      <el-table-column
        prop="dept_name"
        align="center"
        label="Department name"
      />
      <el-table-column prop="dept_desc" label="Department description" />
      <el-table-column
        prop="dept_spare"
        align="center"
        label="Remaining Reservations"
        width="140"
      />
      <el-table-column
        prop="doc_number"
        align="center"
        label="doctor number"
        width="140"
      />
    </el-table>
    <el-pagination
      v-model:currentPage="currentPage"
      background
      :class="$style.pagination"
      layout="prev, pager, next,jumper"
      :total="totalNumber"
      @current-change="handlePagChange"
    />
    <el-dialog v-model="dialogFormVisible" title="Make an appoinement">
      <el-form :model="applicationForm">
        <el-form-item label="Symptom" :label-width="formLabelWidth">
          <el-input
            v-model="applicationForm.desc"
            autocomplete="off"
            placeholder="Please briefly describe your symptoms"
          />
        </el-form-item>
        <el-form-item label="Consultation type" :label-width="formLabelWidth">
          <el-select
            v-model="applicationForm.consult_type"
            placeholder="Please select the type of consultation"
          >
            <el-option label="Chat Consultation" :value="0" />
            <el-option label="Video Consultation" :value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addAppointment"> Submit </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import api from "@/axios";

import { ElMessage } from "element-plus";
const dataRef = ref();
const totalNumber = ref(0);
const currentPage = ref(1);
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";

const applicationForm = reactive({
  doc_id: null,
  desc: "",
  consult_type: 0,
});

onMounted(async () => {
  await getDeptList();
});
const handlePagChange = async () => {
  await getDeptList();
};
const addAppointment = async () => {
  const { doc_id, desc, consult_type } = applicationForm;
  try {
    const { status, message, appt_number } = await api.addAppointment(
      doc_id,
      desc,
      consult_type
    );
    if (status !== 0) {
      ElMessage.error(message);
      return;
    }
    ElMessage.success(message);
    if (consult_type === 1) {
      await addConsultation(appt_number);
    }
  } catch (error) {
    ElMessage.error(error);
  }

  dialogFormVisible.value = false;
};
const addConsultation = async (appt_id) => {
  const { status, message } = await api.addConsultation(appt_id);
  if (status !== 0) {
    ElMessage.error(message);
    return;
  }
  ElMessage.success(message);
};
const openAppointmentDialog = (_, row) => {
  applicationForm.doc_id = row.doc_id;
  dialogFormVisible.value = true;
};
const loadDoctorList = async (row) => {
  try {
    let { result, status, message } = await api.getDoctorList(row.dept_id);
    if (status !== 0) {
      ElMessage.error(message);
      return;
    }
    row.doctorList = result;
  } catch (error) {
    ElMessage.error(error);
  }
};
const getDeptList = async () => {
  try {
    let { status, message, result, total } = await api.getDeptList(
      currentPage.value
    );

    if (status !== 0) {
      ElMessage.error(message);
      return;
    }
    totalNumber.value = total;

    dataRef.value = result.map((item) => {
      item.doctorList = [];
      return item;
    });
  } catch (error) {
    ElMessage.error(error);
  }
};
</script>

<style module lang="less">
.avatar {
  border-radius: 0.5rem;
  width: 100px;
  height: 130px;
  object-fit: cover;
  margin: 0.2rem auto;
}
.pagination {
  margin: 2rem auto;
  display: flex;
  justify-content: center;
}
</style>
