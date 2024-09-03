<template>
  <div :class="$style.card">
    <span :class="$style.title">Log in</span>
    <el-form
      ref="ruleFormRef"
      :model="form"
      :rules="rules"
      label-width="6rem"
      size="large"
    >
      <el-form-item label="Account：" prop="id">
        <el-input
          v-model="form.id"
          placeholder="Please enter your email or cell phone number"
        />
      </el-form-item>
      <el-form-item label="Password：" prop="password">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-form-item label="Role" prop="role">
        <el-radio-group v-model="form.role.selected">
          <el-radio
            v-for="role in form.role.roleList"
            :label="role.value"
            :key="role.value"
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
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import jwt_decode from "jwt-decode";
import api from "../../axios";
import { useInfoStore } from "../../store";
import { user_login_rule } from "@/rules/LoginReg.js";

import { useRouter } from "vue-router";

const router = useRouter();

const ruleFormRef = ref(null);

const form = reactive({
  id: "",
  password: "",
  role: {
    roleList: [
      { value: 1, name: "patient" },
      { value: 2, name: "doctor" },
      { value: 3, name: "Admin" },
    ],
    //默认学生
    selected: 1,
  },
});

const userInfo = useInfoStore();

const rules = reactive(user_login_rule);

const submitForm = async (formEl) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    const res =
      form.role.selected === 1
        ? await api.loginPatient(form.id, form.password)
        : form.role.selected === 2
        ? await api.loginDoctor(form.id, form.password)
        : await api.loginAdmin(form.id, form.password);

    if (res.status === 0) {
      userInfo.token = res.token;

      userInfo.user = jwt_decode(res.token);

      ElMessage.success(res.message);

      router.replace({ name: "Index" });
    }
  } catch (err) {
    ElMessage.error(err);
  }
};
</script>

<style src="@/style/userCard.less" module lang="less"></style>
