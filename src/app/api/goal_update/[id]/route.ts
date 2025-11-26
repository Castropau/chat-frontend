import { NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";  // Import the pool
import { RowDataPacket, ResultSetHeader } from "mysql2/promise"; // Import ResultSetHeader for update queries
import fs from "fs";
import path from "path";

// GoalRow interface definition


export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid or missing goal ID" }, { status: 400 });
    }

    const pool = getPool();
    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const category = formData.get("category")?.toString();
    const duration = formData.get("duration")?.toString();
    const privacy = formData.get("privacy")?.toString();
    const image = formData.get("image");

    if (!title || !category || !duration || !privacy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch the existing goal data from the database to get the current image
    const [existingGoalRows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM goals WHERE id = ?",
      [id]
    );

    if (existingGoalRows.length === 0) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const existingGoal = existingGoalRows[0];
    let imageFileName: string | null = existingGoal.post_image;  // Default to the existing post_image

    // Handle file upload for image if provided
    if (image && image instanceof File) {
      // Create a unique filename for the uploaded image
      imageFileName = `${Date.now()}_${image.name}`;
      const imagePath = path.join(process.cwd(), "public", "images", imageFileName);

      // Save the image buffer to the public/images folder
      const imageBuffer = await image.arrayBuffer();
      fs.writeFileSync(imagePath, Buffer.from(imageBuffer));

      // Store the relative image path in the database (e.g., "/images/1633591824973_image.jpg")
      imageFileName = `/images/${imageFileName}`;
    }

    // Update goal data in the database
    const [updateResult] = await pool.execute<ResultSetHeader>(
      "UPDATE goals SET title = ?, category = ?, duration = ?, privacy = ?, post_image = ? WHERE id = ?",
      [title, category, duration, privacy, imageFileName, id]
    );

    // The result from `execute` will be a ResultSetHeader, which contains metadata like affectedRows
    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ message: "Goal update failed" }, { status: 400 });
    }

    return NextResponse.json({ message: "Goal updated successfully" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating goal:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
