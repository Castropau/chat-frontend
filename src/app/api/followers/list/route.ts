// // app/api/followers/list/route.ts
// import { getPool } from "@/lib/database/db";
// import { NextResponse } from "next/server";
// // import { getPool } from "@/lib/db";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get("userId");
//   if (!userId) return NextResponse.json({ users: [] });

//   const pool = getPool();

//   const [users] = await pool.query(
//     `SELECT u.id, u.firstname, u.lastname, u.username, u.profile_image
//      FROM follows f
//      JOIN users u ON f.follower_id = u.id
//      WHERE f.following_id = ?`,
//     [userId]
//   );

//   return NextResponse.json({ users });
// }
import { getPool } from "@/lib/database/db";
import { NextResponse } from "next/server";
// import { getPool } from "@/lib/db"; // adjust path to your pool

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  if (!username) return NextResponse.json({ users: [] });

  try {
    const pool = getPool();
    const [users] = await pool.query(
      `
     SELECT u.id, u.firstname, u.lastname, u.username, u.image
FROM users u
JOIN follows f ON f.follower_id = u.id
WHERE f.following_id = (SELECT id FROM users WHERE username = ?)

      `,
      [username]
    );

    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ users: [] });
  }
}
