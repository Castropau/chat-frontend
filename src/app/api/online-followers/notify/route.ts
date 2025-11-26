// import { getPool } from "@/lib/database/db";
// import { NextResponse } from "next/server";
// import { io } from "socket.io-client";
// // import { io } from "@/utils/socket-server"; // import Socket.IO server

// export async function POST() {
//   try {
//     const pool = await getPool();
//     const [rows] = await pool.query(
//       "SELECT id, username, image FROM users WHERE online = 1"
//     );

//     io.emit("online:update", rows); // broadcast to all clients
//     return NextResponse.json({ ok: true });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to broadcast online users" },
//       { status: 500 }
//     );
//   }
// }
import { getPool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import fetch from "node-fetch"; // or global fetch in Node 18+
const socketUrl = process.env.SOCKET_URL;
export async function POST() {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      "SELECT id, username, image FROM users WHERE online = 1"
    );

    // Instead of io.emit(), send to your Express Socket.IO server
    // await fetch("http://localhost:4000/online-status", {
    await fetch(`${socketUrl}/online-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ online: rows, userId: null }) // userId optional
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to broadcast online users" },
      { status: 500 }
    );
  }
}
