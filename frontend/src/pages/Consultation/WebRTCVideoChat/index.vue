<template>
  <div class="container">
    <div class="header">
      <div class="logo">
        <div class="header_back">
          <i class="fas fa-angle-left"></i>
        </div>
        <h3>Video Consultation</h3>
      </div>
    </div>
    <div class="main">
      <div class="main_left">
        <div class="videos_group">
          <div id="video-grid" ref="videoGrid"></div>
        </div>
        <div class="options">
          <div class="options_left">
            <div id="stopVideo" class="options_button" @click="toggleVideo">
              <i class="fa fa-video-camera"></i>
            </div>
            <div id="muteButton" class="options_button" @click="toggleAudio">
              <i class="fa fa-microphone"></i>
            </div>
            <div
              id="disconnect"
              class="options_button background_red"
              @click="disconnectFromRoom"
            >
              <i class="fa fa-phone"></i>
            </div>
          </div>
          <div class="options_right"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import Peer from "peerjs";
import io from "socket.io-client";
import api from "@/axios";
import { useAppointmentStore } from "@/store";
import { useRouter } from "vue-router";

const appointmentStore = useAppointmentStore();
const router = useRouter();
const appt_id = appointmentStore.appt_id;
const ROOM_ID = ref(null);
const iceServerKey = "xxx";
const socket = io("/video", {
  transports: ["websocket"],
});
let peer;
let myVideoStream;
const videoGrid = ref(null);
const myVideo = document.createElement("video");

onMounted(async () => {
  await setRoomId();
  await initializePeer();
  start();
  myVideo.muted = true;
});
const initializePeer = async () => {
  const config = await getIceServers();
  peer = new Peer(config);
};
const getIceServers = async () => {
  // var peerConfiguration = {
  //   config: {
  //     iceServers: [
  //       { urls: "stun:stun.l.google.com:19302" },
  //       { urls: "stun:stun.relay.metered.ca:80" },
  //       {
  //         urls: "turn:global.relay.metered.ca:80",
  //         username: "92c0c0f3362e3c6f2f20a86d",
  //         credential: "aK0V47jdAT0iaI4a",
  //       },
  //       {
  //         urls: "turn:global.relay.metered.ca:80?transport=tcp",
  //         username: "92c0c0f3362e3c6f2f20a86d",
  //         credential: "aK0V47jdAT0iaI4a",
  //       },
  //       {
  //         urls: "turn:global.relay.metered.ca:443",
  //         username: "92c0c0f3362e3c6f2f20a86d",
  //         credential: "aK0V47jdAT0iaI4a",
  //       },
  //       {
  //         urls: "turns:global.relay.metered.ca:443?transport=tcp",
  //         username: "92c0c0f3362e3c6f2f20a86d",
  //         credential: "aK0V47jdAT0iaI4a",
  //       },
  //     ],
  //   },
  // };
  var peerConfiguration = { config: {} };
  const res = await axios.get(
    `/api/v1/turn/credentials?apiKey=${iceServerKey}`
  );
  const iceServers = res.data;
  peerConfiguration.config.iceServers = iceServers;

  // console.log(peerConfiguration);
  return peerConfiguration;
};
const setRoomId = async () => {
  console.log(appt_id);
  const { status, message, data } = await api.getVideoConsultation(appt_id);
  if (status !== 0) {
    ElMessage.error(message);
    return;
  }
  const { uuid } = data;
  ROOM_ID.value = uuid;
};

const start = async () => {
  try {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);

        peer.on("call", (call) => {
          console.log("someone call me");
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        socket.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });

        socket.on("user-disconnected", (userId) => {
          removeVideoStream(userId);
        });
      });

    peer.on("open", (id) => {
      console.log("my user id is", id);
      socket.emit("join-room", ROOM_ID.value, id);
    });
  } catch (err) {
    console.error("Error accessing media devices.", err);
  }
};

const addVideoStream = (video, stream, userID) => {
  video.srcObject = stream;
  video.id = userID; // Assign a unique ID to the video element
  video.addEventListener("loadedmetadata", () => {
    video.play();
    if (videoGrid.value) {
      videoGrid.value.append(video);
    }
  });
};

