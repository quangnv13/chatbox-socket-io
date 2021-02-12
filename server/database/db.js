const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('database/database.json');
const db = low(adapter) // Khởi tạo lowdb với adapter kết nối tới file database.json

db.defaults({ messages: [{
  id: 'thefirstchat', // Id khi chat sẽ được tự sinh ngẫu nhiên và không trùng, khi set default thì mình để tạm vậy
  displayName: 'Quang Nguyễn', // Đây sẽ là tên hiển thị của mỗi câu chat trong chatbox
  avatar: 'https://en.gravatar.com/userimage/174280519/67c161a7d11df7d4c20d489da3525883.jpg', // Url của avatar mà người dùng sẽ set ở frontend
  message: 'Welcome to my chatbox'
}]})
  .write();

module.exports = db;