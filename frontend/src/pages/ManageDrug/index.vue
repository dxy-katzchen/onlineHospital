<template>
  <div :class="$style.drugManage">
    <div :class="$style.drugList">
      <i
        class="iconfont icon-zuojiantou_huaban"
        @click="router.back(-1)"
        :class="$style.leftIcon"
      ></i>
      <span :class="$style.drugTitle"> Drug List </span>
      <el-table :data="filterDrugList" border max-height="600">
        <el-table-column prop="drug_name" label="Drug name" align="center" />
        <el-table-column prop="usage" label="Usage" />
        <el-table-column prop="cure" label="Treatments" />
        <el-table-column
          prop="single_price"
          label="Unit Price"
          width="100"
          align="center"
        />

        <el-table-column align="center">
          <template #header>
            <el-input v-model="search" placeholder="Search for drug name" />
          </template>
          <template #default="scope">
            <el-button
              type="danger"
              @click="deleteDrug(scope.$index, scope.row)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div :class="$style.addDrugBtn" @click="addDiaogVisible = true">
    Add drugs
  </div>
  <el-dialog v-model="addDiaogVisible" title="Add drugs" style="padding: 3rem">
    <el-form :model="drugForm">
      <el-form-item label="Drug name">
        <el-input v-model="drugForm.drug_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Usage">
        <el-input v-model="drugForm.usage" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Treatments">
        <el-input v-model="drugForm.cure" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Unit price">
        <el-input-number v-model="drugForm.single_price" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="addDiaogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addDrug"> Submit </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import api from "@/axios";
import { ElMessage } from "element-plus";
// import { Delete } from "@element-plus/icons-vue";
const router = useRouter();

const addDiaogVisible = ref(false);
const drugForm = reactive({
  drug_name: "",
  usage: "",
  cure: "",
  single_price: 0,
});
const DrugList = ref([]);
const search = ref("");
const filterDrugList = computed(() =>
  DrugList.value.filter(
    (data) =>
      !search.value ||
      data.drug_name.toLowerCase().includes(search.value.toLowerCase())
  )
);
onMounted(async () => {
  await getDrugList();
});
const addDrug = async () => {
  let { drug_name, usage, cure, single_price } = drugForm;
  try {
    let { status, message } = await api.addDrug(
      drug_name,
      usage,
      cure,
      single_price
    );
    if (status === 0) {
      ElMessage.success("Successful addition of drugs!");
      addDiaogVisible.value = false;
      await getDrugList();
    } else {
      ElMessage.error("Failure to add drugs", message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
};
const deleteDrug = async (index, row) => {
  try {
    let { status, message } = await api.deleteDrug(row.drug_name);
    if (status === 0) {
      ElMessage.success("Deleted successfully!");
      await getDrugList();
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
.addDrugBtn {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  width: 8rem;
  height: 3rem;
  border-radius: 2rem;
  z-index: 999;
  line-height: 3rem;
  text-align: center;
  background: blueviolet;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #8106ab;
    transition: all 0.2s;
  }
}
.drugManage {
  display: flex;
  justify-content: center;
  width: calc(90vw - 13rem);
  margin: 2rem auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  border-radius: 2rem;
  padding: 1.5rem 2rem;
  .drugTitle {
    display: block;
    text-align: center;
    font-weight: 600;
    font-size: 1.6rem;
    margin: 0 auto 1.5rem auto;
  }
  .drugList {
    flex: 1 1 auto;
    .leftIcon {
      font-size: 2.3rem;
      cursor: pointer;
      //   position: absolute;
      left: 15rem;
      top: 4.5rem;
      color: rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
