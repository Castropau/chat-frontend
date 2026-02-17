import { getPool } from "@/lib/database/db"; // Correctly import your database pool
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, online } = await request.json(); // Parse the JSON body

    if (!userId || online === undefined) {
      return NextResponse.json(
        { error: "Missing userId or online status" },
        { status: 400 }
      );
    }

    const pool = getPool(); // Ensure this is properly configured to your DB
    // Update the user status to 0 (offline) or 1 (online)
    await pool.execute("UPDATE users SET online = ? WHERE id = ?", [online, userId]);

    return NextResponse.json({ message: "User online status updated successfully" });
  } catch (error) {
    console.error("Error updating online status:", error); // Log to see any issues
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
