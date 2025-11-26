import { NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise"; // Import ResultSetHeader for update queries
import fs from "fs";
import path from "path";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid or missing user ID" }, { status: 400 });
    }

    const pool = getPool();
    const formData = await req.formData();

    const firstname = formData.get("firstname")?.toString();
    const lastname = formData.get("lastname")?.toString();
    const email = formData.get("email")?.toString();
    // const bio = formData.get("bio")?.toString();
    const image = formData.get("profileImage");

    if (!firstname || !lastname || !email) {
      return NextResponse.json({ error: "First Name, Last Name, and Email are required" }, { status: 400 });
    }

    const [existingUserRows] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [id]);

    if (existingUserRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingUser = existingUserRows[0];
    let imageFileName: string | null = existingUser.image;

    // Handle file upload for profile image if provided
    if (image && image instanceof File) {
      imageFileName = `${Date.now()}_${image.name}`;
      const imagePath = path.join(process.cwd(), "public", "uploads", imageFileName);
      const imageBuffer = await image.arrayBuffer();
      fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
      imageFileName = `/uploads/${imageFileName}`;
    }

    // Update user data in the database
    const [updateResult] = await pool.execute<ResultSetHeader>(
      "UPDATE users SET firstname = ?, lastname = ?, email = ?, image = ? WHERE id = ?",
      [firstname, lastname, email, imageFileName, id]
    );

    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ message: "User update failed" }, { status: 400 });
    }

    return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
