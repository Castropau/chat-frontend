// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function POST(req: Request) {
//   const pool = getPool();

//   try {
//     const { senderId, receiverId, content } = await req.json();

//     if (!senderId || !receiverId || !content) {
//       return NextResponse.json(
//         { error: "Missing fields" },
//         { status: 400 }
//       );
//     }

//     // ✅ Insert message
//     const [result]: any = await pool.query(
//       "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
//       [senderId, receiverId, content]
//     );

//     return NextResponse.json({ ok: true, id: result.insertId });
//   } catch (err) {
//     console.error("POST /api/messages/send error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }







// done
// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function POST(req: Request) {
//   try {
//     const { senderId, receiverId, content } = await req.json();

//     if (!senderId || !receiverId || !content) {
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//     }

//     const pool = getPool();

//     // Insert message into database
//     const [result]: any = await pool.query(
//       "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
//       [senderId, receiverId, content]
//     );

//     const messageId = result.insertId;

//     // Optional: you can notify your socket server via fetch
//     // await fetch("http://localhost:4000/sendMessage", {
//     //   method: "POST",
//     //   headers: { "Content-Type": "application/json" },
//     //   body: JSON.stringify({ senderId, receiverId, content, id: messageId }),
//     // });

//     return NextResponse.json({ ok: true, id: messageId });
//   } catch (error) {
//     console.error("POST /api/messages/send error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";

// export async function POST(req: Request) {
//   try {
//     const { senderId, receiverId, content } = await req.json();

//     if (!senderId || !receiverId || !content) {
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//     }

//     const pool = getPool();

//     // Insert message into database
//     const [result]: any = await pool.query(
//       "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
//       [senderId, receiverId, content]
//     );

//     const messageId = result.insertId;

//     // Fetch sender info (username + avatar)
//     // const [userRows]: any = await pool.query(
//     //   "SELECT username, image AS avatar FROM users WHERE id = ?",
//     //   [senderId]
//     // );

//     // const sender = userRows[0];

//     // const message = {
//     //   id: messageId.toString(),
//     //   senderId,
//     //   receiverId,
//     //   senderName: "You",       // will display as "You" on sender side
//     //   avatar: sender.avatar,   // avatar URL
//     //   content,
//     //   created_at: new Date(),
//     // };
//     // Fetch sender info (username + avatar)
// const [userRows]: any = await pool.query(
//   "SELECT username, image AS avatar FROM users WHERE id = ?",
//   [senderId]
// );

// const sender = userRows[0];

// const message = {
//   id: messageId.toString(),
//   senderId,
//   receiverId,
//   senderName: "You",
//   avatar: sender.avatar, // include sender avatar
//   content,
//   created_at: new Date(),
// };


//     // Optional: notify your socket server
//     await fetch("http://localhost:4000/sendMessage", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(message),
//     });

//     return NextResponse.json({ ok: true, ...message });
//   } catch (error) {
//     console.error("POST /api/messages/send error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
}

export interface UserRow extends RowDataPacket {
  username: string;
  avatar: string | null;
}

export interface SendMessageRequest {
  senderId: number;
  receiverId: number;
  content: string;
}

export interface SendMessageResponse {
  // ok: boolean;
  id: string;
  senderId: number;
  receiverId: number;
  senderName: string;
  avatar: string | null;
  content: string;
  created_at: Date;
}

// ----- API Route -----
export async function POST(req: Request): Promise<NextResponse> {
  const socketUrl = process.env.SOCKET_URL;
  try {
    const body: SendMessageRequest = await req.json();
    const { senderId, receiverId, content } = body;

    if (!senderId || !receiverId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const pool = getPool();

    // Insert message into database
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
      [senderId, receiverId, content]
    );

    const messageId = result.insertId;

    // Fetch sender info (username + avatar)
    const [userRows] = await pool.query<UserRow[] & RowDataPacket[]>(
      "SELECT username, image AS avatar FROM users WHERE id = ?",
      [senderId]
    );

    const sender = userRows[0];

    const message: SendMessageResponse = {
        // ok: true,   
      id: messageId.toString(),
      senderId,
      receiverId,
      senderName: "You", // display as "You" for sender
      avatar: sender?.avatar || null,
      content,
      created_at: new Date(),
    };

    // Optional: notify your socket server
    // await fetch("http://localhost:4000/sendMessage", {
    await fetch(`${socketUrl}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    return NextResponse.json({ ok: true, ...message });
  } catch (error: unknown) {
    console.error("POST /api/messages/send error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
