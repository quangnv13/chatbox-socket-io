const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const db = require("./db");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

let onlineUsers = [];

server.listen(3000).on("listening", () => {
  console.info("Chatbox server is listening on port 3000");
});

io.on("connection", (socket) => {
  socket.on("online", (user) => {
    onlineUsers = [...onlineUsers, user];
    io.emit("user-online-changed", onlineUsers);
  });

  socket.on("update-profile", (user) => {
    const index = onlineUsers.findIndex((ol) => ol.socketId === user.socketId);
    onlineUsers[index] = user;
    io.emit("user-online-changed", onlineUsers);
  });

  io.to(socket.id).emit("message", db.get("messages").takeRight(50));

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((ol) => ol.socketId !== socket.id);
    io.emit("user-online-changed", onlineUsers);
  });

  socket.on("get-old-messages", (id) => {
    const index = db.get("messages").findIndex(id);
    io.to(socket.id).emit(
      "old-messages",
      db
        .get("messages")
        .reverse().take(50)
    );
  });

  socket.on("chat", (message) => {
    if (!message.avatar) {
      message.avatar = "guest.png";
    }
    db.get("messages").push(message).write();
    io.emit("new-message", message);
  });
});
