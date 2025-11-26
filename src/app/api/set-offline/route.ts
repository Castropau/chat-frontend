// app/api/set-offline/route.ts
import { NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";
import axios from "axios"; // call socket-server
const socketUrl = process.env.SOCKET_URL;
export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const pool = getPool();
    await pool.execute("UPDATE users SET online = 0 WHERE id = ?", [userId]);

    // 🔥 Notify Socket Server that the user is offline
    // await axios.post("http://localhost:4000/online-status", {
    await axios.post(`${socketUrl}/online-status`, {
      userId,
      online: 0,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error updating offline:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
