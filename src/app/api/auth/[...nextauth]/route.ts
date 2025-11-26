// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { getPool } from "@/lib/database/db";
// import { cookies } from "next/headers";
// import crypto from "crypto";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   callbacks: {
//     async signIn({ user, account }) {
//       try {
//         const pool = getPool();

//         const email = user.email;
//         const fullName = user.name || "";
//         const image = user.image || "";

//         if (!email) return false;

//         const [firstname, ...rest] = fullName.split(" ");
//         const lastname = rest.join(" ");

//         const [rows] = await pool.execute(
//           "SELECT id FROM users WHERE email = ?",
//           [email]
//         );
//         const users = rows as { id: number }[];

//         let userId: number;

//         if (users.length === 0) {
//           const [result]: any = await pool.execute(
//             "INSERT INTO users (firstname, lastname, email, image, google_id) VALUES (?, ?, ?, ?, ?)",
//             [firstname, lastname, email, image, account?.providerAccountId]
//           );
//           userId = result.insertId;
//           console.log("✅ New Google user inserted:", userId);
//         } else {
//           userId = users[0].id;
//           await pool.execute(
//             "UPDATE users SET google_id = ?, image = ?, firstname = ?, lastname = ? WHERE id = ?",
//             [account?.providerAccountId, image, firstname, lastname, userId]
//           );
//           console.log("🔄 Existing Google user updated:", userId);
//         }

//         const token = crypto.randomBytes(32).toString("hex");

//         (await cookies()).set("token", token, {
//           httpOnly: true,
//           path: "/",
//           maxAge: 60 * 60 * 24, // 1 day
//         });

//         (user as any).token = token;
//         (user as any).id = userId;

//         return true;
//       } catch (error) {
//         console.error("❌ Google sign-in error:", error);
//         return false;
//       }
//     },

//     async session({ session, user }) {
//       // Add token and userId to session
//       if (user) {
//         session.user.id = (user as any).id;
//         (session as any).token = (user as any).token;
//       }
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },
// });

// export { handler as GET, handler as POST };
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { getPool } from "@/lib/database/db";
// import { cookies } from "next/headers";
// import crypto from "crypto";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   callbacks: {
//     async signIn({ user, account }) {
//       try {
//         const pool = getPool();

//         const email = user.email;
//         const fullName = user.name || "";
//         const image = user.image || "";

//         if (!email) return false;

//         const [firstname, ...rest] = fullName.split(" ");
//         const lastname = rest.join(" ");

//         const [rows] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
//         const users = rows as { id: number }[];

//         let userId: number;

//         if (users.length === 0) {
//           const [result]: any = await pool.execute(
//             "INSERT INTO users (firstname, lastname, email, image, google_id) VALUES (?, ?, ?, ?, ?)",
//             [firstname, lastname, email, image, account?.providerAccountId]
//           );
//           userId = result.insertId;
//           console.log("✅ New Google user inserted:", userId);
//         } else {
//           userId = users[0].id;
//           await pool.execute(
//             "UPDATE users SET google_id = ?, image = ?, firstname = ?, lastname = ? WHERE id = ?",
//             [account?.providerAccountId, image, firstname, lastname, userId]
//           );
//           console.log("🔄 Existing Google user updated:", userId);
//         }

//         // set a cookie token (for server-side)
//         const token = crypto.randomBytes(32).toString("hex");
//         (await cookies()).set("token", token, {
//           httpOnly: true,
//           path: "/",
//           maxAge: 60 * 60 * 24, // 1 day
//         });

//         // attach userId for redirect callback
//         (user as any).id = userId;
//         (user as any).email = email;

//         return true;
//       } catch (error) {
//         console.error("❌ Google sign-in error:", error);
//         return false;
//       }
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.id = (user as any).id;
//         token.email = (user as any).email;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id;
//         session.user.email = token.email;
//       }
//       return session;
//     },

//     async redirect({ url, baseUrl }) {
//       // Redirect to a page that handles localStorage set
//       const redirectUrl = `${baseUrl}/auth/google-success?id=${encodeURIComponent(
//         (url.includes("id=") ? new URL(url).searchParams.get("id") : "") || ""
//       )}`;
//       return redirectUrl.startsWith(baseUrl)
//         ? redirectUrl
//         : `${baseUrl}/auth/google-success`;
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },
// });

