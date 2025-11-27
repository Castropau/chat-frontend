// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// // import { getPool } from "@/lib/db";
// import { cookies } from "next/headers"; // ✅ Import cookies
//  import crypto from "crypto";
// import { getPool } from "@/lib/database/db";

// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json();

//     if (!email || !password) {
//       return NextResponse.json({ error: "Email and password required" }, { status: 400 });
//     }

//     const pool = getPool();
//     const [rows] = await pool.execute(
//       "SELECT id, email, password, firstname FROM users WHERE email = ?",
//       [email]
//     );
//     const users = rows as { id: number; email: string; password: string, firstname: string }[];

//     if (users.length === 0) {
//       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
//     }

//     const user = users[0];
//     // const isValid = await bcrypt.compare(password, user.password);
//     const isValid = await bcrypt.compare(password, user.password);


//     if (!isValid) {
//       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
//     }

//     // ✅ Set cookie (simple token or just user ID for now)
//     // (await
//     //       // ✅ Set cookie (simple token or just user ID for now)
//     //       cookies()).set("token", String(user.id), {
//     //   httpOnly: true,
//     //   path: "/",
//     //   maxAge: 60 * 60 * 24, // 1 day
//     // });
   
// console.log("User ID:", user.id);

// const token = crypto.randomBytes(32).toString("hex");

// (await cookies()).set("token", token, {
//   httpOnly: true,
//   path: "/",
//   maxAge: 60 * 60 * 24, // 1 day
// });

//     // return NextResponse.json({ message: "Login successful" });
//     return NextResponse.json({ 
//   message: "Login successful", 
//   user: { id: user.id, email: user.email, firstname: user.firstname } // Include any other necessary data
// });

//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getPool } from "@/lib/database/db";
import axios from "axios";

// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password required" },
//         { status: 400 }
//       );
//     }

//     const pool = getPool();

//     // ✅ Get user info including firstname
//     const [rows] = await pool.execute(
//       "SELECT id, email, password, firstname, username FROM users WHERE email = ?",
//       [email]
//     );

//     const users = rows as {
//       id: number;
//       email: string;
//       password: string;
//       firstname: string;
//       username?: string;
//     }[];

//     if (users.length === 0) {
//       return NextResponse.json(
//         { error: "Invalid email or password" },
//         { status: 401 }
//       );
//     }

//     const user = users[0];

//     // ✅ Verify password
//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) {
//       return NextResponse.json(
//         { error: "Invalid email or password" },
//         { status: 401 }
//       );
//     }
//   await pool.execute(
//       "UPDATE users SET online = 1 WHERE id = ?",
//       [user.id]
//     );

//     //  await axios.post("http://localhost:4000/online-status", {
//     const socketUrl = process.env.SOCKET_URL;
//       await axios.post(`${socketUrl}/online-status`, {
//       userId: user.id,
//       online: 1,
//     });
//     // ✅ Generate a random session token and set cookie
//     const token = crypto.randomBytes(32).toString("hex");

//     (await cookies()).set("token", token, {
//       httpOnly: true,
//       path: "/",
//       maxAge: 60 * 60 * 24, // 1 day
//     });

//     console.log("✅ User logged in:", user.id, user.email);

//     // ✅ Return structured user data
//     return NextResponse.json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         email: user.email,
//         firstname: user.firstname,
//         username: user.username || "",
//       },
//     });
//   } catch (error) {
//     console.error("❌ Login error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    console.log("Received email:", email);

    if (!email || !password) {
      console.error("Missing email or password.");
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const pool = getPool();
    console.log("Connecting to the database...");

    // ✅ Get user info including firstname
    const [rows] = await pool.execute(
      "SELECT id, email, password, firstname, username FROM users WHERE email = ?",
      [email]
    );

    const users = rows as {
      id: number;
      email: string;
      password: string;
      firstname: string;
      username?: string;
    }[];

    if (users.length === 0) {
      console.error("User not found for email:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = users[0];
    console.log("User found:", user.email);

    // ✅ Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.error("Invalid password for user:", user.email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("Password valid for user:", user.email);

    // ✅ Update user online status
    await pool.execute(
      "UPDATE users SET online = 1 WHERE id = ?",
      [user.id]
    );
    console.log("User online status updated:", user.id);

    // ✅ Notify socket server
    const socketUrl = process.env.SOCKET_URL;
    try {
      await axios.post(`${socketUrl}/online-status`, {
        userId: user.id,
        online: 1,
      });
      console.log("Notified socket server about online status.");
    } catch (socketError) {
      console.error("Error notifying socket server:", socketError);
    }

    // ✅ Generate a random session token and set cookie
    const token = crypto.randomBytes(32).toString("hex");
    console.log("Generated token:", token);

    (await cookies()).set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    console.log("✅ User logged in:", user.id, user.email);

    // ✅ Return structured user data
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        username: user.username || "",
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
