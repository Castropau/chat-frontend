// import { getPool } from "@/lib/database/db";
// import { NextRequest, NextResponse } from "next/server";
// // import { getPool } from "@/lib/db"; // adjust the path

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const postId = searchParams.get("postId");

//   if (!postId) {
//     return NextResponse.json({ message: "postId is required" }, { status: 400 });
//   }

//   const pool = getPool();

//   try {
//     const [rows] = await pool.query(
//       "SELECT c.id, c.comment, c.created_at, u.username " +
//       "FROM comments c " +
//       "JOIN users u ON c.user_id = u.id " +
//       "WHERE c.post_id = ? " +
//       "ORDER BY c.created_at ASC",
//       [postId]
//     );

//     return NextResponse.json(rows);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { postId, userId, comment } = body;

//     if (!postId || !userId || !comment) {
//       return NextResponse.json(
//         { message: "postId, userId, and comment are required" },
//         { status: 400 }
//       );
//     }

//     const pool = getPool();

//     const [result] = await pool.query(
//       "INSERT INTO comments (post_id, user_id, comment, created_at) VALUES (?, ?, ?, NOW())",
//       [postId, userId, comment]
//     );

//     return NextResponse.json({ message: "Comment added", id: (result as any).insertId });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }
// import { getPool } from "@/lib/db";
// import { getPool } from "@/lib/database/db";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const pool = getPool();
//   try {
//     const { postId, userId, comment } = await req.json();
//     if (!postId || !userId || !comment)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     // Insert comment
//     const [result] = await pool.query(
//       "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)",
//       [postId, userId, comment]
//     );
// const [userRows] = await pool.query("SELECT username FROM users WHERE id = ?", [userId]);
// const username = userRows.length > 0 ? userRows[0].username : "Anonymous";
//     // Broadcast via Socket.IO server
//     // await fetch("http://localhost:4000/broadcast", {
//     //   method: "POST",
//     //   headers: { "Content-Type": "application/json" },
//     //   body: JSON.stringify({ postId, payload: { comment, userId } }),
//     // });
//     // /api/comment route (simplified)
// await fetch("http://localhost:4000/broadcast", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     postId,
//     // payload: { comment }, // do NOT include reactions here
//      payload: {
//       comment,
//       userId,
//       userName: username, // ✅ include username
//     },
//     type: "comment",
//   }),
// });


//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     console.error("POST /api/comments error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// export async function GET(req: Request) {
//   const pool = getPool();
//   try {
//     const { searchParams } = new URL(req.url);
//     const postId = searchParams.get("postId");
//     if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

//     const [rows] = await pool.query(
//       "SELECT c.id, c.comment, c.created_at, u.id AS userId, u.username AS userName FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC",
//       [postId]
//     );

//     return NextResponse.json(rows);
//   } catch (err) {
//     console.error("GET /api/comments error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

import { getPool } from "@/lib/database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const pool = getPool();
//   try {
//     const { postId, userId, comment } = await req.json();
//     if (!postId || !userId || !comment)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     // 1️⃣ Insert comment
//     const [result]: any = await pool.query(
//       "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)",
//       [postId, userId, comment]
//     );

//     // 2️⃣ Get commenter username
//     const [userRows]: any = await pool.query("SELECT username FROM users WHERE id = ?", [userId]);
//     const username = userRows.length > 0 ? userRows[0].username : "Anonymous";

//     // 3️⃣ Get post owner to send notification
//     const [postRows]: any = await pool.query("SELECT user_id FROM goals WHERE id = ?", [postId]);
//     const postOwnerId = postRows.length > 0 ? postRows[0].user_id : null;

//     // 4️⃣ If commenter is not the post owner, insert notification
//     if (postOwnerId && postOwnerId !== userId) {
//       const message = `${username} commented on your post`;
//       await pool.query(
//         "INSERT INTO notifications (user_id, actor_id, post_id, type, message) VALUES (?, ?, ?, 'comment', ?)",
//         [postOwnerId, userId, postId, message]
//       );

//       // 5️⃣ Broadcast notification to post owner
//       await fetch("http://localhost:4000/broadcast", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           postId,
//           payload: {
//             userId: postOwnerId,
//             message,
//             type: "notification",
//           },
//           type: "notification",
//         }),
//       });
//     }

//     // 6️⃣ Broadcast comment update
//     await fetch("http://localhost:4000/broadcast", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         postId,
//         payload: {
//           comment,
//           userId,
//           userName: username,
//         },
//         type: "comment",
//       }),
//     });

//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     console.error("POST /api/comments error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }




// export async function POST(req: Request) {
//   const pool = getPool();
//   try {
//     const { postId, userId, comment } = await req.json();
//     if (!postId || !userId || !comment)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     // 1️⃣ Insert comment
//     const [result]: any = await pool.query(
//       "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)",
//       [postId, userId, comment]
//     );

//     // 2️⃣ Get commenter username
//     const [userRows]: any = await pool.query(
//       "SELECT username FROM users WHERE id = ?",
//       [userId]
//     );
//     const username = userRows.length > 0 ? userRows[0].username : "Anonymous";

