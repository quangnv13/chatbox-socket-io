const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const db = require("./database/db");
const app = express();
const server = http.createServer(app); // Tạo một http server với listener là express
const io = socketio(server, { // Khởi tạo socket io với http server ở trên
  cors: {
    origin: "*", // Disable CORS để mọi origin đều connect được, môi trường production thì nên setup chuẩn
  },
});

let onlineUsers = []; // Array này mình dùng để lưu các user đang online

app.use(express.static("../client")); // Dùng express để phục vụ các file ở folder client(frontend)
server.listen(3000).on("listening", () => { // Khởi tạo http server ở port 3000
  console.info("Chatbox server is listening on port 3000");
});

io.on("connection", (socket) => { // Handle event connection khi một user connect vào chatbox
  socket.on("online", (user) => { // Handle event online được gửi từ frontend
    onlineUsers = [...onlineUsers, user]; // Thêm user mới online vào danh sách
    io.emit("user-online-changed", onlineUsers); // Gửi danh sách user online mới nhất tới toàn bộ client đang connect
  });

  io.to(socket.id).emit("message", db.get("messages").takeRight(50)); // Gửi danh sách message trong chatbox trước đó(lấy tối đa 50 message), frontend khi scroll sẽ load thêm(infinity scroll)

  socket.on("update-profile", (user) => { // Đoạn này chỉ để handle event và update thông tin user
    const index = onlineUsers.findIndex((ol) => ol.socketId === user.socketId);
    if (!user.avatar) {
      user.avatar = "./image/guest.png";
    }
    onlineUsers[index] = user;
    io.emit("user-online-changed", onlineUsers);
  });

  socket.on("disconnect", () => { // Handle khi một socket bị disconnect thì xóa user tương ứng và gửi lại danh sách user online
    onlineUsers = onlineUsers.filter((ol) => ol.socketId !== socket.id);
    io.emit("user-online-changed", onlineUsers);
  });

  socket.on("get-old-messages", (id) => { // Dùng khi frontend muốn load thêm message cũ hơn bằng cách scroll(infinity scroll)
    const messages = db.get("messages").cloneDeep().reverse();
    const index = messages.findIndex((m) => m.id === id).value();
    if (index >= 0) {
      io.to(socket.id).emit(
        "old-messages",
        messages.slice(index + 1, index + 51)
      );
    }
  });

  socket.on("chat", (message) => { // Gửi các đoạn chat message vào chatbox
    if (!message.avatar) {
      message.avatar = "guest.png";
    }
    db.get("messages").push(message).write();
    io.emit("new-message", message);
  });
});
