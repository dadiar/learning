const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve static files from the postx directory
app.use(express.static(path.join(__dirname, '')));

// Serve index.html from the js directory
app.get('', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'postx', 'chat.html'));
});


io.on('connection', socket => {
  console.log('New client connected');

  socket.on('join', ({ username, roomCode }) => {
    socket.join(roomCode);
    io.to(roomCode).emit('message', `${username} has joined the room`);

    socket.on('message', ({ message }) => {
      io.to(roomCode).emit('message', `${username}: ${message}`);
    });

    socket.on('leave', () => {
      io.to(roomCode).emit('message', `${username} has left the room`);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(8000, () => {
  console.log('Server running on port 8000');
});