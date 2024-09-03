<template>
  <div :class="$style.ps">
    <div :class="$style.drugList">
      <i
        class="iconfont icon-zuojiantou_huaban"
        @click="router.back(-1)"
        :class="$style.leftIcon"
      ></i>
      <span :class="$style.drugTitle"> Drug List </span>
      <el-table :data="filterDrugList" border max-height="500">
        <el-table-column prop="drug_name" label="drug name" align="center" />
        <el-table-column prop="usage" label="usage" />
        <el-table-column prop="cure" label="treatments" />
        <el-table-column
          prop="single_price"
          label="unit price"
          width="100"
          align="center"
        />
        <el-table-column label="quantity" align="center">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.quantity"
              :step="1"
              :min="1"
              step-strictly
            />
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template #header>
            <el-input v-model="search" placeholder="Search for drug name" />
          </template>
          <template #default="scope">
            <el-button
              @click="addDrugToPs(scope.$index, scope.row)"
              type="success"
              :disabled="scope.row.added"
              >Add</el-button
            >
            <el-button
              @click="addDrugToPs(scope.$index, scope.row)"
              type="warning"
              :disabled="!scope.row.added"
              >Update</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div :class="$style.psList">
    <span :class="$style.psTitle"> prescription </span>

    <el-table :data="psDrugList" max-height="200" size="small">
      <el-table-column prop="drug_name" label="Drug name" align="center" />
      <el-table-column prop="quantity" label="Quantity" align="center" />
      <el-table-column prop="price" label="Subtotal" align="center" />
      <el-table-column label="Operation" align="center">
        <template #default="scope">
          <el-button
            size="small"
            type="danger"
            :icon="Delete"
            circle
            @click="delDrugPs(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { Delete } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/axios";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const Ps_id = ref(4);
const DrugList = ref([]);
const psDrugList = ref([]);

const { appt_id } = route.query;
const search = ref("");
const filterDrugList = computed(() =>
  DrugList.value.filter(
    (data) =>
      !search.value ||
      data.drug_name.toLowerCase().includes(search.value.toLowerCase())
  )
);

onMounted(async () => {
  await createPs();
  await getDrugList();
  await getPsDrugList();
});
const createPs = async () => {
  try {
    const { ps_id, status, message } = await api.createPs(appt_id);

    if (status === 0) {
      ElMessage.success(message);
      Ps_id.value = ps_id;
      return;
    }
    ElMessage.error(message);
  } catch (error) {
    ElMessage.error(error);
  }
};
const submit = () => {
  ElMessage.success("Submitted successfully!");
  router.back(-1);
};
const delDrugPs = async (_, row) => {
  try {
    const { status, message } = await api.deleteDrugPs(
      Ps_id.value,
      row.drug_name
    );
    if (status === 0) {
      ElMessage.success(message);
      await getPsDrugList();
      return;
    }
    ElMessage.error(message);
  } catch (error) {
    ElMessage.error(error);
  }
};
const addDrugToPs = async (_, row) => {
  row.added = true;
  try {
    const { status, message } = await api.addDrugToPs(
      Ps_id.value,
      row.drug_name,
      row.quantity
    );
    if (status === 0) {
      ElMessage.success(message);
      await getPsDrugList();
      return;
    }
    ElMessage.error(message);
  } catch (error) {
    ElMessage.error(error);
  }
};
const getPsDrugList = async () => {
  try {
    const { drugList, status, message } = await api.getPsDetail(Ps_id.value);
    if (status === 0) {
      psDrugList.value = drugList;
      return;
    }
    ElMessage.error(message);
  } catch (error) {
    ElMessage.error(error);
  }
};
const getDrugList = async () => {
  try {
    const { data, status, message } = await api.getDrugList();
    if (status === 0) {
      data.forEach((e) => {
        e.quantity = 1;
        e.added = false;
      });

      DrugList.value = data;
      return;
    }
    ElMessage.error(message);
  } catch (error) {
    ElMessage.error(error);
  }
};
</script>

<style module lang="less">
.ps {
  display: flex;
  justify-content: center;
  width: calc(90vw - 13rem);
  margin: 0 auto;

  .drugList {
    flex: 1 1 auto;
    .leftIcon {
      font-size: 2.3rem;
      cursor: pointer;
      position: absolute;
      left: 15rem;
      top: 4.5rem;
      color: rgba(0, 0, 0, 0.4);
    }
  }
  .drugTitle {
    display: block;
    text-align: center;
    font-weight: 500;
    font-size: 1.4rem;
    margin: 1rem auto;
  }
}
.psList {
  position: fixed;
  bottom: 0;
  z-index: 999;
  width: calc(100vw - 13rem);
  // background: rgb(227, 233, 246);
  border-radius: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  background: #fff;
  .psTitle {
    display: block;
    text-align: center;
    font-weight: 500;
    font-size: 1.2rem;
    margin: 1rem auto 0 auto;
  }
}
</style>
