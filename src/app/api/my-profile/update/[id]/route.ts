// import { NextResponse } from "next/server";
// import { getPool } from "@/lib/database/db";
// import { RowDataPacket, ResultSetHeader } from "mysql2/promise"; // Import ResultSetHeader for update queries
// export async function PUT(req: Request, context: { params: { id: string } }): Promise<NextResponse> {
//   try {
//     // Log context.params to debug if id is coming through
//     console.log('context.params:', context.params);

//     const { id } = context.params;

//     if (!id || isNaN(Number(id))) {
//       return NextResponse.json({ error: "Invalid or missing user ID" }, { status: 400 });
//     }

//     const pool = getPool();
//     const formData = await req.formData();

//     const firstname = formData.get("firstname")?.toString();
//     const lastname = formData.get("lastname")?.toString();
//     const email = formData.get("email")?.toString();
//     // const image = formData.get("profileImage");

//     if (!firstname || !lastname || !email) {
//       return NextResponse.json({ error: "First Name, Last Name, and Email are required" }, { status: 400 });
//     }

//     const [existingUserRows] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [id]);

//     if (existingUserRows.length === 0) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const [updateResult] = await pool.execute<ResultSetHeader>(
//       "UPDATE users SET firstname = ?, lastname = ?, email = ? WHERE id = ?",
//       [firstname, lastname, email, id]
//     );

//     if (updateResult.affectedRows === 0) {
//       return NextResponse.json({ message: "User update failed" }, { status: 400 });
//     }

//     return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
//   } catch (error: unknown) {
//     console.error("Error updating user:", error);
//     const message = error instanceof Error ? error.message : "Internal server error";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }
// export async function GET(req: Request, context: { params: { id: string } }): Promise<NextResponse> {
//   try {
//     const { id } = context.params;

//     if (!id || isNaN(Number(id))) {
//       return NextResponse.json({ error: "Invalid or missing user ID" }, { status: 400 });
//     }

//     const pool = getPool();
    
//     // Query the database for the user by ID
//     const [userRows] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [id]);

//     if (userRows.length === 0) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const user = userRows[0];

//     return NextResponse.json({ user }, { status: 200 });
//   } catch (error: unknown) {
//     console.error("Error fetching user:", error);
//     const message = error instanceof Error ? error.message : "Internal server error";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { getPool } from "@/lib/database/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ✅ FIXED SIGNATURE
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

    const firstname = formData.get("firstname")?.toString();
    const lastname = formData.get("lastname")?.toString();
    const email = formData.get("email")?.toString();

    if (!firstname || !lastname || !email) {
      return NextResponse.json({ error: "First Name, Last Name, and Email are required" }, { status: 400 });
    }

    const [existingUserRows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (existingUserRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [updateResult] = await pool.execute<ResultSetHeader>(
      "UPDATE users SET firstname=?, lastname=?, email=? WHERE id=?",
      [firstname, lastname, email, id]
    );

    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ message: "User update failed" }, { status: 400 });
    }

    return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ FIXED SIGNATURE
// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse> {
//   try {
//     const { id } = params;
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid or missing user ID" },
        { status: 400 }
      );
    }

    const pool = getPool();
    const [userRows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ ...userRows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