const removeVideoStream = (userId) => {
  const video = document.getElementById(userId);
  console.log(video);
  if (video) {
    video.remove();
  }
};

const connectToNewUser = (userId, stream) => {
  console.log("I call someone" + userId);
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream, userId);
  });
};

const toggleAudio = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    document.querySelector("#muteButton").classList.toggle("background_red");
    document.querySelector("#muteButton").innerHTML =
      '<i class="fas fa-microphone-slash"></i>';
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    document.querySelector("#muteButton").classList.toggle("background_red");
    document.querySelector("#muteButton").innerHTML =
      '<i class="fas fa-microphone"></i>';
  }
};

const toggleVideo = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    document.querySelector("#stopVideo").classList.toggle("background_red");
    document.querySelector("#stopVideo").innerHTML =
      '<i class="fas fa-video-slash"></i>';
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    document.querySelector("#stopVideo").classList.toggle("background_red");
    document.querySelector("#stopVideo").innerHTML =
      '<i class="fas fa-video"></i>';
  }
};

const stopMediaTracks = () => {
  if (myVideoStream) {
    myVideoStream.getTracks().forEach((track) => track.stop());
  }
};

const disconnectFromRoom = () => {
  peer.destroy();
  const myVideoElement = document.querySelector("video");
  if (myVideoElement) {
    myVideoElement.remove();
  }
  socket.disconnect();
  router.push({ name: "MyAppointmentList" });
};

onBeforeUnmount(() => {
  stopMediaTracks();
  disconnectFromRoom();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");
.container {
  min-height: calc(100vh - 3.5rem);
  --main-darklg: #cc97e3;
  --main-dark: #a04ec2;
  --primary-color: #00b8a9;
  --main-light: #f9f6f6;
  overflow-y: scroll;
  overflow-x: hidden;
}

* {
  margin: 0;
  padding: 0;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 8vh;
  position: relative;
  width: 100%;
  background-color: var(--main-darklg);
}

.logo > h3 {
  color: var(--main-light);
}

.main {
  overflow: hidden;
  height: calc(92vh - 3.5rem);
  display: flex;
}

.main_left {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.videos_group {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: var(--main-dark);
}

.options {
  padding: 1rem;
  display: flex;
  background-color: var(--main-darklg);
}

.options_left {
  display: flex;
}

.options_right {
  margin-left: auto;
}

.options_button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-color);
  height: 50px;
  border-radius: 50px;
  color: var(--main-light);
  font-size: 1.2rem;
  width: 50px;
  margin: 0 0.5rem;
}

.background_red {
  background-color: #f6484a;
}

.main_right {
  display: flex;
  flex-direction: column;
  flex: 0.3;
  background-color: #242f41;
}

.main_chat_window {
  flex-grow: 1;
  overflow-y: scroll;
}

.main_chat_window::-webkit-scrollbar {
  display: none;
}

.main_message_container {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main_message_container > input {
  height: 50px;
  flex: 1;
  font-size: 1rem;
  border-radius: 5px;
  padding-left: 20px;
  border: none;
}

.messages {
  display: flex;
  flex-direction: column;
  margin: 1.5rem;
}

.message {
  display: flex;
  flex-direction: column;
}

.message > b {
  color: #eeeeee;
  display: flex;
  align-items: center;
  text-transform: capitalize;
}

.message > b > i {
  margin-right: 0.7rem;
  font-size: 1.5rem;
}

.message > span {
  background-color: #eeeeee;
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 5px;
}

#video-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

#showChat {
  display: none;
}

.header_back {
  display: none;
  position: absolute;
  font-size: 1.3rem;
  top: 17px;
  left: 28px;
  color: #fff;
}

@media (max-width: 700px) {
  .main_right {
    display: none;
  }
  .main_left {
    width: 100%;
    flex: 1;
  }

  video {
    height: auto;
    width: 100%;
  }

  #showChat {
    display: flex;
  }
}
</style>
<style>
video {
  height: 300px;
  border-radius: 1rem;
  margin: 0.5rem;
  width: 400px;
  object-fit: cover;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
}
</style>
