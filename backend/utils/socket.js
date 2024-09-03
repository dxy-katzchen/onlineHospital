const { query } = require("../db");
// socket.js
const socketIO = require("socket.io");

module.exports = function (server) {
  const io = socketIO(server, {
    cors: { origin: "*" },
    transports: ["websocket"],
  });

  const chatNamespace = io.of("/chat");
  const videoNamespace = io.of("/video");

  chatNamespace.on("connection", (socket) => {
    const { appt_id } = socket.handshake.query;
    let sql, result;
    const roomId = `chat_appointment-${appt_id}`;
    socket.join(roomId);

    console.log("One user on-line");
    socket.on("disconnect", () => {
      console.log("One user offline");
    });
    socket.on("chat message", async (msgObj) => {
      chatNamespace.to(roomId).emit("chat message", msgObj);
      try {
        sql = "insert into img_text_consultation set ?";
        result = await query(sql, { ...msgObj, appt_id });
      } catch (error) {
        console.error("Failed to insert chat message:", error);
      }
    });
  });

  videoNamespace.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
      socket.join(roomId);
      setTimeout(() => {
        socket.broadcast.to(roomId).emit("user-connected", userId);
      }, 1000);

      socket.on("disconnect", () => {
        console.log("User Disconnected");
        // videoNamespace.emit("user-disconnected", userId);
        setTimeout(() => {
          socket.broadcast.to(roomId).emit("user-disconnected", userId);
        }, 1000);
      });
    });
  });

  return io;
};