// export { handler as GET, handler as POST };

// okay na sana
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { getPool } from "@/lib/database/db";
// import { cookies } from "next/headers";
// import crypto from "crypto";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   callbacks: {
//     // ✅ 1. Runs when a user signs in via Google
//     async signIn({ user, account }) {
//       try {
//         const pool = getPool();
//         const email = user.email;
//         const fullName = user.name || "";
//         const image = user.image || "";

//         if (!email) return false;

//         const [firstname, ...rest] = fullName.split(" ");
//         const lastname = rest.join(" ");

//         // Check if user already exists
//         const [rows] = await pool.execute(
//           "SELECT id FROM users WHERE email = ?",
//           [email]
//         );
//         const users = rows as { id: number }[];

//         let userId: number;

//         if (users.length === 0) {
//           // ✅ Insert new Google user
//           const [result]: any = await pool.execute(
//             "INSERT INTO users (firstname, lastname, email, image, google_id) VALUES (?, ?, ?, ?, ?)",
//             [firstname, lastname, email, image, account?.providerAccountId]
//           );
//           userId = result.insertId;
//           console.log("✅ New Google user inserted:", userId);
//         } else {
//           // ✅ Update existing Google user data
//           userId = users[0].id;
//           await pool.execute(
//             "UPDATE users SET google_id = ?, image = ?, firstname = ?, lastname = ? WHERE id = ?",
//             [account?.providerAccountId, image, firstname, lastname, userId]
//           );
//           console.log("🔄 Existing Google user updated:", userId);
//         }

//         // ✅ Set a secure cookie token
//         const token = crypto.randomBytes(32).toString("hex");
//         (await cookies()).set("token", token, {
//           httpOnly: true,
//           path: "/",
//           maxAge: 60 * 60 * 24, // 1 day
//         });

//         // Attach DB info for JWT + redirect
//         (user as any).id = userId;
//         (user as any).email = email;
//         (user as any).firstname = firstname;

//         return true;
//       } catch (error) {
//         console.error("❌ Google sign-in error:", error);
//         return false;
//       }
//     },

//     // ✅ 2. Add user data to JWT token
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = (user as any).id;
//         token.email = (user as any).email;
//         token.firstname = (user as any).firstname;
//       }
//       return token;
//     },

//     // ✅ 3. Add user data to session
//     async session({ session, token }) {
//       if (token) {
//         session.user!.id = token.id;
//         session.user!.email = token.email;
//         session.user!.firstname = token.firstname;
//       }
//       return session;
//     },

//     // ✅ 4. Redirect after login
//     async redirect({ baseUrl }) {
//       // Go to your frontend success page
//       return `${baseUrl}/auth/google-success`;
//     },
//   },

//   // ✅ 5. Custom pages
//   pages: {
//     signIn: "/authentication/login",
//   },
// });

// export { handler as GET, handler as POST };































































































// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { getPool } from "@/lib/database/db";
// import { cookies } from "next/headers";
// import crypto from "crypto";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   callbacks: {
//     // async signIn({ user, account }) {
//     //   try {
//     //     const pool = getPool();

//     //     const email = user.email;
//     //     const fullName = user.name || "";
//     //     const image = user.image || "";

//     //     if (!email) return false;

//     //     const [firstname, ...rest] = fullName.split(" ");
//     //     const lastname = rest.join(" ");

//     //     const [rows] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
//     //     const users = rows as { id: number }[];

//     //     let userId: number;
//     //     let username: string = ""; // <-- store username


//     //     if (users.length === 0) {
//     //         username = email.split("@")[0];

//     //       const [result]: any = await pool.execute(
//     //         "INSERT INTO users (firstname, lastname, email, image, google_id, username) VALUES (?, ?, ?, ?, ?, ?)",
//     //         [firstname, lastname, email, image, account?.providerAccountId, username]
//     //       );
//     //       userId = result.insertId;
//     //       console.log("✅ New Google user inserted:", userId);
//     //     } else {
//     //       userId = users[0].id;
//     //         username = users[0].username || email.split("@")[0];

