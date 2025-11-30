// "use client";
// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// export function initSocket(url: string) {
//   if (!socket) {
//     socket = io(url, {
//       transports: ["websocket"],
//       reconnectionAttempts: 5,
//     });
//   }
//   return socket;
// }

// export function getSocket() {
//   return socket;
// }

// export function closeSocket() {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// }
// "use client";
// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// export const initSocket = (url: string) => {
//   if (!socket) {
//     socket = io(url, { transports: ["websocket"], reconnectionAttempts: 5 });
//   }
//   return socket;
// };

// export const getSocket = () => socket;
// export const closeSocket = () => {
//   socket?.disconnect();
//   socket = null;
// };

"use client";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// export function initSocket(url: string) {
//   if (!socket) {
//     socket = io(url, { transports: ["websocket"], reconnectionAttempts: 5 });
//   }
//   return socket;
// }
// export function initSocket(url?: string) {
//   if (!socket) {
//     const SOCKET_URL = url || process.env.NEXT_PUBLIC_SOCKET_URL!;
//     socket = io(SOCKET_URL, { transports: ["websocket"], reconnectionAttempts: 5 });
//   }
//   return socket;
// }
export function initSocket(url?: string) {
  if (!socket) {
    const SOCKET_URL = url || process.env.NEXT_PUBLIC_SOCKET_URL!; // Ensure your URL is correct
    socket = io(SOCKET_URL, {
      transports: ["websocket"], // Using WebSocket transport
      reconnectionAttempts: 5,   // Retry connection attempts
    });

    // Log the connection status in the console
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);  // Logs when the socket successfully connects
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);  // Logs if there is a connection error
    });

    socket.on("connect_timeout", () => {
      console.error("❌ Socket connection timeout");  // Logs if there is a connection timeout
    });

    socket.on("disconnect", (reason) => {
      console.log(`⚠️ Socket disconnected: ${reason}`);  // Logs when the socket disconnects
    });
  }

  return socket;
}
export function getSocket() {
  return socket;
}

export function closeSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

