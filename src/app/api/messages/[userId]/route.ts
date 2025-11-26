// // /app/api/messages/[userId]/route.ts
// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function GET(req: Request, { params }: { params: { userId: string } }) {
//   const pool = getPool();
//   const userId = params.userId;

//   if (!userId) return NextResponse.json({ error: "UserId required" }, { status: 400 });

//   try {
//     const [rows]: any = await pool.query(
//       `SELECT m.id, m.content, 
//               u.id AS senderId, u.username AS senderName
//        FROM messages m
//        JOIN users u ON m.sender_id = u.id
//        WHERE m.sender_id = ? OR m.receiver_id = ?
//        ORDER BY m.created_at ASC`,
//       [userId, userId]
//     );

//     // Transform so senderName is "You" if sender_id matches logged-in user
//     const loggedInUserId = userId; // fetched from localStorage or session
//     const messages = rows.map((msg: any) => ({
//       id: msg.id.toString(),
//       senderName: msg.senderId === Number(loggedInUserId) ? "You" : msg.senderName,
//       content: msg.content,
//     }));

//     return NextResponse.json(messages);
//   } catch (err) {
//     console.error("GET /api/messages error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// /app/api/messages/[userId]/route.ts
// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";
// import { RowDataPacket } from "mysql2/promise";

// // ----- Interface Types -----
// export interface MessageRow extends RowDataPacket {
//   id: number;
//   content: string;
//   senderId: number;
//   senderName: string;
// }

// export interface MessageResponse {
//   id: string;
//   senderName: string;
//   content: string;
// }

// export interface ApiError {
//   error: string;
// }

// // ----- API Route -----
// export async function GET(
//   req: Request,
//   { params }: { params: { userId: string } }
// ): Promise<NextResponse> {
//   const pool = getPool();
//   const userId = params.userId;

//   if (!userId) {
//     const errorResponse: ApiError = { error: "UserId required" };
//     return NextResponse.json(errorResponse, { status: 400 });
//   }

//   try {
//     const [rows] = await pool.query<MessageRow[] & RowDataPacket[]>(
//       `
//       SELECT m.id, m.content, 
//              u.id AS senderId, u.username AS senderName
//       FROM messages m
//       JOIN users u ON m.sender_id = u.id
//       WHERE m.sender_id = ? OR m.receiver_id = ?
//       ORDER BY m.created_at ASC
//       `,
//       [userId, userId]
//     );

//     // Transform so senderName is "You" if sender_id matches logged-in user
//     const loggedInUserId = Number(userId); // fetched from localStorage or session
//     const messages: MessageResponse[] = rows.map((msg) => ({
//       id: msg.id.toString(),
//       senderName: msg.senderId === loggedInUserId ? "You" : msg.senderName,
//       content: msg.content,
//     }));

//     return NextResponse.json(messages);
//   } catch (err: unknown) {
//     console.error("GET /api/messages error:", err);
//     const message = err instanceof Error ? err.message : "Internal server error";
//     const errorResponse: ApiError = { error: message };
//     return NextResponse.json(errorResponse, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";
import { RowDataPacket } from "mysql2/promise";

// ----- Interface Types -----
export interface MessageRow extends RowDataPacket {
  id: number;
  content: string;
  senderId: number;
  senderName: string;
}

export interface MessageResponse {
  id: string;
  senderName: string;
  content: string;
}

export interface ApiError {
  error: string;
}

// ----- API Route -----
export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  const { userId } = await context.params;

  if (!userId) {
    const errorResponse: ApiError = { error: "UserId required" };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  try {
    const pool = getPool();

    const [rows] = await pool.query<MessageRow[]>(
      `
      SELECT 
        m.id, 
        m.content, 
        u.id AS senderId, 
        u.username AS senderName
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.sender_id = ? OR m.receiver_id = ?
      ORDER BY m.created_at ASC
      `,
      [userId, userId]
    );

    const loggedInUserId = Number(userId);

    const messages: MessageResponse[] = rows.map((msg) => ({
      id: msg.id.toString(),
      senderName: msg.senderId === loggedInUserId ? "You" : msg.senderName,
      content: msg.content,
    }));

    return NextResponse.json(messages);
  } catch (err) {
    console.error("GET /api/messages error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
