import { getPool } from "@/lib/database/db";
import axios from "axios";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
// import { RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";
// import { getPool } from "@/lib/db";

// export async function POST(req: Request) {
//   try {
//     const { followerId, followingId } = await req.json();

//     if (!followerId || !followingId) {
//       return NextResponse.json(
//         { error: "Missing followerId or followingId" },
//         { status: 400 }
//       );
//     }

//     const pool = getPool();

//     // 1. Check if already following
//     const [exists] = await pool.execute(
//       "SELECT id FROM follows WHERE follower_id = ? AND following_id = ?",
//       [followerId, followingId]
//     );

//     const isFollowing = Array.isArray(exists) && exists.length > 0;

//     if (isFollowing) {
//       // UNFOLLOW
//       await pool.execute(
//         "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
//         [followerId, followingId]
//       );

//       return NextResponse.json({
//         status: "unfollowed",
//         isFollowing: false,
//       });
//     } else {
//       // FOLLOW
//       await pool.execute(
//         "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)",
//         [followerId, followingId]
//       );

//       return NextResponse.json({
//         status: "followed",
//         isFollowing: true,
//       });
//     }
//   } catch (err) {
//     console.error("Follow API error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// interface UserRow extends RowDataPacket {
//   username: string;
// }
// export async function POST(req: Request) {
//   try {
//     const { followerId, followingId } = await req.json();
//     const pool = getPool();

//     // Check if already following
//     const [rows] = await pool.execute(
//       `SELECT * FROM follows WHERE follower_id = ? AND following_id = ?`,
//       [followerId, followingId]
//     );

//     // if (Array.isArray(rows) && rows.length > 0) {
//     //   // UNFOLLOW
//     //   await pool.execute(
//     //     `DELETE FROM follows WHERE follower_id = ? AND following_id = ?`,
//     //     [followerId, followingId]
//     //   );
//     //   await pool.execute(
//     //     `DELETE FROM notifications 
//     //      WHERE user_id = ? AND actor_id = ? AND type = 'follow'`,
//     //     [followingId, followerId]
//     //   );

//     //   // Optionally: notify socket clients about deletion
//     //   await axios.post(`${process.env.SOCKET_URL}/notify`, {
//     //     userId: followingId,
//     //     action: "delete",
//     //     notification: {
//     //       actor_id: followerId,
//     //       type: "follow",
//     //     },
//     //   });

//     //   return NextResponse.json({ isFollowing: false });
//     // }
//     if (Array.isArray(rows) && rows.length > 0) {
//   // UNFOLLOW
//   await pool.execute(
//     `DELETE FROM follows WHERE follower_id = ? AND following_id = ?`,
//     [followerId, followingId]
//   );

//   await pool.execute(
//     `DELETE FROM notifications 
//      WHERE user_id = ? AND actor_id = ? AND type = 'follow'`,
//     [followingId, followerId]
//   );

//   // Emit socket notification about deletion
//   try {
//     await axios.post(`${process.env.SOCKET_URL}/notify`, {
//       userId: followingId,
//       action: "delete",
//       notification: {
//         actor_id: followerId,
//         type: "follow",
//       },
//     });
//   } catch (err) {
//     console.error("Socket notify error:", err);
//   }

//   // ✅ Always return JSON
//   return NextResponse.json({ isFollowing: false });
// }



//     //   return NextResponse.json({ isFollowing: false });
//     // }

//     // FOLLOW
//     await pool.execute(
//       `INSERT INTO follows (follower_id, following_id)
//        VALUES (?, ?)`,
//       [followerId, followingId]
//     );

//     // 🔥 ADD NOTIFICATION
//     // await pool.execute(
//     //   `INSERT INTO notifications 
//     //     (user_id, actor_id, post_id, type, message, is_read, emoji_id)
//     //    VALUES (?, ?, NULL, 'follow', ?, 0, NULL)`,
//     //   [
//     //     followingId,                 // receiver
//     //     followerId,                  // actor
//     //     `User ${followerId} followed you`, 
//     //   ]
//     // );
//    const [actorRows] = await pool.query(
//   `SELECT firstname, lastname FROM users WHERE id = ?`,
//   [followerId]
// ) as RowDataPacket[]; // ✅ assert type

// if (!actorRows || actorRows.length === 0) {
//   throw new Error("Actor not found");
// }
// // const [followerRows]: any = await pool.query(
// //   `SELECT username FROM users WHERE id = ?`,
// //   [followerId]
// // );
// const [followerRows] = await pool.query<UserRow[]>(
//   `SELECT username FROM users WHERE id = ?`,
//   [followerId]
// );
// // const followerUsername = followerRows[0]?.username || "Someone";
// const followerUsername = followerRows[0]?.username || "";


