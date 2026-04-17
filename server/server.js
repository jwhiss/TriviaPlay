require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const setupSockets = require('./sockets');

const app = express();
app.use(cors());
app.use(express.json());

// RESTful API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB database'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// HTTP server combined with Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Restrict this in production to local network IPs
    methods: ['GET', 'POST']
  }
});

setupSockets(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Trivia Play server running on port ${PORT}`);
});
