<template>
  <div :class="$style.content">
    <div :class="$style.tableCard">
      <el-table :data="pageRef" size="small">
        <el-table-column align="center" prop="ps_id" label="prescription id" />

        <el-table-column align="center" prop="doc_id" label="doctor id" />

        <el-table-column align="center" prop="patient_id" label="patient id" />
        <el-table-column
          align="center"
          prop="create_time"
          label="Creation time"
        />
        <el-table-column align="center">
          <template #header> Whether paid </template>
          <template #default="scope">
            <span v-if="scope.row.paid === 0">No</span>
            <span v-else-if="scope.row.paid === 1">Yes</span>
          </template>
        </el-table-column>

        <el-table-column align="center" v-if="role === 1 || role === 2">
          <template #header> view </template>
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              plain
              @click="viewPs(scope.$index, scope.row)"
              >details</el-button
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import api from "@/axios";
import { useInfoStore } from "@/store";
import { useRouter } from "vue-router";

const currentPage = ref(1);
const pageSize = ref(20);
const totalNumber = ref(0);
const userInfo = useInfoStore();
const router = useRouter();

const role = ref(userInfo.user.role);

const dataRef = ref();
const pageRef = ref();
onMounted(async () => {
  await getMyPsList();
});
const getMyPsList = async () => {
  try {
    const { status, message, data } = await api.getMyPsList();

    if (status !== 0) {
      ElMessage.error(message);
      return;
    }
    dataRef.value = data;

    totalNumber.value = data.length;
    pageList();
  } catch (error) {
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
const viewPs = async (_, row) => {
  const { ps_id } = row;

  router.push({
    name: "ViewPs",
    query: { ps_id },
  });
};
</script>

<style module lang="less">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  .tableCard {
    background-color: #fff;
    overflow: hidden;
    padding: 1rem 0;
    margin: 0;
    width: 100%;
    box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.3);
    border-radius: 2rem;

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