// // const actor = actorRows[0] as { firstname: string; lastname: string };
// // const actorName = `${actor.firstname} ${actor.lastname}`;
// await pool.query(
//   `INSERT INTO notifications 
//     (user_id, actor_id, type, message, is_read, created_at, updated_at)
//    VALUES (?, ?, 'follow', ?, 0, NOW(), NOW())`,
//   [
//     followingId,            // user being followed (receiver)
//     followerId,              // the one who followed (actor)
//     `${followerUsername} started following you.`
//   ]
// );

// // fetch the new notification
// // const [notifRows] = await pool.query(
// //   `SELECT 
// //       n.id,
// //       n.message,
// //       n.created_at,
// //       n.updated_at,
// //       n.is_read,
// //       n.type,
// //       a.username AS actorName,
// //       null AS title,
// //       null AS post_id
// //     FROM notifications n
// //     JOIN users a ON a.id = n.actor_id
// //     WHERE n.user_id = ? AND n.actor_id = ? AND n.type = 'follow'
// //     ORDER BY n.id DESC
// //     LIMIT 1`,
// //   [followingId, followerId]
// // );
// const [notifRows] = await pool.query(
//   `SELECT 
//       n.id,
//       n.message,
//       n.created_at,
//       n.updated_at,
//       n.is_read,
//       n.type,
//       a.username AS actorName,
//       NULL AS title,
//       NULL AS post_id
//     FROM notifications n
//     JOIN users a ON a.id = n.actor_id
//     WHERE n.user_id = ? AND n.actor_id = ? AND n.type = 'follow'
//     ORDER BY n.id DESC
//     LIMIT 1`,
//   [followingId, followerId]
// ) as RowDataPacket[]; // ✅ assert type

// const notif = notifRows[0];

// // 🔥 Emit via your socket server
// await axios.post(`${process.env.SOCKET_URL}/notify`, {
//   userId: followingId,
//   action: "new",
//   notification: notif,
//   type: "follow",
//   post_id: null,
//   title: "",
//   actorName: notif.actorName,
// });
//     return NextResponse.json({ isFollowing: true });
//   } catch (err) {
//     console.error("Follow error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
interface UserRow extends RowDataPacket {
  username: string;
}

interface NotificationRow extends RowDataPacket {
  id: number;
  message: string;
  created_at: string; // or Date if you convert
  updated_at: string;
  type: string;
}
interface FollowRequestBody {
  followerId: number;
  followingId: number;
}

