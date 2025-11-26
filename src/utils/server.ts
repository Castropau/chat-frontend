// // // socket-server.ts
// // import express, { Request, Response } from "express";
// // import http from "http";
// // import { Server as IOServer, Socket } from "socket.io";

// // const PORT = Number(process.env.SOCKET_PORT || 4000); // ✅ different from 3000
// // const ORIGIN = process.env.SOCKET_ORIGIN || "*";

// // type BroadcastPayload = {
// //   postId: number | string;
// //   payload?: unknown;
// // };

// // const app = express();
// // const server = http.createServer(app);

// // const io = new IOServer(server, {
// //   cors: {
// //     origin: ORIGIN,
// //     methods: ["GET", "POST"],
// //     credentials: true,
// //   },
// // });

// // app.get("/", (_req: Request, res: Response) => res.send("Socket server running"));

// // io.on("connection", (socket: Socket) => {
// //   console.log("Socket connected:", socket.id);

// //   socket.on("join", (data: { postId?: number | string }) => {
// //     const postId = data?.postId;
// //     if (!postId) return;
// //     const room = `post_${postId}`;
// //     socket.join(room);
// //     console.log(`Socket ${socket.id} joined room ${room}`);
// //   });

// //   socket.on("leave", (data: { postId?: number | string }) => {
// //     const postId = data?.postId;
// //     if (!postId) return;
// //     const room = `post_${postId}`;
// //     socket.leave(room);
// //     console.log(`Socket ${socket.id} left room ${room}`);
// //   });


  
// //   socket.on("disconnect", (reason) => {
// //     console.log(`Socket disconnected: ${socket.id} (${reason})`);
// //   });
// // });

// // app.use(express.json());
// // app.post("/broadcast", (req: Request<{}, {}, BroadcastPayload>, res: Response) => {
// //   const { postId, payload } = req.body ?? {};
// //   if (!postId) return res.status(400).json({ error: "postId required" });

// //   const room = `post_${postId}`;
// //   io.to(room).emit("reactions:update", { postId, payload });
// //   console.log(`Broadcasted update to room ${room}`);
// //   return res.json({ ok: true });
// // });

// // server.listen(PORT, () => {
// //   console.log(`✅ Socket server listening on port ${PORT}`);
// // });
// import express from "express";
// import http from "http";
// import { Server as IOServer, Socket } from "socket.io";

// const PORT = Number(process.env.SOCKET_PORT || 4000);

// const app = express();
// app.use(express.json());

// const server = http.createServer(app);
// const io = new IOServer(server, {
//   cors: { origin: "*", methods: ["GET", "POST"], credentials: true },
// });

// io.on("connection", (socket: Socket) => {
//   console.log("✅ Socket connected:", socket.id);

//   socket.on("join", ({ postId }: { postId: number | string }) => {
//     if (!postId) return;
//     const room = `post_${postId}`;
//     socket.join(room);
//     console.log(`Socket ${socket.id} joined room ${room}`);
//   });

//   socket.on("leave", ({ postId }: { postId: number | string }) => {
//     if (!postId) return;
//     const room = `post_${postId}`;
//     socket.leave(room);
//     console.log(`Socket ${socket.id} left room ${room}`);
//   });

//   socket.on("disconnect", (reason) => {
//     console.log(`Socket disconnected: ${socket.id} (${reason})`);
//   });
// });

// // Generic broadcast endpoint
// app.post("/broadcast", (req, res) => {
//   const { postId, payload } = req.body;
//   if (!postId) return res.status(400).json({ error: "postId required" });

//   const room = `post_${postId}`;
//   io.to(room).emit("reactions:update", { postId, payload }); // updates reactions
//   io.to(room).emit("comments:update", { postId, payload });  // updates comments
//   console.log(`✅ Broadcasted to room ${room}`);
//   res.json({ ok: true });
// });

// server.listen(PORT, () => console.log(`✅ Socket server running on port ${PORT}`));
