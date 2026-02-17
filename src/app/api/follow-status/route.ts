import { getPool } from "@/lib/database/db";
import { RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");       // logged in user
  const profileId = searchParams.get("profileId"); // profile owner

  if (!userId || !profileId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const pool = getPool();

  // 1. Check if YOU follow this profile
  const [following] = await pool.query<RowDataPacket []>(
    `SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ? LIMIT 1`,
    [userId, profileId]
  );

  // 2. Check if THEY follow YOU
  const [followedBy] = await pool.query<RowDataPacket []>(
    `SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ? LIMIT 1`,
    [profileId, userId]
  );

  return NextResponse.json({
    isFollowing: following.length > 0,
    isFollowedBy: followedBy.length > 0,  // 🔥 this is important
  });
}
