// // /app/api/conversations/recent/route.ts
// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const userId = url.searchParams.get("userId");
//     if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

//     const pool = getPool();

//     // Get recent conversation users
//     const [rows]: any = await pool.query(
//       `SELECT u.id, u.username, u.image,
//         MAX(m.created_at) AS last_message
//       FROM messages m
//       JOIN users u ON (u.id = m.sender_id OR u.id = m.receiver_id)
//       WHERE u.id != ? AND (m.sender_id = ? OR m.receiver_id = ?)
//       GROUP BY u.id, u.username, u.image
//       ORDER BY last_message DESC`,
//       [userId, userId, userId]
//     );

//     return NextResponse.json(rows);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// /app/api/conversations/recent/route.ts
import { NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";
import { RowDataPacket } from "mysql2/promise";

// ✅ Define interface for a recent conversation user
export interface RecentConversation {
  id: number;
  username: string;
  image: string | null;
  last_message: Date;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const pool = getPool();

    const [rows] = await pool.query<RecentConversation[] & RowDataPacket[]>(
      `
      SELECT 
        u.id, 
        u.username, 
        u.image,
        MAX(m.created_at) AS last_message
      FROM messages m
      JOIN users u ON (u.id = m.sender_id OR u.id = m.receiver_id)
      WHERE u.id != ? AND (m.sender_id = ? OR m.receiver_id = ?)
      GROUP BY u.id, u.username, u.image
      ORDER BY last_message DESC
      `,
      [userId, userId, userId]
    );

    return NextResponse.json(rows);
  } catch (err: unknown) {
    console.error("GET /api/conversations/recent error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
