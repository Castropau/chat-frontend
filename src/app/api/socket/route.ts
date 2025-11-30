// app/api/socket/route.ts (or index.ts)

import { Server as IOServer } from 'socket.io';
import { NextResponse } from 'next/server';
import http from 'http';

// Create and configure the Socket.IO server
const handler = async (req: Request) => {
  if (req.method === 'GET') {
    const server = http.createServer((req, res) => res.end('Socket.IO server is running'));
    const io = new IOServer(server, {
      cors: {
        origin: '*',  // You can modify this to a specific domain in production
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      console.log('✅ Socket connected:', socket.id);

      // Handle socket events here
      socket.on('sendMessage', (msg) => {
        io.emit('message:new', msg); // Broadcast message to all connected clients
      });

      socket.on('disconnect', (reason) => {
        console.log(`⚠️ Socket disconnected: ${socket.id} (${reason})`);
      });
    });

    // Start the server
    const PORT = process.env.PORT || 4000;
    server.listen(PORT, () => {
      console.log(`✅ Socket.IO server listening on port ${PORT}`);
    });

    return NextResponse.json({ message: 'Socket server started' });
  } else {
    return new Response('Method Not Allowed', { status: 405 });
  }
};

export { handler as GET };
