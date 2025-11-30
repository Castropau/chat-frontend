// // "use client";
// // import { io, Socket } from "socket.io-client";

// // let socket: Socket | null = null;

// // export function initSocket(url: string) {
// //   if (!socket) {
// //     socket = io(url, {
// //       transports: ["websocket"],
// //       reconnectionAttempts: 5,
// //     });
// //   }
// //   return socket;
// // }

// // export function getSocket() {
// //   return socket;
// // }

// // export function closeSocket() {
// //   if (socket) {
// //     socket.disconnect();
// //     socket = null;
// //   }
// // }
// // "use client";
// // import { io, Socket } from "socket.io-client";

// // let socket: Socket | null = null;

// // export const initSocket = (url: string) => {
// //   if (!socket) {
// //     socket = io(url, { transports: ["websocket"], reconnectionAttempts: 5 });
// //   }
// //   return socket;
// // };

// // export const getSocket = () => socket;
// // export const closeSocket = () => {
// //   socket?.disconnect();
// //   socket = null;
// // };

// "use client";
// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// // export function initSocket(url: string) {
// //   if (!socket) {
// //     socket = io(url, { transports: ["websocket"], reconnectionAttempts: 5 });
// //   }
// //   return socket;
// // }
// export function initSocket(url?: string) {
//   if (!socket) {
//     const SOCKET_URL = url || process.env.NEXT_PUBLIC_SOCKET_URL!;
//     socket = io(SOCKET_URL, { transports: ["websocket"], reconnectionAttempts: 5 });
//   }
//   return socket;
// }
// // export function getSocket() {
// //   return socket;
// // }
// export function getSocket(): Socket {
//   if (!socket) {
//     socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
//       path: "/api/socket"
//     });
//   }
//   return socket;
// }
// export function closeSocket() {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// }

"use client";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
export function initSocket(url: string) {
  if (!socket) {
    socket = io(url, { transports: ["websocket"], reconnectionAttempts: 5 });
  }
  return socket;
} 
export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      withCredentials: true,
    });
  }
  return socket;
}

export function closeSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
