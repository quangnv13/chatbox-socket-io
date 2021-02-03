const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('database.json');
const db = low(adapter)

db.defaults({ messages: [{
  id: 1,
  displayName: 'Quang Nguyễn',
  avatar: 'test',
  message: 'test'
}]})
  .write();

module.exports = db;