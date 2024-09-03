<template>
  <div :class="$style.card">
    <span :class="$style.title">Register</span>
    <!-- <el-form
      ref="ruleFormRef"
      :model="selectedForm"
      :rules="rules"
      label-width="6rem"
      size="large"
    > -->
    <el-form
      :model="selectedForm"
      label-width="6rem"
      size="large"
      :rules="rules"
    >
      <template v-if="selectedForm.role.selected === 1">
        <el-form-item label="Name：" prop="patient_name">
          <el-input v-model="selectedForm.patient_name" />
        </el-form-item>
        <el-form-item label="Gender" prop="gender">
          <el-radio-group v-model="selectedForm.gender.selected">
            <el-radio
              v-for="gender in selectedForm.gender.genderList"
              :label="gender.value"
              :key="gender"
            >
              {{ gender.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Age：" prop="age">
          <el-input v-model="selectedForm.age" />
        </el-form-item>
        <el-form-item label="Address：" prop="address">
          <el-input v-model="selectedForm.address" />
        </el-form-item>
      </template>
      <template v-if="selectedForm.role.selected === 2">
        <el-form-item label="Name：" prop="doc_name">
          <el-input v-model="selectedForm.doc_name" />
        </el-form-item>
        <el-form-item label="Avatar：" prop="avatar">
          <el-input v-model="formModels.doctor.avatar" />
          <el-upload
            action=""
            :class="$style.uploader"
            :http-request="upload"
            :show-file-list="false"
          >
            <img
              v-if="formModels.doctor.avatar"
              :src="formModels.doctor.avatar"
              alt=""
              :class="$style.avatar"
            />
            <el-icon v-else :class="$style.uploaderIcon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="Specialization：" prop="description">
          <el-input v-model="selectedForm.description" />
        </el-form-item>
        <el-form-item label="Title：" prop="title_id">
          <el-select
            v-model="selectedForm.title_id.selected"
            placeholder="Please select your Title"
          >
            <el-option
              v-for="item in selectedForm.title_id.titleList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Department：" prop="dept_id">
          <el-select
            v-model="selectedForm.dept_id.selected"
            placeholder="Please select your Department"
          >
            <el-option
              v-for="item in selectedForm.dept_id.deptList"
              :key="item.dept_id"
              :label="item.dept_name"
              :value="item.dept_id"
            />
          </el-select>
        </el-form-item>
      </template>
      <el-form-item label="email：" prop="email">
        <el-input v-model="selectedForm.email" />
      </el-form-item>
      <el-form-item label="Phone：" prop="phone">
        <el-input v-model="selectedForm.phone" />
      </el-form-item>
      <el-form-item label="Password：" prop="password" type="password">
        <el-input v-model="selectedForm.password" />
      </el-form-item>
      <el-form-item label="Role" prop="role">
        <el-radio-group v-model="selectedForm.role.selected">
          <el-radio
            v-for="role in selectedForm.role.roleList"
            :label="role.value"
            :key="role"
          >
            {{ role.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button
          :class="$style.submitBtn"
          type="primary"
          @click="submitForm(ruleFormRef)"
          >Submit</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted, toRaw } from "vue";
import { ElMessage } from "element-plus";
import cloneDeep from "lodash/cloneDeep";
import api from "../../axios";
import { Plus } from "@element-plus/icons-vue";
import { uploadImg } from "@/axios/partThree";
import { useRouter } from "vue-router";
import { user_register_rule } from "@/rules/LoginReg.js";

const ruleFormRef = ref(null);
const router = useRouter();
const rules = reactive(user_register_rule);

const formModels = {
  patient: reactive({
    address: "",
    patient_name: "",
    email: "",
    gender: {
      genderList: [
        { value: 1, name: "Female" },
        { value: 0, name: "Male" },
      ],
      selected: 1,
    },
    phone: null,
    age: null,
    password: "",
    role: {
      roleList: [
        { value: 1, name: "patient" },
        { value: 2, name: "doctor" },
        { value: 3, name: "Admin" },
      ],
      selected: 1,
    },
  }),
  doctor: reactive({
    doc_name: "",
    avatar: "",
    description: "",
    email: "",

    title_id: {
      titleList: [
        { value: 1, name: "Consultant" },
        { value: 2, name: "Fellow" },
        { value: 3, name: "Resident" },
        { value: 4, name: "Attending Physician" },
      ],
      selected: null,
    },
    dept_id: {
      deptList: [],
      selected: null,
    },
    phone: null,
    password: "",
    role: {
      roleList: [
        { value: 1, name: "patient" },
        { value: 2, name: "doctor" },
        { value: 3, name: "Admin" },
      ],
      selected: 2,
    },
  }),
  admin: reactive({
    email: "",
    phone: "",
    password: "",
    role: {
      roleList: [
        { value: 1, name: "patient" },
        { value: 2, name: "doctor" },
        { value: 3, name: "Admin" },
      ],
      selected: 3,
    },
  }),
};

const selectedForm = ref(formModels.patient);
onMounted(async () => {
  await getAllDept();
});
watch(
  () => selectedForm.value.role.selected,
  (newRole, oldRole) => {
    if (newRole !== oldRole) {
      switch (newRole) {
        case 1:
          selectedForm.value = cloneDeep(formModels.patient);
          break;

        case 2:
          selectedForm.value = cloneDeep(formModels.doctor);
          break;

        case 3:
          selectedForm.value = cloneDeep(formModels.admin);
          break;

        default:
          break;
      }
    }
  },
  { immediate: true }
);

const upload = async ({ file }) => {
  const res = await uploadImg(file);
  console.log(res);

  switch (res.data.code) {
    case "success":
      formModels.doctor.avatar = res.data.data.url;

      break;
    case "image_repeated":
      formModels.doctor.avatar = res.data.images;
      break;
    default:
      ElMessage.error("Upload failed");
      break;
  }
};
const getAllDept = async () => {
  try {
    const { status, message, result } = await api.getAllDeptList();

    if (status === 0) {
      formModels.doctor.dept_id.deptList.push(...result);
    } else {
      ElMessage.error(message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
};
const submitForm = async () => {
  try {
    let result;

    let formData = toRaw(selectedForm.value);

    let { password, phone, email } = formData;
    console.log(formData);
    switch (selectedForm.value.role.selected) {
      case 1:
        delete formData.role;
        formData.gender = formData.gender.selected;

        let { patient_name, gender, age, address } = formData;
        result = await api.registerPatient(
          patient_name,
          password,
          phone,
          email,
          gender,
          age,
          address
        );
        break;
      case 2:
        delete formData.role;
        formData.title_id = formData.title_id.selected;
        formData.dept_id = formData.dept_id.selected;
        formData.avatar = formModels.doctor.avatar;
        let { doc_name, title_id, dept_id, avatar, description } = formData;
        result = await api.registerDoctor(
          doc_name,
          password,
          phone,
          email,
          title_id,
          dept_id,
          avatar,
          description
        );
        break;
      case 3:
        delete formData.role;
        result = await api.registerAdmin(password, phone, email);
        break;
      default:
        ElMessage.error("Role Unselected");

        return;
    }

    if (result.status === 0) {
      ElMessage.success(
        result.message + " You are being redirected to the login screen..."
      );

      router.push({ name: "Login" });
    }
  } catch (err) {
    console.log(err);

    ElMessage.error(err);
  }
};
</script>

<style src="@/style/userCard.less" module lang="less"></style>
