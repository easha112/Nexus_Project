const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Load env first
dotenv.config();
const connectDB = require('./config/db');
// Database connection
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


// Middleware
app.use(cors({
  origin: "https://nexus-iota-five.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));


// Uploads folder
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);


// Test API
app.get('/', (req, res) => {
  res.send('Nexus API is running...');
});


// Socket.IO Video Calling
io.on('connection', (socket) => {

  console.log(`User Connected: ${socket.id}`);


  socket.on('join-room', ({roomId, userId}) => {

    socket.join(roomId);

    socket.to(roomId).emit(
      'user-connected',
      userId
    );

    console.log(
      `${userId} joined ${roomId}`
    );


    socket.on('disconnect', () => {

      socket.to(roomId)
      .emit('user-disconnected', userId);

      console.log(
        `User disconnected ${userId}`
      );

    });

  });



  // WebRTC Offer
  socket.on('offer', (data)=>{

    socket.to(data.target)
    .emit('offer', data);

  });


  // WebRTC Answer
  socket.on('answer', (data)=>{

    socket.to(data.target)
    .emit('answer', data);

  });


  // ICE Candidate
  socket.on('ice-candidate',(data)=>{

    socket.to(data.target)
    .emit(
      'ice-candidate',
      data.candidate
    );

  });


});

// Port
const PORT = process.env.PORT || 5000;


server.listen(PORT,()=>{

 console.log(
   `Server running on port ${PORT}`
 );

});