const socket = io();
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const name = prompt('What is your name?');
appendMessage('You joined');
socket.emit('new-user', name);

socket.on('chat-message', (data) => {
  appendMessage(`${data.name}: ${data.message}`, 'received');
});

socket.on('user-connected', (name) => {
  appendMessage(`${name} connected`);
});

socket.on('user-disconnected', (name) => {
  appendMessage(`${name} disconnected`);
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`, 'sent');
  socket.emit('send-chat-message', message);
  messageInput.value = '';
});

function appendMessage(message, type) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  
  if (type === 'sent') {
    messageElement.classList.add('sent');
  } else {
    messageElement.classList.add('received');
  }

  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
