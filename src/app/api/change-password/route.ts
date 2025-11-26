import { NextResponse } from "next/server";
// import { getPool } from "@/lib/db"; // Assume this function is used to get the DB connection pool
import bcrypt from "bcrypt";
import { ResultSetHeader, RowDataPacket } from "mysql2"; // For MySQL result typing
import { getPool } from "@/lib/database/db";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid or missing user ID" }, { status: 400 });
    }

    const pool = getPool();
    const formData = await req.formData();

    const currentPassword = formData.get("currentPassword")?.toString();
    const newPassword = formData.get("newPassword")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New password and confirm password must match" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 });
    }

    // Fetch the existing user data from the database to check current password
    const [existingUserRows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (existingUserRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingUser = existingUserRows[0];

    // Check if the current password matches the stored password
    const passwordMatch = await bcrypt.compare(currentPassword, existingUser.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    const [updateResult] = await pool.execute<ResultSetHeader>(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedNewPassword, id]
    );

    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ message: "Password update failed" }, { status: 400 });
    }

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating password:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
