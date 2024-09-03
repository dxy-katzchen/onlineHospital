<template>
  <BackGround>
    <div :class="$style.topBar">
      <i
        class="iconfont icon-zuojiantou_huaban"
        @click="router.back(-1)"
        :class="$style.leftIcon"
      ></i>
    </div>
    <div :class="$style.myInfo">
      <span :class="$style.title"> My Info </span>

      <el-form
        ref="infoFormRef"
        :model="form"
        label-width="5rem"
        :class="$style.form"
      >
        <table :class="$style.table">
          <tr>
            <td rowspan="8">
              <div :class="$style.td">
                <el-upload
                  action=""
                  v-if="form.role !== 3"
                  :class="$style.uploader"
                  :http-request="upload"
                  :show-file-list="false"
                >
                  <img
                    v-if="form.avatar"
                    :src="form.avatar"
                    alt=""
                    :class="$style.avatar"
                  />
                  <el-icon v-else :class="$style.uploaderIcon"
                    ><Plus
                  /></el-icon>
                </el-upload>
                <img
                  v-else
                  :src="userAdministrator"
                  alt=""
                  :class="$style.avatar"
                />
                <div :class="$style.role" :style="roleColor">
                  {{
                    form.role === 1
                      ? "Patient"
                      : form.role === 2
                      ? "Doctor"
                      : "Administrator"
                  }}
                </div>
              </div>
            </td>

            <td :class="$style.tableInput">
              <el-form-item label="Phone:">
                <el-input v-model="form.phone" disabled />
              </el-form-item>
            </td>
          </tr>
          <tr v-if="form.role !== 3">
            <td :class="$style.tableInput">
              <el-form-item label="Name:">
                <el-input
                  :value="form.role === 1 ? form.patient_name : form.doc_name"
                  disabled
                />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td :class="$style.tableInput">
              <el-form-item label="Gender:">
                <el-input
                  :value="form.gender === 1 ? 'Female' : 'Male'"
                  disabled
                />
              </el-form-item>
            </td>
          </tr>
          <tr v-if="form.role === 1">
            <td :class="$style.tableInput">
              <el-form-item label="Age:">
                <el-input :value="form.age" disabled />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td :class="$style.tableInput">
              <el-form-item label="Email:">
                <el-input v-model="form.email" disabled />
              </el-form-item>
            </td>
          </tr>
          <tr v-if="form.role === 2">
            <td :class="$style.tableInput">
              <el-form-item label="Department:">
                <el-input v-model="form.dept_name" disabled />
              </el-form-item>
            </td>
          </tr>
          <tr v-if="form.role === 2">
            <td :class="$style.tableInput">
              <el-form-item label="Title:">
                <el-input v-model="form.title_name" disabled />
              </el-form-item>
            </td>
          </tr>
          <tr v-if="form.role === 2">
            <td :class="$style.tableInput">
              <el-form-item label="Description:">
                <el-input v-model="form.description" disabled />
              </el-form-item>
            </td>
          </tr>

          <tr v-if="form.role === 1">
            <td :class="$style.tableInput">
              <el-form-item label="Address:">
                <el-input :value="form.address" disabled />
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
  </BackGround>
</template>

<script setup>
import userAdministrator from "@/assets/admin.svg";
import { ref, reactive, computed, onMounted } from "vue";
import { useInfoStore } from "@/store";

import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

import { useRouter } from "vue-router";
import BackGround from "./BackGround.vue";
import api from "@/axios";
import { uploadImg } from "@/axios/partThree";

const router = useRouter();
const userInfo = useInfoStore();

const infoFormRef = ref(null);

const form = reactive({});
onMounted(() => {
  console.log(userInfo.user);

  Object.assign(form, userInfo.user);
});

const upload = async ({ file }) => {
  const res = await uploadImg(file);
  switch (res.data.code) {
    case "success":
      form.avatar = res.data.data.url;
      await changeInfo(infoFormRef.value);
      break;
    case "image_repeated":
      form.avatar = res.data.images;
      await changeInfo(infoFormRef.value);
      break;
    default:
      ElMessage.error("Upload failed");
      break;
  }
};
const changeInfo = async () => {
  try {
    let data =
      form.role === 1
        ? await api.updatePatientAvatar(form.patient_id, form.avatar)
        : await api.updateDoctorAvatar(form.doc_id, form.avatar);

    if (data.status == 0) {
      Object.assign(userInfo.user, form);
      ElMessage.success(data.message);
    } else {
      ElMessage.warning(data.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
};

const roleColor = computed(() => ({
  background:
    form.role === 1 ? "#c44ae3" : form.role === 2 ? "#8c00be" : "#7e0681",
}));
</script>

<style module lang="less">
.topBar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 3.5rem;
  padding: 0 2rem;
  box-sizing: border-box;

  line-height: 3.5rem;
  display: flex;

  color: #fff;
  .leftIcon {
    font-size: 2rem;
    cursor: pointer;
  }
}
.myInfo {
  width: 60%;
  padding: 8rem 0 2rem 0;
  text-align: center;
  .title {
    font-size: 2rem;
  }
  .form {
    margin-top: 4rem;

    .table {
      width: 100%;
      .td {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .uploader {
        width: 178px;
        height: 178px;
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
        &:hover {
          border-color: #866dd8;
        }
      }
      .role {
        height: 1.7rem;
        padding: 0 1rem;
        line-height: 1.7rem;
        text-align: center;
        color: #fff;
        margin-top: 1rem;
        border-radius: 0.5rem;
        font-size: 0.8rem;
      }
      .uploaderIcon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
      }
      .tableInput {
        padding: 0.2rem 4rem 0.2rem 2rem;
        box-sizing: border-box;
        width: 80%;
        .myPageBtn {
          background-color: #7e0681;
          width: 6rem;
          margin-left: 0.5rem;
          cursor: pointer;
          height: 2.2rem;
          border-radius: 0.8rem;
          color: #fff;
          border: 0;
        }
      }
      .avatar {
        display: block;
        width: 178px;
        height: 178px;
        object-fit: cover;
      }
    }
  }
}
</style>
