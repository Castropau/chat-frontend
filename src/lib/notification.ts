// // server/notifications.ts
// import { getPool } from "@/lib/database/db";
// import { io } from "socket.io-client";
// // import { io } from "./socket"; // your socket.io instance

// export async function sendRealtimeNotification(notificationId: number) {
//   const pool = getPool();

//   // Fetch notification + related goal info
//   const [rows]: any = await pool.query(
//     `SELECT n.id, n.user_id, n.actor_id, n.post_id, n.type, n.message, n.is_read, n.created_at,
//             g.title,
//             u.username AS actorName
//      FROM notifications n
//      JOIN goals g ON n.post_id = g.id
//      JOIN users u ON n.actor_id = u.id
//      WHERE n.id = ?`,
//     [notificationId]
//   );

//   if (!rows[0]) return;

//   const notif = rows[0];

//   // Emit via socket (this is the 2nd piece you asked about)
//   io.to(`user_${notif.user_id}`).emit("notification:new", {
//     id: notif.id,
//     message: notif.message,
//     type: notif.type,       // MUST include type
//     post_id: notif.post_id, // MUST include post_id
//     title: notif.title,
//     actorName: notif.actorName,
//     created_at: notif.created_at,
//     is_read: notif.is_read === 1
//   });

//   console.log("🔔 Emitted realtime notification:", notif);
// }