//     //       // await pool.execute(
//     //       //   "UPDATE users SET google_id = ?, image = ?, firstname = ?, lastname = ? WHERE id = ?",
//     //       //   [account?.providerAccountId, image, firstname, lastname, userId]
//     //       // );
//     //        await pool.execute(
//     //         "UPDATE users SET google_id = ?, image = ? WHERE id = ?",
//     //         [account?.providerAccountId, image, userId]
//     //       );
//     //       console.log("🔄 Existing Google user updated:", userId);
//     //     }

//     //     // set a cookie token (for server-side)
//     //     const token = crypto.randomBytes(32).toString("hex");
//     //     (await cookies()).set("token", token, {
//     //       httpOnly: true,
//     //       path: "/",
//     //       maxAge: 60 * 60 * 24, // 1 day
//     //     });

//     //     // attach userId for redirect callback
//     //     (user as any).id = userId;
//     //     (user as any).email = email;
//     //     (user as any).username = username;


//     //     return true;
//     //   } catch (error) {
//     //     console.error("❌ Google sign-in error:", error);
//     //     return false;
//     //   }
//     // },
// async signIn({ user, account }) {
//   try {
//     const pool = getPool();
//     const email = user.email!;
//     const fullName = user.name || "";
//     const image = user.image || "";
//     const [firstname, ...rest] = fullName.split(" ");
//     const lastname = rest.join(" ");

//     const [rows] = await pool.execute(
//       "SELECT id, username FROM users WHERE email = ?",
//       [email]
//     );
//     const users = rows as { id: number; username?: string }[];

//     let userId: number;
//     let username: string;

//     if (users.length === 0) {
//       // New user
//       username = email.split("@")[0]; // generate username
//       const [result]: any = await pool.execute(
//         "INSERT INTO users (firstname, lastname, email, image, google_id, username) VALUES (?, ?, ?, ?, ?, ?)",
//         [firstname, lastname, email, image, account?.providerAccountId, username]
//       );
//       userId = result.insertId;
//       console.log("✅ New Google user inserted:", userId);
//     } else {
//       // Existing user
//       userId = users[0].id;
//       username = users[0].username || email.split("@")[0];

//       await pool.execute(
//         "UPDATE users SET google_id = ?, image = ? WHERE id = ?",
//         [account?.providerAccountId, image, userId]
//       );
//       console.log("🔄 Existing Google user updated:", userId);
//     }


//     // Attach user info to session
//     (user as any).id = userId;
//     (user as any).username = username;

//     return true;
//   } catch (err) {
//     console.error(err);
//     return false;
//   }
// }
// ,
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = (user as any).id;
//         token.email = (user as any).email;
//         token.username = (user as any).username; // add this

//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id;
//         session.user.email = token.email;
//         session.user.username = token.username; // ✅ Good


//       }
//       return session;
//     },

//     async redirect({ url, baseUrl }) {
//       // Redirect to a page that handles localStorage set
//       const redirectUrl = `${baseUrl}/auth/google-success?id=${encodeURIComponent(
//         (url.includes("id=") ? new URL(url).searchParams.get("id") : "") || ""
//       )}`;
//       return redirectUrl.startsWith(baseUrl)
//         ? redirectUrl
//         : `${baseUrl}/auth/google-success`;
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },
// });

// export { handler as GET, handler as POST };
// done workingg
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { getPool } from "@/lib/database/db";
// import { cookies } from "next/headers";
// import crypto from "crypto";
// import axios from "axios";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   callbacks: {
//     async signIn({ user, account }) {
//       try {
//         const pool = getPool();
//         const email = user.email!;
//         const fullName = user.name || "";
//         const image = user.image || "";
//         const [firstname, ...rest] = fullName.split(" ");
//         const lastname = rest.join(" ");

//         // Check if user exists
//         const [rows] = await pool.execute(
//           "SELECT id, username FROM users WHERE email = ?",
//           [email]
//         );
//         const users = rows as { id: number; username?: string }[];

//         let userId: number;
//         let username: string;

//         if (users.length === 0) {
//           // New user
//           username = email.split("@")[0];
//           const [result]: any = await pool.execute(
//             "INSERT INTO users (firstname, lastname, email, image, google_id, username) VALUES (?, ?, ?, ?, ?, ?)",
//             [firstname, lastname, email, image, account?.providerAccountId, username]
//           );
//           userId = result.insertId;
//           console.log("✅ New Google user inserted:", userId);
//         } else {
//           // Existing user
//           userId = users[0].id;
//           username = users[0].username || email.split("@")[0];