//     // 3️⃣ Get post owner
//     const [postRows]: any = await pool.query(
//       "SELECT user_id, title FROM goals WHERE id = ?",
//       [postId]
//     );
//     const postOwnerId = postRows.length > 0 ? postRows[0].user_id : null;
//         const title = postRows.length > 0 ? postRows[0].title : "";


//     // 4️⃣ If commenter != post owner → add notification
//     if (postOwnerId && postOwnerId !== userId) {
//       const message = `${username} commented on your post`;

//       const [notifResult]: any = await pool.query(
//         "INSERT INTO notifications (user_id, actor_id, post_id, type, message) VALUES (?, ?, ?, 'comment', ?)",
//         [postOwnerId, userId, postId, message]
//       );

//       const insertedId = notifResult.insertId;

//       // 🔔 Send real-time notification
//       // await fetch("http://localhost:4000/notify", {
//       //   method: "POST",
//       //   headers: { "Content-Type": "application/json" },
//       //   body: JSON.stringify({
//       //     userId: postOwnerId,
//       //     notification: {
//       //       id: insertedId,
//       //       message,
//       //       title,
//       //       created_at: new Date(),
//       //       is_read: false,
//       //     },
//       //   }),
//       // });
//       await fetch("http://localhost:4000/notify", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     userId: postOwnerId,
//     notification: {
//       id: insertedId,
//       message,
//       title: title,
//       created_at: new Date(),
//       is_read: false,
//     },
//     type: "comment",
//     post_id: postId,  // <-- Add this
//     actorName: username, // optional, for display
//   }),
// });

//     }

//     // 5️⃣ Broadcast new comment
//     await fetch("http://localhost:4000/broadcast", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         postId,
//         payload: { comment, userId, userName: username },
//         type: "comment",
//       }),
//     });

//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     console.error("POST /api/comments error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
  interface UserRow extends RowDataPacket {
  id: number;
  username: string;
}

interface PostRow extends RowDataPacket {
  user_id: number;
  title: string;
}

interface CommentRequest {
  postId: number;
  userId: number;
  comment: string;
}
const socketUrl = process.env.SOCKET_URL;
export async function POST(req: Request) {
  const pool = getPool();

  try {
    const body: CommentRequest = await req.json();
    const { postId, userId, comment } = body;

    if (!postId || !userId || !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1️⃣ Insert comment
    // const [result] = await pool.query<ResultSetHeader>(
    //   "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)",
    //   [postId, userId, comment]
    // );

    await pool.query<ResultSetHeader>(
  "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)",
  [postId, userId, comment]
);
    // const insertId = result.insertId;
    // 2️⃣ Get commenter username
    const [userRows] = await pool.query<UserRow[]>(
      "SELECT username, image AS userImage  FROM users WHERE id = ?",
      [userId]
    );
    const username = userRows.length > 0 ? userRows[0].username : "Anonymous";

    // 3️⃣ Get post owner info
    const [postRows] = await pool.query<PostRow[]>(
      "SELECT user_id, title FROM goals WHERE id = ?",
      [postId]
    );
    const postOwnerId = postRows.length > 0 ? postRows[0].user_id : null;
    const title = postRows.length > 0 ? postRows[0].title : "";

    // 4️⃣ Add notification if commenter is not post owner
    if (postOwnerId && postOwnerId !== userId) {
      const message = `${username} commented on your post`;

      const [notifResult] = await pool.query<ResultSetHeader>(
        "INSERT INTO notifications (user_id, actor_id, post_id, type, message) VALUES (?, ?, ?, 'comment', ?)",
        [postOwnerId, userId, postId, message]
      );

      const insertedId = notifResult.insertId;

      // 🔔 Send real-time notification
      // await fetch("http://localhost:4000/notify", {
            await fetch(`${socketUrl}/notify`, {


        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: postOwnerId,
          notification: {
            id: insertedId,
            message,
            title,
            created_at: new Date(),
            is_read: false,
          },
          type: "comment",
          post_id: postId,
          actorName: username,
        }),
      });
    }

    // 5️⃣ Broadcast new comment
    // await fetch("http://localhost:4000/broadcast", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     postId,
    //     payload: { comment, userId, userName: username },
    //     type: "comment",
    //   }),
    // });
    // 5️⃣ Broadcast new comment
// await fetch("http://localhost:4000/broadcast", {
await fetch(`${socketUrl}/broadcast`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    postId,
    payload: {
      comment,
      userId,
      userName: username,
      userImage:
        userRows.length > 0 && userRows[0].userImage
          ? userRows[0].userImage
          : "/default-avatar.png",
    },
    type: "comment",
  }),
});


    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/comments error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}








export async function GET(req: Request) {
  const pool = getPool();
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

    const [rows] = await pool.query(
      `SELECT 
        c.id, c.comment, c.created_at, 
        u.id AS userId, u.username AS userName,
        u.image AS userImage 
      FROM comments c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.post_id = ? 
      ORDER BY c.created_at ASC`,
      [postId]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/comments error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

