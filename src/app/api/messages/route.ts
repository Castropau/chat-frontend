// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(req: Request) {
//   const pool = getPool();
//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get("userId");         // logged-in
//   const otherUserId = searchParams.get("otherUserId"); // chat partner

//   if (!userId || !otherUserId) {
//     return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
//   }

//   try {
//     // const [rows]: any = await pool.query(
//     //   `
//     //   SELECT m.id, m.content, m.sender_id, u.username AS senderName
//     //   FROM messages m
//     //   JOIN users u ON m.sender_id = u.id
//     //   WHERE (m.sender_id = ? AND m.receiver_id = ?)
//     //      OR (m.sender_id = ? AND m.receiver_id = ?)
//     //   ORDER BY m.created_at ASC
//     //   `,
//     //   [userId, otherUserId, otherUserId, userId]
//     // );
// const [rows]: any = await pool.query(
//   `
//   SELECT m.id, m.content, m.sender_id, u.username AS senderName, u.image AS avatar
//   FROM messages m
//   JOIN users u ON m.sender_id = u.id
//   WHERE (m.sender_id = ? AND m.receiver_id = ?)
//      OR (m.sender_id = ? AND m.receiver_id = ?)
//   ORDER BY m.created_at ASC
//   `,
//   [userId, otherUserId, otherUserId, userId]
// );

// const messages = rows.map((msg: any) => ({
//   id: msg.id.toString(),
//   senderName: msg.sender_id === Number(userId) ? "You" : msg.senderName,
//   content: msg.content,
//     avatar: msg.avatar, // always use avatar from database

// //   avatar: msg.sender_id === Number(userId) ? null : msg.avatar, // you can handle "You" avatar on frontend
// }));

//     // const messages = rows.map((msg: any) => ({
//     //   id: msg.id.toString(),
//     //   senderName: msg.sender_id === Number(userId) ? "You" : msg.senderName,
//     //   content: msg.content,
//     // }));

//     return NextResponse.json(messages);
//   } catch (err) {
//     console.error("GET /api/messages error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(req: Request) {
//   const pool = getPool();
//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get("userId");         // logged-in
//   const otherUserId = searchParams.get("otherUserId"); // chat partner

//   if (!userId || !otherUserId) {
//     return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
//   }

//   try {
//     const [rows]: any = await pool.query(
//       `
//       SELECT m.id, m.content, m.sender_id, m.unsent, u.username AS senderName, u.image AS avatar
//       FROM messages m
//       JOIN users u ON m.sender_id = u.id
//       WHERE (m.sender_id = ? AND m.receiver_id = ?)
//          OR (m.sender_id = ? AND m.receiver_id = ?)
//       ORDER BY m.created_at ASC
//       `,
//       [userId, otherUserId, otherUserId, userId]
//     );

//     // Map messages to frontend format
//     const messages = rows.map((msg: any) => ({
//       id: msg.id.toString(),
//       senderName: msg.sender_id === Number(userId) ? "You" : msg.senderName,
//       content: msg.unsent === 1 ? "This message was removed" : msg.content,
//       isUnsent: msg.unsent === 1,
//       avatar: msg.avatar,
//     }));

//     return NextResponse.json(messages);
//   } catch (err) {
//     console.error("GET /api/messages error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";
import { RowDataPacket } from "mysql2/promise";

// ----- Interface Types -----
export interface MessageRow extends RowDataPacket {
  id: number;
  content: string;
  sender_id: number;
  receiver_id: number;
  unsent: number;
  created_at: Date;
  senderName: string;
  avatar: string | null;
}

export interface MessageResponse {
  id: string;
  senderName: string;
  content: string;
  isUnsent: boolean;
  avatar: string | null;
}

// ----- API Route -----
export async function GET(req: Request): Promise<NextResponse> {
  const pool = getPool();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");         // logged-in
  const otherUserId = searchParams.get("otherUserId"); // chat partner

  if (!userId || !otherUserId) {
    return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
  }

  try {
    const [rows] = await pool.query<MessageRow[] & RowDataPacket[]>(
      `
      SELECT m.id, m.content, m.sender_id, m.unsent, u.username AS senderName, u.image AS avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?)
         OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
      `,
      [userId, otherUserId, otherUserId, userId]
    );

    // Map messages to frontend format
    const messages: MessageResponse[] = rows.map((msg) => ({
      id: msg.id.toString(),
      senderName: msg.sender_id === Number(userId) ? "You" : msg.senderName,
      content: msg.unsent === 1 ? "This message was removed" : msg.content,
      isUnsent: msg.unsent === 1,
      avatar: msg.avatar,
    }));

    return NextResponse.json(messages);
  } catch (err: unknown) {
    console.error("GET /api/messages error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
