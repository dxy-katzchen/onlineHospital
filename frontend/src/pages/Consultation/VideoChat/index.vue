<template>
  <button @click="startVideo">开始播放</button>
  <div>
    <h1>Video Consultation</h1>
    <div style="text-align: center">
      <div style="display: inline-block; margin-right: 1rem">
        <h4>我</h4>
        <div id="local-video" style="width: 35rem; height: 26rem"></div>
      </div>
      <div style="display: inline-block">
        <h4>对方</h4>
        <div id="remote-video" style="width: 35rem; height: 26rem"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, reactive } from "vue";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import api from "@/axios";
import { useInfoStore } from "@/store";

const userInfo = useInfoStore();
const { role } = userInfo.user;
const userID = new Date().getTime() + "";
let zg = reactive({});
// 项目唯一标识 AppID，Number 类型，请从 ZEGO 控制台获取
let appID = 1692162542;
// 接入服务器地址 Server，String 类型，请从 ZEGO 控制台获取（获取方式请参考上文“前提条件”）
let server = "wss://webliveroom1692162542-api.imzego.com/ws";

// 房间状态更新回调
// 此处在登录房间成功后，立即进行推流。在实现具体业务时，您可选择其他时机进行推流，只要保证当前房间连接状态是连接成功的即可。
// 房间状态更新回调

// 登录房间，成功则返回 true
// userUpdate 设置为 true 才能收到 roomUserUpdate 回调。

let roomID = "123"; // roomID 用户自己设置，必须保证全局唯一
let token = ref("");
// token 由用户自己的服务端生成，为了更快跑通流程，可以通过即构控制台 https://console.zego.im/ 获取临时的音视频 token，token 为字符串
// let token = `04AAAAAGRaVJcAEHBndXBuZ3piZTIwbHlmMTAAoG1i/5e9f3GtysTGBNdtU0koo9MMSom6oW1uAw3mChAwNMcP6MfIrvOH9DhceWSOZoChx4vOKJKnoPQvrn4Kf0Pn4+4sTP2++TGCEylrSuupJ8WooQVDSni/amO/1VpC0YNABLUAOzo2IeE/A/E9CklEw7e0nFkCYbjE1kcIkjQ1kXUpOyTV890paXvB/13QW6QfRDK6Gt6TH2smu3WHwEM=`;
onBeforeMount(async () => {
  const res = await api.getVideoToken(userID);
  token.value = res.token;
  //创建实例
  zg = new ZegoExpressEngine(appID, server);
  zg.setDebugVerbose(false);
  zg.on("roomStateChanged", async (roomID, reason, errorCode, extendedData) => {
    if (reason == "LOGINED") {
      console.log(
        "与房间连接成功，只有当房间状态是连接成功时，才能进行推流、拉流等操作。"
      );
    }
  });
  //监听回调
  zg.on("roomUserUpdate", (roomID, updateType, userList) => {
    console.log(userList);

    // 其他用户进出房间的通知
  });

  zg.on(
    "roomStreamUpdate",
    async (roomID, updateType, streamList, extendedData) => {
      // 房间内其他用户音视频流变化的通知
      if (updateType == "ADD") {
        // 流新增，开始拉流
        // 此处演示拉取流新增的列表中第一条流的音视频
        const streamID = streamList[0].streamID;
        // streamList 中有对应流的 streamID
        const remoteStream = await zg.startPlayingStream(streamID);
        // 创建媒体流播放组件
        const remoteView = zg.createRemoteStreamView(remoteStream);
        remoteView.play("remote-video", { enableAutoplayDialog: true });
      } else if (updateType == "DELETE") {
        // 流删除，通过流删除列表 streamList 中每个流的 streamID 进行停止拉流。
        const streamID = streamList[0].streamID;
        zg.stopPlayingStream(streamID);
      }
    }
  );
});

const startVideo = () => {
  zg.loginRoom(
    roomID,
    token.value,
    { userID, userName: userID },
    { userUpdate: true }
  ).then(async (result) => {
    if (result == true) {
      console.log("login success");
      // 与房间连接成功，只有当房间状态是连接成功时，才能进行推流、拉流等操作。
      // 创建流、预览
      // 调用 createStream 接口后，需要等待 ZEGO 服务器返回流媒体对象才能执行后续操作
      const localStream = await zg.createStream();
      // 创建媒体流播放组件
      const localView = zg.createLocalStreamView(localStream);
      localView.play("local-video", { enableAutoplayDialog: true });
      // 开始推流，将自己的音视频流推送到 ZEGO 音视频云，此处 streamID 由用户定义，需全局唯一
      let streamID = new Date().getTime().toString();
      zg.startPublishingStream(streamID, localStream);
    }
  });
};
// let token ="04AAAAAGRe95wAEGtwNmV2b2U4eXJzbGZwbG0AsJxQEr6WL/miqdyM+lbKOhU3WjBvIZWrOSTkfjCEQW6BbBz9qvHa8ccsx7aaG90lw7u2cioKWd7Nrks9PJMDXiI6sj8++hp3xeDAmbmnUFjJAqi/YjAT+mIHWk+QW2ROyd+xAA8+nqD9hOAvxRhtKn3GcYNUnagQOxD/qUqVFuse+4dF0DrdazOmo3nyk4Mf2X/QXQwjTLky3xFIF7tC4la57u3vnURveDI/i8wk9Hvn";

// await api.getVideoToken(userID);
</script>

<style module lang="less">
* {
  font-family: sans-serif;
}

h1,
h4 {
  text-align: center;
}

#local-video,
#remote-video {
  width: 400px;
  height: 300px;
  border: 1px solid #dfdfdf;
}

#local-video {
  position: relative;
  margin: 0 auto;
  display: block;
}

#remote-video {
  display: flex;
  margin: auto;
  position: relative !important;
}
</style>
