// import { getPool } from "@/lib/database/db";
// import { NextResponse } from "next/server";
// // import { getPool } from "@/lib/db";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const postId = searchParams.get("postId");

//     if (!postId) {
//       return NextResponse.json({ error: "postId required" }, { status: 400 });
//     }

//     const pool = getPool();
//     const [rows] = await pool.query(
//       `
//       SELECT emoji_id, COUNT(*) AS count
//       FROM reactions
//       WHERE post_id = ?
//       GROUP BY emoji_id
//       `,
//       [postId]
//     );

//     // Normalize emoji before sending
//     const reactions = rows.map((r: any) => ({
//       emoji: r.emoji.normalize("NFC"),
//       count: Number(r.count),
//     }));

//     return NextResponse.json({ reactions });
//   } catch (err) {
//     console.error("Error fetching reactions:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch reactions" },
//       { status: 500 }
//     );
//   }
// }





// import { getPool } from "@/lib/database/db";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const postId = searchParams.get("postId");

//     if (!postId) {
//       return NextResponse.json({ error: "postId required" }, { status: 400 });
//     }

//     const pool = getPool();

//     // ✅ LEFT JOIN ensures rows are returned even if emoji table is missing an entry
//     const [rows] = await pool.query(
//       `
//       SELECT e.emoji, e.label, COUNT(r.id) AS count
//       FROM reactions r
//       LEFT JOIN emojis e ON r.emoji_id = e.id
//       WHERE r.post_id = ?
//       GROUP BY r.emoji_id, e.emoji, e.label
//       `,
//       [postId]
//     );

//     // ✅ Safely handle missing emoji
//     const reactions = (rows as any[]).map((r) => ({
//       emoji: (r.emoji || "❓").normalize("NFC"), // fallback if undefined
//       label: r.label || "Unknown",
//       count: Number(r.count),
//     }));

//     return NextResponse.json({ reactions });
//   } catch (err) {
//     console.error("Error fetching reactions:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch reactions" },
//       { status: 500 }
//     );
//   }
// }
import { getPool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";

export interface ReactionRow extends RowDataPacket {
  emoji: string | null;
  label: string | null;
  count: number;
}

export interface ReactionResponse {
  emoji: string;
  label: string;
  count: number;
}

export interface ApiError {
  error: string;
}

// ----- API Route -----
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      const errorResponse: ApiError = { error: "postId required" };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const pool = getPool();

    // LEFT JOIN ensures rows are returned even if emoji table is missing an entry
    const [rows] = await pool.query<ReactionRow[] & RowDataPacket[]>(
      `
      SELECT e.emoji, e.label, COUNT(r.id) AS count
      FROM reactions r
      LEFT JOIN emojis e ON r.emoji_id = e.id
      WHERE r.post_id = ?
      GROUP BY r.emoji_id, e.emoji, e.label
      `,
      [postId]
    );

    // Safely handle missing emoji
    const reactions: ReactionResponse[] = rows.map((r) => ({
      emoji: (r.emoji || "❓").normalize("NFC"),
      label: r.label || "Unknown",
      count: Number(r.count),
    }));

    return NextResponse.json({ reactions });
  } catch (err: unknown) {
    console.error("Error fetching reactions:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch reactions";
    const errorResponse: ApiError = { error: message };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
