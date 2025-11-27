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
// export function initSocket() {
//   // Get the appropriate socket URL depending on the environment
//   const socketUrl = process.env.NODE_ENV === 'production' 
//     ? 'wss://growup-9psm.onrender.com'  // Production URL
//     : 'ws://localhost:4000';  // Local development URL
  
//   if (!socket) {
//     socket = io(socketUrl, {
//       transports: ['websocket'],   // Use WebSocket transport
//       reconnectionAttempts: 5,     // Set reconnection attempts
//     });
//   }
//   return socket;
// }
// export function initSocket(socketUrl?: string) {
//   // Use the provided URL or fallback to environment-based logic
//   // const url = socketUrl || (process.env.NODE_ENV === 'production' 
//     const url = socketUrl || process.env.NEXT_PUBLIC_SOCKET_URL || (process.env.NODE_ENV === 'production'

//     ? 'wss://growup-9psm.onrender.com'  // Production URL
//     : 'ws://localhost:4000');  // Local development URL
  
//   if (!socket) {
//     socket = io(url, {
//       transports: ['websocket'],
//       reconnectionAttempts: 5,
//     });
//   }
//   return socket;
// }
export function initSocket(socketUrl?: string) {
  // Use the provided URL or fallback to environment-based logic
  // const url = socketUrl || process.env.NEXT_PUBLIC_SOCKET_URL || (process.env.NODE_ENV === 'production'
  //   ? 'wss://growup-9psm.onrender.com'  // Production URL
  //   : 'ws://localhost:4000');  // Local development URL
    const url =
    socketUrl ||
    process.env.NEXT_PUBLIC_SOCKET_URL ||  // Use the environment variable
    (process.env.NODE_ENV === "production"  // Use production URL if in production
      ? "wss://growup-9psm.onrender.com"
      : "ws://localhost:4000");  // Use localhost in development
  // const url = socketUrl || process.env.NEXT_PUBLIC_SOCKET_URL || 'wss://growup-9psm.onrender.com';  // Production URL

    // const url = socketUrl || process.env.NEXT_PUBLIC_SOCKET_URL || 'wss://growup-9psm.onrender.com:4000';  // Production URL

  
  if (!socket) {
    socket = io(url, {
      // transports: ['websocket'],
      transports: ["websocket", "polling"],  // Allow both WebSocket and fallback polling

      reconnectionAttempts: 5,
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

