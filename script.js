const socket = io();

const roomCode = new URLSearchParams(window.location.search).get('roomCode');
const username = new URLSearchParams(window.location.search).get('username');

// Join the room with the given room code and username
socket.emit('message', { roomCode, username, message });
console.log({ roomCode, username, message });
// Handle form submit event
const form = document.querySelector('form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const input = document.querySelector('input[type=text]');
  const message = input.value.trim();

  if (message) {
    // Send the message to the server
    socket.emit('message', { roomCode, username, message });

    // Clear the input field
    input.value = '';
  }
});

// Add a new message to the chat
function addMessage(message) {
  const messagesList = document.querySelector('#messages');
  const li = document.createElement('li');
  li.textContent = `${message.username}: ${message.message}`; // Display the username and message
  messagesList.appendChild(li);
}

// Handle new message received from the server
socket.on('message', message => {
  addMessage(message);
});

// Update the online users list
function updateOnlineUsers(users) {
  const onlineUsersList = document.querySelector('#online-users');
  onlineUsersList.innerHTML = '';

  for (const user of users) {
    const li = document.createElement('li');
    li.textContent = user;
    onlineUsersList.appendChild(li);
  }
}

// Handle online users list update event
socket.on('onlineUsers', users => {
  updateOnlineUsers(users);
});

// Update the room code display
function updateRoomCodeDisplay(roomCode) {
  const roomCodeDisplay = document.querySelector('#room-code');
  roomCodeDisplay.textContent = roomCode;
}

// Handle room code update event
socket.on('roomCode', roomCode => {
  updateRoomCodeDisplay(roomCode);
});

// Show an alert message
function showAlertMessage(message) {
  const alertMessage = document.querySelector('#alert-message');
  alertMessage.textContent = message;
  alertMessage.classList.add('show');

  // Hide the alert message after 3 seconds
  setTimeout(() => {
    alertMessage.textContent = '';
    alertMessage.classList.remove('show');
  }, 3000);
}

// Handle alert message event
socket.on('alertMessage', message => {
  showAlertMessage(message);
});

function joinRoom() {
  const roomCode = document.querySelector('#room-code-input').value;
  const username = document.querySelector('#username-input').value; // Get the username input value
  window.location.href = `chat.html?roomCode=${roomCode}&username=${username}`; // Pass the username in the query string
}

// Leave the room and redirect to the homepage
function leaveRoom() {
  socket.emit('leave', { roomCode, username });
  window.location.href = '/';
}

// Handle leave room button click event
const leaveRoomButton = document.querySelector('#leave-room-button');
leaveRoomButton.addEventListener('click', leaveRoom);