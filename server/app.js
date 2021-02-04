const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const db = require("./database/db");
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

let onlineUsers = [];

app.use(express.static('../client'));
server.listen(8080).on("listening", () => {
  console.info("Chatbox server is listening on port 3000");
});

io.on("connection", (socket) => {
  socket.on("online", (user) => {
    onlineUsers = [...onlineUsers, user];
    io.emit("user-online-changed", onlineUsers);
  });

  socket.on("update-profile", (user) => {
    const index = onlineUsers.findIndex((ol) => ol.socketId === user.socketId);
    if(!user.avatar) {
      user.avatar = './image/guest.png';
    }
    onlineUsers[index] = user;
    io.emit("user-online-changed", onlineUsers);
  });

  io.to(socket.id).emit("message", db.get("messages").takeRight(50));

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((ol) => ol.socketId !== socket.id);
    io.emit("user-online-changed", onlineUsers);
  });

  socket.on("get-old-messages", id => {
    const messages = db.get("messages").cloneDeep().reverse();
    const index = messages.findIndex(m => m.id === id).value();
    if(index >= 0) {
      io.to(socket.id).emit(
        "old-messages",
        messages.slice(index + 1, index + 51)
      );
    }
  });

  socket.on("chat", (message) => {
    if (!message.avatar) {
      message.avatar = "guest.png";
    }
    db.get("messages").push(message).write();
    io.emit("new-message", message);
  });
});
