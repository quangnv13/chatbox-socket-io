const socket = io();

const chatMessagesDiv = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const onlineUsersDiv = document.getElementById("online-users");
const displayNameProfileLabel = document.getElementById("display-name-profile");
const avatarProfileImg = document.getElementById("avatar-profile");
const displayNameProfileInput = document.getElementById("display-name-input");
const avatarProfileInput = document.getElementById("avatar-input");
const updatedNofity = document.getElementById("updated-notify");

let displayNameProfile = "Guest";
let avatar = "./image/guest.png";

socket.on("connect", () => {
  socket.emit("online", {
    socketId: socket.id,
    displayName: displayNameProfile,
    avatar: avatar,
  });

  socket.on("user-online-changed", (onlineUsers) => {
    renderOnlineUsers(onlineUsers);
  });

  socket.on("message", (messageList) => {
    renderChat(messageList, false);
    setTimeout(() => {
      chatMessagesDiv.scroll({ top: chatMessagesDiv.scrollHeight });
    });
  });

  socket.on("new-message", (newMessage) => {
    renderChat([...[], newMessage], true);
    chatMessagesDiv.scroll({ top: chatMessagesDiv.scrollHeight });
  });

  chatMessagesDiv.onscroll = () => {
    const idFirstMessage = chatMessagesDiv.children[0].id;
    if (chatMessagesDiv.scrollTop === 0) {
      socket.emit("get-old-messages", idFirstMessage);
    }
  };

  chatInput.onkeypress = (event) =>  {
    if(event.code === 'Enter') {
      chat();
    }
  };

  socket.on("old-messages", (oldMessages) => {
    renderOldChat(oldMessages);
  });
});

function chat() {
  const message = {
    id: makeChatId(),
    displayName: displayNameProfile,
    avatar: avatar,
    message: chatInput.value,
  };
  socket.emit("chat", message);
  chatInput.value = "";
}

function updateProfile() {
  displayNameProfile = displayNameProfileInput.value;
  avatar = avatarProfileInput.value;
  if(!avatar) {
    avatar = './image/guest.png';
  }

  displayNameProfileLabel.textContent = displayNameProfile;
  avatarProfileImg.src = avatar;

  socket.emit("update-profile", {
    socketId: socket.id,
    displayName: displayNameProfile,
    avatar: avatar,
  });

  updatedNofity.hidden = false;
  setTimeout(() => {
    updatedNofity.hidden = true;
  }, 3000);
}

async function renderChat(newMessages = [], isNewMessage = false) {
  newMessages.forEach(async (message, i) => {
    let wrapperDiv = document.createElement("div");
    if(isNewMessage) {
      wrapperDiv.className +=
      "p-2 border mt-2 chat-message animate__animated animate__backInLeft";
    } else {
      wrapperDiv.className +=
      "p-2 border mt-2 chat-message animate__animated animate__fadeIn";
    }
    wrapperDiv.id = message.id;

    let avatarImg = document.createElement("img");
    avatarImg.style.width = '40px';
    avatarImg.style.height = '40px';
    avatarImg.style.objectFit = 'cover';
    avatarImg.className += "rounded-circle img-thumbnail mr-2";
    avatarImg.src = message.avatar;
    wrapperDiv.appendChild(avatarImg);

    let displayNameSpan = document.createElement("span");
    displayNameSpan.textContent = " " + message.displayName + ": ";
    displayNameSpan.style.fontWeight = 600;
    wrapperDiv.appendChild(displayNameSpan);

    let messageSpan = document.createElement("span");
    messageSpan.textContent = message.message;
    wrapperDiv.appendChild(messageSpan);

    chatMessagesDiv.appendChild(wrapperDiv);
  });
}

async function renderOldChat(oldMessages = []) {
  oldMessages.forEach((message) => {
    let wrapperDiv = document.createElement("div");
    wrapperDiv.className +=
      "p-2 border mt-2 chat-message animate__animated animate__fadeIn";
    wrapperDiv.id = message.id;

    let avatarImg = document.createElement("img");
    avatarImg.style.width = '40px';
    avatarImg.style.height = '40px';
    avatarImg.style.objectFit = 'cover';
    avatarImg.className += "rounded-circle img-thumbnail mr-2";
    avatarImg.src = message.avatar;
    wrapperDiv.appendChild(avatarImg);

    let displayNameSpan = document.createElement("span");
    displayNameSpan.textContent = " " + message.displayName + ": ";
    displayNameSpan.style.fontWeight = 600;
    wrapperDiv.appendChild(displayNameSpan);

    let messageSpan = document.createElement("span");
    messageSpan.textContent = message.message;
    wrapperDiv.appendChild(messageSpan);

    chatMessagesDiv.prepend(wrapperDiv);
  });
}

function renderOnlineUsers(onlineUsers = []) {
  onlineUsersDiv.innerHTML = "";
  let flag = document.createDocumentFragment();
  onlineUsers.forEach((user) => {
    let wrapperDiv = document.createElement("div");
    wrapperDiv.className = "m-1";

    let avatarImg = document.createElement("img");
    avatarImg.style.width = '40px';
    avatarImg.style.height = '40px';
    avatarImg.style.objectFit = 'cover';
    avatarImg.style.marginRight = '5px'
    avatarImg.className += "rounded-circle img-thumbnail mr-2";
    avatarImg.src = user.avatar;
    wrapperDiv.appendChild(avatarImg);

    let displayNameStrong = document.createElement("strong");
    displayNameStrong.textContent = user.displayName;
    wrapperDiv.appendChild(displayNameStrong);

    flag.appendChild(wrapperDiv);
  });
  onlineUsersDiv.appendChild(flag);
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
