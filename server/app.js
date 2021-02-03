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

server.listen(3000).on("listening", () => {
  console.info("Chatbox server is listening on port 3000");
});

io.on("connection", (socket) => {
  console.log(`New client connect id: ${socket.id}`);
  io.to(socket.id).emit("message", db.get("messages").slice(0, 50));

  socket.on("disconnect", () => {
    console.log(`Client id: ${socket.id} is disconnected`);
  });

  socket.on("get-old-messages", id => {
      console.log(id);
    const index = db.get("messages").findIndex(id);
    io.to(socket.id).emit("old-messages", db.get("messages").slice(index - 50, index));
  });

  socket.on("chat", (message) => {
      console.log(message);
    if (!message.avatar) {
      message.avatar =
        "https://www.hostpapa.com/knowledgebase/wp-content/uploads/2018/04/1-13.png";
    }
    db.get('messages')
    .push(message).write();
    io.emit("new-message", message);
  });
});
