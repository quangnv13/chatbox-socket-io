const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('database/database.json');
const db = low(adapter)

db.defaults({ messages: [{
  id: 'thefirstchat',
  displayName: 'Quang Nguyễn',
  avatar: 'https://en.gravatar.com/userimage/174280519/67c161a7d11df7d4c20d489da3525883.jpg',
  message: 'Welcome to my chatbox'
}]})
  .write();

module.exports = db;