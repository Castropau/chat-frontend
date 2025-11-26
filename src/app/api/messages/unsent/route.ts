// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function POST(req: Request) {
//   try {
//     const { messageId } = await req.json();
//     if (!messageId) return NextResponse.json({ ok: false, error: "Missing messageId" });

//     const pool = getPool();

//     // Mark the message as unsent
//     await pool.query("UPDATE messages SET unsent = 1 WHERE id = ?", [messageId]);

//     // Fetch the updated message
//     const [rows]: any = await pool.query("SELECT * FROM messages WHERE id = ?", [messageId]);
//     const message = rows[0];

//     // Notify socket server for realtime update
//     await fetch("http://localhost:4000/unsendMessage", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(message),
//     });

//     return NextResponse.json({ ok: true, message });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ ok: false, error: "Internal server error" });
//   }
// }
import { NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ----- Interface Types -----
export interface MessageRow extends RowDataPacket {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: Date;
  unsent: number;
}

export interface MessageUnsendRequest {
  messageId: number;
}

export interface MessageUnsendResponse {
  ok: boolean;
  message?: MessageRow;
  error?: string;
}
const socketUrl = process.env.SOCKET_URL;
// ----- API Route -----
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: MessageUnsendRequest = await req.json();
    const { messageId } = body;

    if (!messageId) {
      const errorResponse: MessageUnsendResponse = {
        ok: false,
        error: "Missing messageId",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const pool = getPool();

    // Mark the message as unsent
    await pool.query<ResultSetHeader>(
      "UPDATE messages SET unsent = 1 WHERE id = ?",
      [messageId]
    );

    // Fetch the updated message
    const [rows] = await pool.query<MessageRow[] & RowDataPacket[]>(
      "SELECT * FROM messages WHERE id = ?",
      [messageId]
    );

    if (rows.length === 0) {
      const errorResponse: MessageUnsendResponse = {
        ok: false,
        error: "Message not found",
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const message = rows[0];

    // Notify socket server for realtime update
    // await fetch("http://localhost:4000/unsendMessage", {
    await fetch(`${socketUrl}/unsendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    const successResponse: MessageUnsendResponse = { ok: true, message };
    return NextResponse.json(successResponse);
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal server error";
    const errorResponse: MessageUnsendResponse = { ok: false, error: message };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