export async function POST(req: Request) {
  try {
    const { followerId, followingId }: FollowRequestBody = await req.json();

    if (!followerId || !followingId) {
      return NextResponse.json({ error: "Missing followerId or followingId" }, { status: 400 });
    }

    const pool = getPool();

    // Check if already following
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM follows WHERE follower_id = ? AND following_id = ?`,
      [followerId, followingId]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      // Already following → unfollow
      await pool.execute(`DELETE FROM follows WHERE follower_id = ? AND following_id = ?`, [followerId, followingId]);

      // Delete associated notification
      await pool.execute(
        `DELETE FROM notifications WHERE user_id = ? AND actor_id = ? AND type = 'follow'`,
        [followingId, followerId]
      );

      // Emit socket notification for deletion
      try {
        await axios.post(`${process.env.SOCKET_URL}/notify`, {
          userId: followingId,
          action: "delete",
          notification: { actor_id: followerId, type: "follow" },
        });
      } catch (err) {
        console.error("Socket notify error (delete):", err);
      }

      return NextResponse.json({ isFollowing: false });
    }

    // INSERT follow
    await pool.execute(`INSERT INTO follows (follower_id, following_id) VALUES (?, ?)`, [followerId, followingId]);

    // Get follower username
    const [followerRows] = await pool.query<UserRow[]>(
      `SELECT username FROM users WHERE id = ?`,
      [followerId]
    );

    const followerUsername = followerRows[0]?.username ?? "Someone";

    // Insert notification
    const [notifResult] = await pool.query<ResultSetHeader>(
      `INSERT INTO notifications (user_id, actor_id, type, message, is_read, created_at, updated_at)
       VALUES (?, ?, 'follow', ?, 0, NOW(), NOW())`,
      [followingId, followerId, `${followerUsername} started following you.`]
    );

    // Fetch the inserted notification
    const [notifRows] = await pool.query<NotificationRow[]>(
      `SELECT id, message, created_at, updated_at, type FROM notifications WHERE id = ?`,
      [notifResult.insertId]
    );

    const notif = notifRows[0];

    // Emit socket notification
    try {
      await axios.post(`${process.env.SOCKET_URL}/notify`, {
        userId: followingId,
        action: "new",
        notification: notif,
        type: "follow",
        post_id: null,
        title: "",
        actorName: followerUsername,
      });
    } catch (err) {
      console.error("Socket notify error (new):", err);
    }

    return NextResponse.json({ isFollowing: true });
  } catch (err) {
    console.error("Follow POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const followerId = searchParams.get("followerId");
//     const followingId = searchParams.get("followingId");

//     if (!followerId || !followingId) {
//       return NextResponse.json(
//         { error: "Missing followerId or followingId" },
//         { status: 400 }
//       );
//     }

//     const pool = getPool();

//     const [rows] = await pool.execute(
//       "SELECT id FROM follows WHERE follower_id = ? AND following_id = ?",
//       [followerId, followingId]
//     );

//     return NextResponse.json({
//       isFollowing: Array.isArray(rows) && rows.length > 0,
//     });
//   } catch (err) {
//     console.error("Follow status API error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


// DELETE handler
// export async function DELETE(req: Request) {
//   try {
//     const { followerId, followingId } = await req.json();
//     if (!followerId || !followingId) {
//       return NextResponse.json({ error: "Missing followerId or followingId" }, { status: 400 });
//     }

//     const pool = getPool();

//     // Delete follow
//     await pool.execute(
//       `DELETE FROM follows WHERE follower_id = ? AND following_id = ?`,
//       [followerId, followingId]
//     );

//     // Delete follow notification
//     await pool.execute(
//       `DELETE FROM notifications WHERE user_id = ? AND actor_id = ? AND type = 'follow'`,
//       [followingId, followerId]
//     );

//     // Notify via socket
//     try {
//       await axios.post(`${process.env.SOCKET_URL}/notify`, {
//         userId: followingId,
//         action: "delete",
//         notification: { actor_id: followerId, type: "follow" },
//       });
//     } catch (err) {
//       console.error("Socket notify error:", err);
//     }

//     return NextResponse.json({ isFollowing: false });
//   } catch (err) {
//     console.error("Follow DELETE error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
// DELETE handler
export async function GET(req: Request) {
  const pool = getPool();
  const { searchParams } = new URL(req.url);

  const followerId = Number(searchParams.get("followerId"));  // YOU
  const followingId = Number(searchParams.get("followingId")); // PROFILE USER

  if (!followerId || !followingId) {
    return Response.json({ error: "Missing params" }, { status: 400 });
  }

  // you → them
  const [followingRows] = await pool.query<RowDataPacket [] >(
    "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
    [followerId, followingId]
  );

  // them → you
  const [followedByRows] = await pool.query<RowDataPacket []>(
    "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
    [followingId, followerId]
  );

  return Response.json({
    isFollowing: followingRows.length > 0,
    isFollowedBy: followedByRows.length > 0,   // ⭐ REQUIRED
  });
}
export async function DELETE(req: Request) {
  try {
    const { followerId, followingId } = await req.json();
    if (!followerId || !followingId) {
      return NextResponse.json({ error: "Missing followerId or followingId" }, { status: 400 });
    }

    const pool = getPool();

    // Get notification ID first
    const [notifRows] = await pool.query<NotificationRow[]>(
      `SELECT id FROM notifications WHERE user_id = ? AND actor_id = ? AND type = 'follow'`,
      [followingId, followerId]
    );

    const notifId = notifRows[0]?.id;

    // Delete follow
    await pool.execute(
      `DELETE FROM follows WHERE follower_id = ? AND following_id = ?`,
      [followerId, followingId]
    );

    // Delete follow notification
    await pool.execute(
      `DELETE FROM notifications WHERE user_id = ? AND actor_id = ? AND type = 'follow'`,
      [followingId, followerId]
    );

    // Notify via socket with real notification ID
    if (notifId) {
      try {
        await axios.post(`${process.env.SOCKET_URL}/notify`, {
          userId: followingId,
          action: "delete",
          notification: { id: notifId }, // <- important
        });
      } catch (err) {
        console.error("Socket notify error:", err);
      }
    }

    return NextResponse.json({ isFollowing: false });
  } catch (err) {
    console.error("Follow DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
