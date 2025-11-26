// // /app/api/messages/[conversationId]/route.ts
// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(req: Request, { params }: { params: { conversationId: string } }) {
//   const pool = getPool();
//   const userId = params.conversationId; // logged-in user ID from localStorage or session
//   const searchParams = new URL(req.url).searchParams;
//   const otherUserId = searchParams.get("otherUserId");

//   if (!userId || !otherUserId) {
//     return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
//   }

//   try {
//     const [rows]: any = await pool.query(
//       `
//       SELECT m.id, m.content, m.sender_id, u.username AS senderName
//       FROM messages m
//       JOIN users u ON m.sender_id = u.id
//       WHERE (m.sender_id = ? AND m.receiver_id = ?)
//          OR (m.sender_id = ? AND m.receiver_id = ?)
//       ORDER BY m.created_at ASC
//       `,
//       [userId, otherUserId, otherUserId, userId]
//     );

//     const messages = rows.map((msg: any) => ({
//       id: msg.id.toString(),
//       senderName: msg.sender_id === Number(userId) ? "You" : msg.senderName,
//       content: msg.content,
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
export interface ConversationMessageRow extends RowDataPacket {
  id: number;
  content: string;
  sender_id: number;
  receiver_id: number;
  created_at: Date;
  senderName: string;
}

export interface ConversationMessageResponse {
  id: string;
  senderName: string;
  content: string;
}

// ----- API Route -----
// export async function GET(
//   req: Request,
//   { params }: { params: { conversationId: string } }
// ): Promise<NextResponse> {
//   const pool = getPool();
//   const userId = params.conversationId; // logged-in user ID
//   const searchParams = new URL(req.url).searchParams;
//   const otherUserId = searchParams.get("otherUserId");

//   if (!userId || !otherUserId) {
//     return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
//   }

//   try {
//     const [rows] = await pool.query<ConversationMessageRow[] & RowDataPacket[]>(
//       `
//       SELECT m.id, m.content, m.sender_id, u.username AS senderName
//       FROM messages m
//       JOIN users u ON m.sender_id = u.id
//       WHERE (m.sender_id = ? AND m.receiver_id = ?)
//          OR (m.sender_id = ? AND m.receiver_id = ?)
//       ORDER BY m.created_at ASC
//       `,
//       [userId, otherUserId, otherUserId, userId]
//     );

//     const messages: ConversationMessageResponse[] = rows.map((msg) => ({
//       id: msg.id.toString(),
//       senderName: msg.sender_id === Number(userId) ? "You" : msg.senderName,
//       content: msg.content,
//     }));

//     return NextResponse.json(messages);
//   } catch (err: unknown) {
//     console.error("GET /api/messages error:", err);
//     const message = err instanceof Error ? err.message : "Internal server error";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }
export async function GET(
  req: Request,
  context: { params: Promise<{ conversationId: string }> }
): Promise<NextResponse> {

  const { conversationId } = await context.params; // ✅ FIX
  const userId = conversationId;

  const searchParams = new URL(req.url).searchParams;
  const otherUserId = searchParams.get("otherUserId");

  if (!userId || !otherUserId) {
    return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
  }

  const pool = getPool();

  try {
    const [rows] = await pool.query<ConversationMessageRow[]>(
      `
      SELECT m.id, m.content, m.sender_id, u.username AS senderName
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?)
         OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
      `,
      [userId, otherUserId, otherUserId, userId]
    );

    const messages: ConversationMessageResponse[] = rows.map((msg) => ({
      id: msg.id.toString(),
      senderName: msg.sender_id === Number(userId) ? "You" : msg.senderName,
      content: msg.content,
    }));

    return NextResponse.json(messages);
  } catch (err: unknown) {
    console.error("GET /api/messages error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
