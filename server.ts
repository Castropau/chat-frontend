// import { createServer } from "http";
// import next from "next";
// import { Server } from "socket.io";

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const httpServer = createServer((req, res) => handle(req, res));

  
//   const io = new Server(httpServer, {
//     path: "/api/socket",
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"]
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log("Client connected:", socket.id);

//     socket.on("chatMessage", (msg) => {
//       io.emit("chatMessage", msg);
//     });

//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//     });
//   });

//   const PORT = 3000;
//   httpServer.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//   });
// });
import express from "express";
import http from "http";
import { Server as IOServer, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new IOServer(server, {
  cors: {
    // Replace with your frontend's production domain or use * for testing
    origin: ["https://growup-9psm.onrender.com"],  // Change to your Render app URL
    methods: ["GET", "POST"],
    credentials: true,  // Enable credentials (cookies, etc.)
  },
});

io.on("connection", (socket: Socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", (reason) => {
    console.log("⚠️ Socket disconnected:", reason);
  });
});

// Port for socket server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
