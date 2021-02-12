const socket = io(); // Khởi tạo socket.io client

// Get các element theo id
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

socket.on("connect", () => { // Khi connect socket thì gửi đi event online gồm các thông tin của user
  socket.emit("online", {
    socketId: socket.id,
    displayName: displayNameProfile,
    avatar: avatar,
  });

  socket.on("user-online-changed", (onlineUsers) => { // Handle event khi có các thay đổi của các user online
    renderOnlineUsers(onlineUsers); // Render lại view khi có thay đổi các user online
  });

  socket.on("message", (messageList) => { // Handle event khi lần đầu vào chatbox nhận được danh sách các message gần nhất(tối đa 50)
    renderChat(messageList, false); // Render lại view khi có message mới
    setTimeout(() => {
      chatMessagesDiv.scroll({ top: chatMessagesDiv.scrollHeight }); // Tự scroll xuống cuối cùng
    });
  });

  socket.on("new-message", (newMessage) => { // Handle event có message mới
    renderChat([...[], newMessage], true); // Render message mới
    chatMessagesDiv.scroll({ top: chatMessagesDiv.scrollHeight }); // Tự scroll xuống cuối khi có message mới
  });

  chatMessagesDiv.onscroll = () => { // Infinity scroll để lấy các message cũ hơn
    const idFirstMessage = chatMessagesDiv.children[0].id;
    if (chatMessagesDiv.scrollTop === 0) {
      socket.emit("get-old-messages", idFirstMessage);
    }
  };

  socket.on("old-messages", (oldMessages) => { // Handle event khi nhận được các message cũ và render các message cũ
    renderOldChat(oldMessages);
  });

  chatInput.onkeypress = (event) =>  { // Handle event bấm phím enter thì gửi chat
    if(event.code === 'Enter') {
      chat();
    }
  };
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
