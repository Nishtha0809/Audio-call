const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
 const recordingRoutes = require("./Routes/recordingRoutes.js");
const path = require("path");

require("dotenv").config();

const authRoutes = require("./Routes/authRoutes.js");
const articleRoutes = require("./Routes/articleRoutes.js");
const vlogRoutes = require("./Routes/vlogRoutes.js");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://audio-call-3n6e.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/vlogs", vlogRoutes);
app.use("/api/recordings",recordingRoutes);

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://audio-call-3n6e.onrender.com"
    ],
    credentials: true
  }
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (email) => {
    if (!email) return;

    onlineUsers[email] = socket.id;

    console.log("JOIN:", email);
    console.log("ONLINE:", onlineUsers);

    io.emit("online-users", Object.keys(onlineUsers));
  });

  socket.on("call-user", ({ to, from, offer }) => {
    const targetSocket = onlineUsers[to]; //FIND RECEIVER SOCKET

    if (targetSocket) {
      io.to(targetSocket).emit("incoming-call", {
        from,
        offer
      });
    }
  });

  socket.on("answer-call", ({ to, answer }) => {
    const targetSocket = onlineUsers[to];

    if (targetSocket) {
      io.to(targetSocket).emit("call-answered", {
        answer
      });
    }
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    const targetSocket = onlineUsers[to];

    if (targetSocket) {
      io.to(targetSocket).emit("ice-candidate", {
        candidate
      });
    }
  });

  socket.on("reject-call", ({ to }) => {
    const targetSocket = onlineUsers[to];

    if (targetSocket) {
      io.to(targetSocket).emit("call-rejected");
    }
  });

  socket.on("end-call", ({ to }) => {
    const targetSocket = onlineUsers[to];

    if (targetSocket) {
      io.to(targetSocket).emit("call-ended");
    }
  });

  socket.on("disconnect", () => {
    const disconnectedUser = Object.keys(onlineUsers).find(
      (email) => onlineUsers[email] === socket.id
    );

    if (disconnectedUser) {
      delete onlineUsers[disconnectedUser];
      io.emit("online-users", Object.keys(onlineUsers));
    }

    console.log("User disconnected:", socket.id);
  });
});

const PORT = 3002;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});