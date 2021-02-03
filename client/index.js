const socket = io('ws://127.0.0.1:3000');

const chatMessagesDiv = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const onlineUsersDiv = document.getElementById('online-users');
const displayNameProfileLabel = document.getElementById('display-name-profile');
const avatarProfileImg = document.getElementById('avatar-profile');
const displayNameProfileInput = document.getElementById('display-name-input');
const avatarProfileInput = document.getElementById('avatar-input');

let chatMessages = [];