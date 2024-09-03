import axios from "axios";

import { ElMessage } from "element-plus";
import { useInfoStore } from "@/store";

const instance = axios.create({
  //production environment
  baseURL: "/mmm/",
  //development environment
  // baseURL: "http://localhost:88",

  timeout: 10000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    // "Content-Type": "application/json; charset=utf-8",
  },
});

instance.interceptors.request.use(
  (config) => {
    const uri = config.url;
    console.log(uri);
    // 不以 /user/ 开头, 加 token
    if (!/$\/user\//.test(uri)) {
      const userInfo = useInfoStore();

      config.headers.set("Authorization", userInfo.token);
    }
    return config;
  },
  (err) => {
    ElMessage.error("Request Failed", err);
    return err;
  }
);

instance.interceptors.response.use(
  (res) => {
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message);
    }
    return res.data;
  },
  (err) => {
    return err;
  }
);

export default instance;