//           await pool.execute(
//             "UPDATE users SET google_id = ?, image = ?, online = 1 WHERE id = ?",
//             [account?.providerAccountId, image, userId]
//           );
//           console.log("🔄 Existing Google user updated:", userId);
//         }
//  await axios.post("http://localhost:4000/online-status", {
//           userId,
//           online: 1,
//         });
//         // Generate server-side token cookie for middleware
//         const token = crypto.randomBytes(32).toString("hex");
//         (await cookies()).set("token", token, {
//           httpOnly: true,
//           path: "/",
//           maxAge: 60 * 60 * 24, // 1 day
//         });

//         // Attach user info to session
//         (user as any).id = userId;
//         (user as any).username = username;
//         (user as any).email = email;

//         return true;
//       } catch (err) {
//         console.error("❌ Google sign-in error:", err);
//         return false;
//       }
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.id = (user as any).id;
//         token.email = (user as any).email;
//         token.username = (user as any).username;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id;
//         session.user.email = token.email;
//         session.user.username = token.username;
//       }
//       return session;
//     },

//     async redirect({ url, baseUrl }) {
//       const redirectUrl = `${baseUrl}/auth/google-success?id=${encodeURIComponent(
//         url.includes("id=") ? new URL(url).searchParams.get("id") : ""
//       )}`;
//       return redirectUrl.startsWith(baseUrl)
//         ? redirectUrl
//         : `${baseUrl}/auth/google-success`;
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },
// });

// export { handler as GET, handler as POST };
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getPool } from "@/lib/database/db";
import { cookies } from "next/headers";
import crypto from "crypto";
import axios from "axios";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

// import { UserRow, InsertResult } from "@/types/mysql";
 interface UserRow extends RowDataPacket {
  id: number;
  username: string | null;
}

 interface InsertResult extends ResultSetHeader {
  insertId: number;
}
const socketUrl = process.env.SOCKET_URL;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        const pool = getPool();
        const email = user.email!;
        const fullName = user.name || "";
        const image = user.image || "";

        const [firstname, ...rest] = fullName.split(" ");
        const lastname = rest.join(" ");

        // SELECT user
        const [rows] = await pool.execute<UserRow[]>(
          "SELECT id, username FROM users WHERE email = ?",
          [email]
        );

        let userId: number;
        let username: string;

        if (rows.length === 0) {
          // NEW USER
          username = email.split("@")[0];

          const [result] = await pool.execute<InsertResult>(
            "INSERT INTO users (firstname, lastname, email, image, google_id, username) VALUES (?, ?, ?, ?, ?, ?)",
            [firstname, lastname, email, image, account?.providerAccountId, username]
          );

          userId = result.insertId;
          console.log("New Google user inserted:", userId);

        } else {
          // EXISTING USER
          const existing = rows[0];

          userId = existing.id;
          username = existing.username || email.split("@")[0];

          await pool.execute(
            "UPDATE users SET google_id = ?, image = ?, online = 1 WHERE id = ?",
            [account?.providerAccountId, image, userId]
          );

          console.log("Existing Google user updated:", userId);
        }

        // Notify socket server
        // await axios.post("http://localhost:4000/online-status", {
          await axios.post(`${socketUrl}/online-status`, {
          userId,
          online: 1,
        });

        // Create secure cookie token
        const token = crypto.randomBytes(32).toString("hex");

        (await cookies()).set("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24,
        });

        // Attach typed values to NextAuth User object
        user.id = userId;
        user.username = username;
        user.email = email;

        return true;

      } catch (err) {
        console.error("Google sign-in error:", err);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.email = user.email!;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.email = token.email;
        session.user.username = token.username;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      const redirectUrl = `${baseUrl}/auth/google-success?id=${encodeURIComponent(
        url.includes("id=") ? new URL(url).searchParams.get("id")! : ""
      )}`;

      return redirectUrl.startsWith(baseUrl)
        ? redirectUrl
        : `${baseUrl}/auth/google-success`;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
