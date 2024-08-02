const socket = io();

const chatBox = document.getElementById("chat_box");
const audio = new Audio("../asset/sound.mp3");
const form = document.getElementById("chat_form");
const totalUser = document.getElementById("user");
const joinForm = document.getElementById("joinForm");

joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!document.getElementById("username").value) return;
  const chatName = document.getElementById("username").value;
  document.getElementById("name").innerText = chatName;
  document.getElementById("enter").style.display = "none";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!document.getElementById("message").value) return;
  const name = document.getElementById("name").innerText;
  const message = document.getElementById("message").value;
  const time = new Date().getTime();
  const data = { name, message, time };

  socket.emit("chat message", data);
  document.getElementById("message").value = "";
  appendMessage(data, (isMe = true));
});

socket.on("totalUser", (users) => {
  totalUser.innerHTML = "Member: " + users;
});

socket.on("chat message", (data) => {
  appendMessage(data, (isMe = false));
  audio.play();
});

function appendMessage(data, isMe = false) {
  removeNotification();
  const messageContainer = document.getElementById("message_container");
  element = `<li class="chat__message ${isMe ? "me" : "other"}">
                  <div class="${isMe ? "chat-me" : "chat-other"}">${
    data.message
  }</div>
                  <div class="chat__message--time">By ${data.name} ● ${moment(
    data.time
  ).fromNow()}</div>
              </li>`;

  messageContainer.innerHTML += element;
  chatBox.scrollTop = chatBox.scrollHeight;
}

// send notification

const nsgBox = document.getElementById("message");

nsgBox.addEventListener("click", (e) => {
  socket.emit("notification", `✍️ ${nameField.innerText} is typing...`);
});

nsgBox.addEventListener("keypress", (e) => {
  socket.emit("notification", `✍️ ${nameField.innerText} is typing...`);
});

nsgBox.addEventListener("blur", (e) => {
  socket.emit("notification", ``);
});

socket.on("notification", (message) => {
  removeNotification();
  const messageContainer = document.getElementById("message_container");
  const element = `
  <li class="notification">${message}</li>
`;
  messageContainer.innerHTML += element;
});

// remove notification
function removeNotification() {
  const notify = document.querySelectorAll(".notification");
  notify.forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
