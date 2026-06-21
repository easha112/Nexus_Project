const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const mongoose = require("mongoose");

// Load env
dotenv.config();

const connectDB = require("./config/db");

// DB connect safe
connectDB();

const app = express();
const server = http.createServer(app);

// CORS (safe for dev + production)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/meetings", require("./routes/meetingRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("Nexus API is running...");
});

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join-room", ({ roomId, userId }) => {
    socket.join(roomId);

    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });

  socket.on("offer", (data) => {
    socket.to(data.target).emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.to(data.target).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.target).emit("ice-candidate", data.candidate);
  });
});

// PORT
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);

  // DEBUG IMPORTANT
  console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded" : "NOT FOUND ❌");
});
