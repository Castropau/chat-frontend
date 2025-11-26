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

export function initSocket(url: string) {
  if (!socket) {
    socket = io(url, { transports: ["websocket"], reconnectionAttempts: 5 });
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

