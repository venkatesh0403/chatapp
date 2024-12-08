const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('new-user', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });

  socket.on('send-chat-message', (message) => {
    socket.broadcast.emit('chat-message', { message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
    console.log('A user disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
