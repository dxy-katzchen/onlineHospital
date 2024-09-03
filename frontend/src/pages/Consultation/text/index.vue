<template>
  <div>
    <div :class="$style.textImgConsult">
      <ul>
        <li
          v-for="msg in messages"
          :key="msg"
          :class="msg.role === role ? $style.myMessage : $style.otherMessage"
        >
          <div :class="$style.header">
            <span :class="$style.userName">{{
              (msg.role === 1 ? "patient " : "doctor ") + msg.userName
            }}</span>
            <span :class="$style.time">{{ msg.time }}</span>
          </div>
          <div :class="$style.messageContainer">
            <img
              :src="msg.role === 1 ? userImg : doctorImg"
              alt="avatar"
              :class="$style.avatar"
            />
            <div :class="$style.messageBubble">
              <img
                v-if="isImageUrl(msg.content)"
                :src="msg.content"
                :class="$style.imageStyle"
                alt="Uploaded image"
              />
              <span v-else>{{ msg.content }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <form @submit.prevent="sendMessage" :class="$style.inputForm">
    <input v-model="message" @keydown="handleKeyDown" />
    <input
      type="file"
      @change="handleFileUpload"
      multiple
      accept="image/*"
      :class="$style.hiddenFileInput"
      ref="fileInput"
    />
    <button @click="$refs.fileInput.click()" :class="$style.uploadBtn">
      Upload Image
    </button>

    <button type="submit" @click="sendMessage">Send</button>
  </form>
</template>

<script setup>
import { ref, onMounted, onUpdated, nextTick, onBeforeUnmount } from "vue";
import userImg from "../../../assets/user.png";
import doctorImg from "../../../assets/doctor.png";

import Upload from "@/Hooks/UploadImg.js";
import io from "socket.io-client";
import moment from "moment";
import api from "@/axios";
import { useInfoStore, useAppointmentStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();

const userInfo = useInfoStore();
const appointmentStore = useAppointmentStore();
const appt_id = appointmentStore.appt_id;
const messages = ref([]);
const message = ref("");
const { role } = userInfo.user;
let userName =
  userInfo.user.role === 1
    ? userInfo.user.patient_name
    : userInfo.user.doc_name;

const scrollToBottom = () => {
  nextTick(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
};
onUpdated(() => {
  scrollToBottom();
});
onMounted(async () => {
  if (role === 3) {
    router.push("/");
  }
  await getChatList();
  scrollToBottom();
});
onBeforeUnmount(() => {
  socket.disconnect();
});
const isImageUrl = (url) => {
  return /\.(gif|jpg|jpeg|tiff|png)$/i.test(url);
};
const handleKeyDown = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    sendMessage();
  }
};
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files); // 获取文件列表
  Upload(files, (uploadedFiles) => {
    // 处理上传后的文件URL
    // 此处可将 URL 添加到你的消息对象中，然后通过 WebSocket 发送给服务器
    uploadedFiles.forEach((url) => {
      message.value = url;
      sendMessage();
    });
  });
};
const socket = io("/chat", {
  transports: ["websocket"],
  query: { appt_id },
});

socket.on("chat message", (msgObj) => {
  messages.value.push(msgObj);
});
//解决刷新聊天记录消失的问题,永久保存
const getChatList = async () => {
  try {
    const { status, message, data } = await api.getImgTextList(appt_id);
    if (status === 0) {
      if (data.length !== 0) {
        data.forEach((e) => {
          const { appt_id, ...newObj } = e; // 使用解构赋值去除 appt_id 属性
          messages.value.push(newObj); // 将新对象添加到 message.value 数组中
        });
      }
      return;
    }
    ElMessage.error(message);
  } catch (error) {
    ElMessage.error(error);
  }
};
const sendMessage = () => {
  if (message.value.trim().length === 0) return;

  const msgObj = {
    content: message.value,
    role, // 从本地存储中获取用户角色
    userName, // 从本地存储中获取用户ID
    time: moment().format("HH:mm:ss"),
  };
  socket.emit("chat message", msgObj);
  message.value = "";
};
</script>

<style module lang="less">
.inputForm {
  display: flex;
  align-items: center;
  position: fixed;
  padding: 0 0.5rem;
  bottom: 0;
  background: #b58cef;
  left: 13rem;
  right: 0;
  min-height: 3rem;
  justify-content: space-between;
  .hiddenFileInput {
    display: none;
  }

  input {
    min-height: 1.9rem;
    font-size: 1rem;
    border-radius: 2rem;
    padding: 0 1rem;
    flex-grow: 1;
    margin-right: 1rem;
    border: 0;
    transition: all 0.2s;

    &:focus {
      border: 2px solid #620681;
      transition: all 0.2s;
      outline: none;
    }
  }

  button {
    width: 8rem;
    height: 2.1rem;
    border-radius: 2rem;
    border: 2px solid #620681;
    color: #620681;
    background: #f3ecfd;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      background: #620681;
      color: #fff;
      border: 2px solid #620681;
      transition: all 0.2s;
    }
  }
  .uploadBtn {
    margin-right: 1rem;
  }
}

.textImgConsult {
  margin: 1rem 1rem 4rem 1rem;
  box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.3);
  border-radius: 2rem;
  padding: 1.5rem;
  height: calc(100vh - 11rem);
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 10px; /* Width of the scrollbar */
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1; /* Track color */
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #620681; /* Scrollbar color */
    border-radius: 10px;
    border: 3px solid #f1f1f1; /* Adds some padding around scrollbar */
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #7f30ed; /* Hover color */
  }

  &::-webkit-scrollbar-corner {
    background: transparent; /* Bottom corner color */
  }
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }
  .messageContainer {
    display: flex;
    flex-direction: row;
    align-items: start; /* 需要根据实际需求进行调整，可选：center，end */
  }
  .avatar {
    width: 3rem;
    height: 3rem;
  }
  .header {
    display: flex;
    line-height: 2.5rem;
    height: 2.5rem;

    .userName {
      font-weight: bold;
      margin: 0 0.6rem;
    }

    .time {
      font-size: 0.9rem;
      font-style: italic;
      color: #999;
    }
  }

  .messageBubble {
    display: block;
    padding: 10px 15px;
    border-radius: 10px;
    width: fit-content; // width adapt to content
    max-width: 70%; // maximum width limit
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow: hidden;
    .imageStyle {
      max-width: 100%;
      height: auto;
    }
  }

  .myMessage {
    text-align: right;
    color: rgba(0, 0, 0, 0.8);
    .messageContainer {
      flex-direction: row-reverse;
    }
    .header {
      justify-content: end;
    }
    .messageBubble {
      background-color: #7f30ed;
      color: white;
      border-bottom-right-radius: 0;
      margin-left: auto;
      margin-right: 0.5rem;
    }
  }

  .otherMessage {
    text-align: left;
    color: green;
    .header {
      justify-content: start;
    }
    .messageBubble {
      background-color: #f1f0f0;
      color: black;
      border-bottom-left-radius: 0;
      margin-right: auto;
      margin-left: 0.5rem;
    }
  }
}
</style>
