// // import { getPool } from "@/lib/database/db";
// // import { NextResponse } from "next/server";

// // export async function GET(req: Request) {
// //   const pool = getPool();
// //   try {
// //     const { searchParams } = new URL(req.url);
// //     const userId = searchParams.get("userId");
// //     if (!userId)
// //       return NextResponse.json({ error: "Missing userId" }, { status: 400 });

// //     const [rows] = await pool.query(
// //       `SELECT n.*, a.username AS actorName, g.title
// //        FROM notifications n
// //        JOIN users a ON n.actor_id = a.id
// //        JOIN goals g ON n.post_id = g.id
// //        WHERE n.user_id = ?
// //        ORDER BY n.created_at DESC`,
// //       [userId]
// //     );

// //     return NextResponse.json(rows);
// //   } catch (err) {
// //     console.error("GET /api/notification error:", err);
// //     return NextResponse.json(
// //       { error: "Internal server error" },
// //       { status: 500 }
// //     );
// //   }
// // }

// // export async function POST(req: Request) {
// //   const pool = getPool();
// //   try {
// //     const { id } = await req.json();
// //     if (!id)
// //       return NextResponse.json({ error: "Missing id" }, { status: 400 });

// //     await pool.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
// //     return NextResponse.json({ success: true });
// //   } catch (err) {
// //     console.error("POST /api/notification/read error:", err);
// //     return NextResponse.json(
// //       { error: "Internal server error" },
// //       { status: 500 }
// //     );
// //   }
// // }
// // app/api/notification/route.ts
// import { getPool } from "@/lib/database/db";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const pool = getPool();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

//     const [rows] = await pool.query(
//       `SELECT n.*, a.username AS actorName, g.title, g.id AS post_id
//        FROM notifications n
//        JOIN users a ON n.actor_id = a.id
//        JOIN goals g ON n.post_id = g.id
//        WHERE n.user_id = ?
//        ORDER BY n.created_at DESC`,
//       [userId]
//     );

//     return NextResponse.json(rows);
//   } catch (err) {
//     console.error("GET /api/notification error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   const pool = getPool();
//   try {
//     const { id } = await req.json();
//     if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

//     await pool.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("POST /api/notification/read error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

import { getPool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const pool = getPool();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    // const [rows] = await pool.query(
    //   `SELECT n.*, a.username AS actorName, g.title, g.id AS post_ids, n.post_id
    //    FROM notifications n
    //    JOIN users a ON n.actor_id = a.id
    //    JOIN goals g ON n.post_id = g.id
    //    WHERE n.user_id = ?
    //    ORDER BY n.created_at DESC`,
    //   [userId]
    // );
//     const [rows] = await pool.query(
//   `SELECT 
//       n.id,
//       n.message,
//       n.created_at,
//       n.is_read,
//       n.type,
//       a.username AS actorName,
//       g.title,
//       n.post_id      
//    FROM notifications n
//    JOIN users a ON n.actor_id = a.id
//    JOIN goals g ON n.post_id = g.id
//    WHERE n.user_id = ?
//    ORDER BY n.created_at DESC`,
//   [userId]
// );
 const [rows] = await pool.query(
      `
      SELECT 
        n.id,
        n.message,
        n.created_at,
        n.updated_at,
        n.is_read,
        n.type,
        a.username AS actorName,
        g.title,
        n.post_id
      FROM notifications n
      JOIN users a ON n.actor_id = a.id
      JOIN goals g ON n.post_id = g.id
      WHERE n.user_id = ?
      ORDER BY n.updated_at DESC
      `,
      [userId]
    );


    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/notification error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const pool = getPool();
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await pool.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/notification/read error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

