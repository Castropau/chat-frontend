import { getPool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// import { getPool } from "@/lib/db";

// 🟢 ADD OR UPDATE REACTION
// export async function POST(req: Request) {
//   const pool = getPool();

//   try {
//     const { postId, emojiId, userId } = await req.json();
//     if (!postId || !emojiId || !userId)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     // ✅ 1️⃣ Check if user already reacted
//     const [existing]: any = await pool.query(
//       "SELECT emoji_id FROM reactions WHERE post_id = ? AND user_id = ?",
//       [postId, userId]
//     );
//     const existingReaction = existing[0];

//     // ✅ 2️⃣ Insert or update reaction
//     await pool.query(
//       "INSERT INTO reactions (post_id, user_id, emoji_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE emoji_id = ?",
//       [postId, userId, emojiId, emojiId]
//     );

//     // ✅ 3️⃣ Get reactor username
//     const [userRows]: any = await pool.query("SELECT username FROM users WHERE id = ?", [userId]);
//     const username = userRows.length > 0 ? userRows[0].username : "Anonymous";

//     // ✅ 4️⃣ Get post owner + title
//     const [postRows]: any = await pool.query("SELECT user_id, title FROM goals WHERE id = ?", [postId]);
//     const postOwnerId = postRows.length > 0 ? postRows[0].user_id : null;
//     const title = postRows.length > 0 ? postRows[0].title : "";

//     // ✅ 5️⃣ Manage notification (insert, update)
//     if (postOwnerId && postOwnerId !== userId) {
//       const message = `${username} reacted to your post`;

//       // Check if notification already exists
//       const [notifExists]: any = await pool.query(
//         "SELECT id FROM notifications WHERE user_id = ? AND actor_id = ? AND post_id = ? AND type = 'reaction' LIMIT 1",
//         [postOwnerId, userId, postId]
//       );

//       let notifId;
//       let action = "new";

//       if (notifExists.length > 0) {
//         // ✅ Update existing notification
//         await pool.query(
//           "UPDATE notifications SET message = ?, is_read = 0, created_at = NOW() WHERE id = ?",
//           [message, notifExists[0].id]
//         );
//         notifId = notifExists[0].id;
//         action = "update";
//       } else {
//         // ✅ Insert new notification
//         const [notifResult]: any = await pool.query(
//           `INSERT INTO notifications (user_id, actor_id, post_id, type, message, is_read, created_at)
//            VALUES (?, ?, ?, 'reaction', ?, 0, NOW())`,
//           [postOwnerId, userId, postId, message]
//         );
//         notifId = notifResult.insertId;
//         action = "new";
//       }

//       // ✅ Send realtime notification
//       await fetch("http://localhost:4000/notify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: postOwnerId,
//           notification: {
//             id: notifId,
//             message,
//             title,
//             created_at: new Date(),
//             is_read: false,
//             type: "reaction",
//           },
//           action, // 👈 important: send "new" or "update"
//         }),
//       });
//     }

//     // ✅ 6️⃣ Fetch updated reaction counts
//     const [rows] = await pool.query(
//       `SELECT r.emoji_id AS emojiId, e.emoji, COUNT(*) AS count
//        FROM reactions r
//        JOIN emojis e ON r.emoji_id = e.id
//        WHERE r.post_id = ?
//        GROUP BY r.emoji_id, e.emoji`,
//       [postId]
//     );

//     // ✅ 7️⃣ Broadcast reaction update to post room
//     await fetch("http://localhost:4000/broadcast", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         postId,
//         payload: { reactions: rows },
//         type: "reaction",
//       }),
//     });

//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     console.error("POST /api/reaction error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// export async function POST(req: Request) {
//   const pool = getPool();

//   try {
//     const { postId, emojiId, userId } = await req.json();
//     if (!postId || !emojiId || !userId)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     // 1️⃣ Get reactor info
//     const [userRows]: any = await pool.query("SELECT username FROM users WHERE id = ?", [userId]);
//     const username = userRows.length > 0 ? userRows[0].username : "Anonymous";

//     // 2️⃣ Get post owner and title
//     const [postRows]: any = await pool.query("SELECT user_id, title FROM goals WHERE id = ?", [postId]);
//     const postOwnerId = postRows.length > 0 ? postRows[0].user_id : null;
//     const title = postRows.length > 0 ? postRows[0].title : "";

//     // 3️⃣ Get emoji symbol
//     const [emojiRows]: any = await pool.query("SELECT emoji FROM emojis WHERE id = ?", [emojiId]);
//     const emojiSymbol = emojiRows.length > 0 ? emojiRows[0].emoji : "👍";

//     // 4️⃣ Detect existing reaction
//     const [existingReaction]: any = await pool.query(
//       "SELECT emoji_id FROM reactions WHERE post_id = ? AND user_id = ? LIMIT 1",
//       [postId, userId]
//     );

//     let isNew = false;
//     let isChanged = false;

//     if (existingReaction.length === 0) {
//       // ➕ New reaction
//       await pool.query(
//         "INSERT INTO reactions (post_id, user_id, emoji_id) VALUES (?, ?, ?)",
//         [postId, userId, emojiId]
//       );
//       isNew = true;
//     } else if (existingReaction[0].emoji_id !== emojiId) {
//       // 🔁 Changed reaction
//       await pool.query(
//         "UPDATE reactions SET emoji_id = ? WHERE post_id = ? AND user_id = ?",
//         [emojiId, postId, userId]
//       );
//       isChanged = true;
//     }

//     // 5️⃣ Manage notification if not reacting to own post
//     if (postOwnerId && postOwnerId !== userId) {
//       const message = isNew
//         ? `${username} reacted ${emojiSymbol} to your post`
//         : `${username} changed reaction to ${emojiSymbol} on your post`;

//       // Check if notification exists
//       const [notifExists]: any = await pool.query(
//         "SELECT id FROM notifications WHERE user_id = ? AND actor_id = ? AND post_id = ? AND type = 'reaction' LIMIT 1",
//         [postOwnerId, userId, postId]
//       );

//       let notifId;

//       if (notifExists.length > 0) {
//         // 🟡 Update notification
//         await pool.query(
//           "UPDATE notifications SET message = ?, is_read = 0, created_at = NOW() WHERE id = ?",
//           [message, notifExists[0].id]
//         );
//         notifId = notifExists[0].id;
//       } else {
//         // 🟢 Insert new notification
//         const [notifResult]: any = await pool.query(
//           `INSERT INTO notifications (user_id, actor_id, post_id, type, message, is_read, created_at)
//            VALUES (?, ?, ?, 'reaction', ?, 0, NOW())`,
//           [postOwnerId, userId, postId, message]
//         );
//         notifId = notifResult.insertId;
//       }

//       // 6️⃣ Send realtime update to user
//       await fetch("http://localhost:4000/notify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: postOwnerId,
//           notification: {
//             id: notifId,
//             message,
//             title,
//             created_at: new Date(),
//             is_read: false,
//             type: "reaction",
//              post_id: postId, // ✅ add this
//             actorName: username, // optional but useful
//           },
//           action: isNew ? "new" : "update",
//         }),
//       });
//     }

//     // 7️⃣ Refresh and broadcast updated reaction counts
//     const [rows] = await pool.query(
//       `SELECT r.emoji_id AS emojiId, e.emoji, COUNT(*) AS count
//        FROM reactions r
//        JOIN emojis e ON r.emoji_id = e.id
//        WHERE r.post_id = ?
//        GROUP BY r.emoji_id, e.emoji`,
//       [postId]
//     );

//     await fetch("http://localhost:4000/broadcast", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         postId,
//         payload: { reactions: rows },
//         type: "reaction",
//       }),
//     });

//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     console.error("POST /api/reaction error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }



// ----- Interface Types -----
export interface UserRow extends RowDataPacket {
  id: number;
  username: string;
}

export interface PostRow extends RowDataPacket {
  user_id: number;
  title: string;
}

export interface EmojiRow extends RowDataPacket {
  emoji: string;
}

export interface ReactionRow extends RowDataPacket {
  emoji_id: number;
}

export interface NotificationRow extends RowDataPacket {
  id: number;
}

export interface ReactionCountsRow extends RowDataPacket {
  emojiId: number;
  emoji: string;
  count: number;
}

export interface PostReactionRequest {
  postId: number;
  emojiId: number;
  userId: number;
}

export interface ApiError {
  error: string;
}

// ----- API Route -----

const socketUrl = process.env.SOCKET_URL;
export async function POST(req: Request): Promise<NextResponse> {
  const pool = getPool();

  try {
    const body: PostReactionRequest = await req.json();
    const { postId, emojiId, userId } = body;

    if (!postId || !emojiId || !userId) {
      const errorResponse: ApiError = { error: "Missing fields" };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 1️⃣ Get reactor info
    const [userRows] = await pool.query<UserRow[] & RowDataPacket[]>(
      "SELECT username FROM users WHERE id = ?",
      [userId]
    );
    const username = userRows.length > 0 ? userRows[0].username : "Anonymous";

    // 2️⃣ Get post owner and title
    const [postRows] = await pool.query<PostRow[] & RowDataPacket[]>(
      "SELECT user_id, title FROM goals WHERE id = ?",
      [postId]
    );
    const postOwnerId = postRows.length > 0 ? postRows[0].user_id : null;
    const title = postRows.length > 0 ? postRows[0].title : "";

    // 3️⃣ Get emoji symbol
    const [emojiRows] = await pool.query<EmojiRow[] & RowDataPacket[]>(
      "SELECT emoji FROM emojis WHERE id = ?",
      [emojiId]
    );
    const emojiSymbol = emojiRows.length > 0 ? emojiRows[0].emoji : "👍";

    // 4️⃣ Detect existing reaction
    const [existingReaction] = await pool.query<ReactionRow[] & RowDataPacket[]>(
      "SELECT emoji_id FROM reactions WHERE post_id = ? AND user_id = ? LIMIT 1",
      [postId, userId]
    );

    let isNew = false;
    // let isChanged = false;

    if (existingReaction.length === 0) {
      await pool.query<ResultSetHeader>(
        "INSERT INTO reactions (post_id, user_id, emoji_id) VALUES (?, ?, ?)",
        [postId, userId, emojiId]
      );
      isNew = true;
    } else if (existingReaction[0].emoji_id !== emojiId) {
      await pool.query<ResultSetHeader>(
        "UPDATE reactions SET emoji_id = ? WHERE post_id = ? AND user_id = ?",
        [emojiId, postId, userId]
      );
      // isChanged = true;
    }

    // 5️⃣ Manage notification if not reacting to own post
    if (postOwnerId && postOwnerId !== userId) {
      const message = isNew
        ? `${username} reacted ${emojiSymbol} to your post`
        : `${username} changed reaction to ${emojiSymbol} on your post`;

      const [notifExists] = await pool.query<NotificationRow[] & RowDataPacket[]>(
        "SELECT id FROM notifications WHERE user_id = ? AND actor_id = ? AND post_id = ? AND type = 'reaction' LIMIT 1",
        [postOwnerId, userId, postId]
      );

      let notifId: number;

      if (notifExists.length > 0) {
        await pool.query<ResultSetHeader>(
          "UPDATE notifications SET message = ?, is_read = 0, created_at = NOW() WHERE id = ?",
          [message, notifExists[0].id]
        );
        notifId = notifExists[0].id;
      } else {
        const [notifResult] = await pool.query<ResultSetHeader>(
          `INSERT INTO notifications (user_id, actor_id, post_id, type, message, is_read, created_at)
           VALUES (?, ?, ?, 'reaction', ?, 0, NOW())`,
          [postOwnerId, userId, postId, message]
        );
        notifId = notifResult.insertId;
      }

      // Send realtime update
      // await fetch("http://localhost:4000/notify", {
      await fetch(`${socketUrl}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: postOwnerId,
          notification: {
            id: notifId,
            message,
            title,
            created_at: new Date(),
            is_read: false,
            type: "reaction",
            post_id: postId,
            actorName: username,
          },
          action: isNew ? "new" : "update",
        }),
      });
    }

    // 6️⃣ Refresh and broadcast updated reaction counts
    const [rows] = await pool.query<ReactionCountsRow[] & RowDataPacket[]>(
      `SELECT r.emoji_id AS emojiId, e.emoji, COUNT(*) AS count
       FROM reactions r
       JOIN emojis e ON r.emoji_id = e.id
       WHERE r.post_id = ?
       GROUP BY r.emoji_id, e.emoji`,
      [postId]
    );

    // await fetch("http://localhost:4000/broadcast", {
    await fetch(`${socketUrl}/broadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        payload: { reactions: rows },
        type: "reaction",
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("POST /api/reaction error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    const errorResponse: ApiError = { error: message };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// 🧹 DELETE REACTION
// export async function DELETE(req: Request) {
//   const pool = getPool();

//   try {
//     const { postId, emojiId, userId } = await req.json();
//     if (!postId || !emojiId || !userId)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     // ✅ 1️⃣ Delete reaction
//     await pool.query("DELETE FROM reactions WHERE post_id = ? AND user_id = ? AND emoji_id = ?", [
//       postId,
//       userId,
//       emojiId,
//     ]);

//     // ✅ 2️⃣ Get post owner + title
//     const [postRows]: any = await pool.query("SELECT user_id, title FROM goals WHERE id = ?", [postId]);
//     const postOwnerId = postRows.length > 0 ? postRows[0].user_id : null;
//     const title = postRows.length > 0 ? postRows[0].title : "";

//     if (postOwnerId && postOwnerId !== userId) {
//       // ✅ Check and delete related notification
//       const [notifRows]: any = await pool.query(
//         "SELECT id FROM notifications WHERE user_id = ? AND actor_id = ? AND post_id = ? AND type = 'reaction' LIMIT 1",
//         [postOwnerId, userId, postId]
//       );

//       if (notifRows.length > 0) {
//         const notifId = notifRows[0].id;

//         await pool.query("DELETE FROM notifications WHERE id = ?", [notifId]);

//         // ✅ Send realtime delete
//         await fetch("http://localhost:4000/notify", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             userId: postOwnerId,
//             notification: { id: notifId, type: "reaction" },
//             action: "delete", // 👈 important
//           }),
//         });
//       }
//     }

//     // ✅ 3️⃣ Refresh reaction counts
//     const [rows] = await pool.query(
//       `SELECT r.emoji_id AS emojiId, e.emoji, COUNT(*) AS count
//        FROM reactions r
//        JOIN emojis e ON r.emoji_id = e.id
//        WHERE r.post_id = ?
//        GROUP BY r.emoji_id, e.emoji`,
//       [postId]
//     );

//     // ✅ 4️⃣ Broadcast updated reactions
//     await fetch("http://localhost:4000/broadcast", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         postId,
//         payload: { reactions: rows },
//         type: "reaction",
//       }),
//     });

//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     console.error("DELETE /api/reaction error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


// ----- Interface Types -----
export interface ReactionCountRow extends RowDataPacket {
  emojiId: number;
  emoji: string;
  count: number;
}

export interface PostRow extends RowDataPacket {
  user_id: number;
  title: string;
}

export interface NotificationRow extends RowDataPacket {
  id: number;
}

export interface DeleteReactionRequest {
  postId: number;
  emojiId: number;
  userId: number;
}

export interface ApiError {
  error: string;
}

// ----- API Route -----
export async function DELETE(req: Request): Promise<NextResponse> {
  const pool = getPool();

  try {
    const body: DeleteReactionRequest = await req.json();
    const { postId, emojiId, userId } = body;

    if (!postId || !emojiId || !userId) {
      const errorResponse: ApiError = { error: "Missing fields" };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 1️⃣ Delete reaction
    await pool.query(
      "DELETE FROM reactions WHERE post_id = ? AND user_id = ? AND emoji_id = ?",
      [postId, userId, emojiId]
    );

    // 2️⃣ Get post owner + title
    const [postRows] = await pool.query<PostRow[] & RowDataPacket[]>(
      "SELECT user_id, title FROM goals WHERE id = ?",
      [postId]
    );

    const postOwnerId = postRows.length > 0 ? postRows[0].user_id : null;
    // const title = postRows.length > 0 ? postRows[0].title : "";

    if (postOwnerId && postOwnerId !== userId) {
      // Check and delete related notification
      const [notifRows] = await pool.query<NotificationRow[] & RowDataPacket[]>(
        "SELECT id FROM notifications WHERE user_id = ? AND actor_id = ? AND post_id = ? AND type = 'reaction' LIMIT 1",
        [postOwnerId, userId, postId]
      );

      if (notifRows.length > 0) {
        const notifId = notifRows[0].id;
        await pool.query("DELETE FROM notifications WHERE id = ?", [notifId]);

        // Send realtime delete
        // await fetch("http://localhost:4000/notify", {
        await fetch(`${socketUrl}/notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: postOwnerId,
            notification: { id: notifId, type: "reaction" },
            action: "delete",
          }),
        });
      }
    }

    // 3️⃣ Refresh reaction counts
    const [rows] = await pool.query<ReactionCountRow[] & RowDataPacket[]>(
      `SELECT r.emoji_id AS emojiId, e.emoji, COUNT(*) AS count
       FROM reactions r
       JOIN emojis e ON r.emoji_id = e.id
       WHERE r.post_id = ?
       GROUP BY r.emoji_id, e.emoji`,
      [postId]
    );

    // 4️⃣ Broadcast updated reactions
    // await fetch("http://localhost:4000/broadcast", {
    await fetch(`${socketUrl}/broadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        payload: { reactions: rows },
        type: "reaction",
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("DELETE /api/reaction error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    const errorResponse: ApiError = { error: message };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}


// 🟢 GET — get user’s current reaction on a post
// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const postId = searchParams.get("postId");
//     const userId = searchParams.get("userId");

//     if (!postId || !userId)
//       return NextResponse.json({ error: "postId and userId required" }, { status: 400 });

//     const pool = getPool();

//     const [rows]: any = await pool.query(
//       `SELECT r.emoji_id, e.emoji
//        FROM reactions r
//        JOIN emojis e ON r.emoji_id = e.id
//        WHERE r.post_id = ? AND r.user_id = ?
//        LIMIT 1`,
//       [postId, userId]
//     );

//     if (rows.length === 0) return NextResponse.json({ emojiId: null, emoji: null });

//     const { emoji_id, emoji } = rows[0];
//     return NextResponse.json({ emojiId: emoji_id, emoji });
//   } catch (err) {
//     console.error("Error fetching reaction:", err);
//     return NextResponse.json({ error: "Failed to fetch reaction" }, { status: 500 });
//   }
// }
export interface ReactionRow extends RowDataPacket {
  emoji_id: number;
  emoji: string;
}

export interface ReactionResponse {
  emojiId: number | null;
  emoji: string | null;
}

export interface ApiError {
  error: string;
}

// ----- API Route -----
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const userId = searchParams.get("userId");

    if (!postId || !userId) {
      const errorResponse: ApiError = { error: "postId and userId required" };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const pool = getPool();

    const [rows] = await pool.query<ReactionRow[] & RowDataPacket[]>(
      `SELECT r.emoji_id, e.emoji
       FROM reactions r
       JOIN emojis e ON r.emoji_id = e.id
       WHERE r.post_id = ? AND r.user_id = ?
       LIMIT 1`,
      [postId, userId]
    );

    if (rows.length === 0) {
      const response: ReactionResponse = { emojiId: null, emoji: null };
      return NextResponse.json(response);
    }

    const { emoji_id, emoji } = rows[0];
    const response: ReactionResponse = { emojiId: emoji_id, emoji };

    return NextResponse.json(response);
  } catch (err: unknown) {
    console.error("Error fetching reaction:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch reaction";
    const errorResponse: ApiError = { error: message };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
