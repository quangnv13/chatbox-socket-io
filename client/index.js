const socket = io('ws://127.0.0.1:3000');

const chatMessagesDiv = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const onlineUsersDiv = document.getElementById('online-users');
const displayNameProfileLabel = document.getElementById('display-name-profile');
const avatarProfileImg = document.getElementById('avatar-profile');
const displayNameProfileInput = document.getElementById('display-name-input');
const avatarProfileInput = document.getElementById('avatar-input');

socket.on('message', messages => {
    renderChat(messages);
});

function renderChat(newMessages = []) {
    let flag = document.createDocumentFragment();
    newMessages.forEach(message => {
        let wrapperDiv = document.createElement('div');
        wrapperDiv.className += 'p-2 border mt-2 chat-message';

        let avatarImg = document.createElement('img');
        avatarImg.width = '50px';
        avatarImg.src = message.avatar;
        wrapperDiv.appendChild(avatarImg);

        let displayNameSpan = document.createElement('span');
        displayNameSpan.textContent = message.displayName + ': ';
        wrapperDiv.appendChild(displayNameSpan);

        let messageSpan = document.createElement('span');
        messageSpan.textContent = message.message;
        wrapperDiv.appendChild(messageSpan);

        flag.appendChild(wrapperDiv);
    });
    chatMessagesDiv.appendChild(flag);
}


function makeChatId() {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_)(:/?.,,[]-=+@!#";
    var charactersLength = characters.length;
    for (var i = 0; i < 15; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }