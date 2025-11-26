import { NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";  // Import the pool
import { RowDataPacket } from "mysql2/promise";

// GoalRow interface definition
interface GoalRow {
  id: number;
  title: string;
  category: string;
  duration: string;
  privacy: string;
  image: string | null; // Assuming image could be null
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    if (!id || isNaN(Number(id))) {
      // If ID is not valid or missing
      return NextResponse.json(
        { error: "Invalid or missing goal ID" },
        { status: 400 }
      );
    }

    // Connect to the database
    const pool = getPool();

    // Fetch the goal from the database by ID
    const [rows] = await pool.execute<RowDataPacket[] & GoalRow[]>(
      "SELECT * FROM goals WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      // If no goal is found
      return NextResponse.json({ message: "Goal not found" }, { status: 404 });
    }

    const goal = rows[0]; // Get the first goal from the results

    // Construct the full URL for the image stored in the 'public/images' folder
    const imageUrl = goal.image ? `/images/${goal.image}` : null;

    return NextResponse.json({ ...goal, image: imageUrl }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching goal:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
