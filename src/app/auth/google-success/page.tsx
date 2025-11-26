// // "use client";

// // import { useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import { useSession } from "next-auth/react";

// // export default function GoogleSuccess() {
// //   const { data: session, status } = useSession();
// //   const router = useRouter();

// //   useEffect(() => {
// //     if (status === "loading") return;

// //     if (session?.user?.id && session?.user?.email) {
// //       localStorage.setItem(
// //         "user",
// //         JSON.stringify({
// //           id: session.user.id,
// //           email: session.user.email,
// //           username: (session.user as any).username || session.user.email.split("@")[0],

// //         })
// //       );
// //       console.log("✅ Google user saved in localStorage:", session.user);
// //       router.push("/dashboard");
// //     } else {
// //       console.log("❌ No session found, redirecting to /login");
// //       router.push("/login");
// //     }
// //   }, [session, status, router]);

// //   return (
// //     <div className="flex items-center justify-center h-screen text-gray-600">
// //       <p>Setting up your Google account, please wait...</p>
// //     </div>
// //   );
// // }











// // "use client";

// // import { useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import { useSession } from "next-auth/react";

// // export default function GoogleSuccess() {
// //   const { data: session, status } = useSession();
// //   const router = useRouter();

// //   useEffect(() => {
// //     if (status === "loading") return;

// //     if (session?.user?.id && session?.user?.email) {
// //       const fullname = session.user.name || "";
// //       const [firstname, ...rest] = fullname.split(" ");
// //       const lastname = rest.join(" ");

// //       const userData = {
// //         id: session.user.id,
// //         email: session.user.email,
// //         username: (session.user as any).username || session.user.email.split("@")[0],
// //         firstname,
// //         lastname,
// //         name: fullname,
// //         image: session.user.image, // optional
// //       };

// //       localStorage.setItem("user", JSON.stringify(userData));
// //       console.log("✅ Google user saved in localStorage:", userData);

// //       router.push("/dashboard");
// //     } else {
// //       console.log("❌ No session found, redirecting to /login");
// //       router.push("/login");
// //     }
// //   }, [session, status, router]);

// //   return (
// //     <div className="flex items-center justify-center h-screen text-gray-600">
// //       <p>Setting up your Google account, please wait...</p>
// //     </div>
// //   );
// // }















// // donee
// // "use client";

// // import { useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import { useSession } from "next-auth/react";

// // export default function GoogleSuccessPage() {
// //   const router = useRouter();
// //   const { data: session, status } = useSession();

// //   useEffect(() => {
// //     if (status === "loading") return; // wait for session

// //     if (session?.user?.id && session?.user?.email) {
// //       const fullName = session.user.name || "";
// //       const [firstname, ...rest] = fullName.split(" ");
// //       const lastname = rest.join(" ");

// //       // ✅ Ensure username exists
// //       const username =
// //         (session.user as any).username || session.user.email.split("@")[0];

// //       const userData = {
// //         id: session.user.id,
// //         email: session.user.email,
// //         username,
// //         firstname: firstname || "",
// //         lastname: lastname || "",
// //         name: fullName,
// //         image: session.user.image || "",
// //       };

// //       // Save to localStorage
// //       localStorage.setItem("user", JSON.stringify(userData));
// //       console.log("✅ Google user stored in localStorage:", userData);

// //       // ✅ Redirect to profile or dashboard using username
// //       router.push(`/dashboard/profile/${username}`);
// //     } else {
// //       console.log("❌ No session found, redirecting to login");
// //       router.push("/authentication/login");
// //     }
// //   }, [session, status, router]);

// //   return (
// //     <div className="flex items-center justify-center h-screen text-gray-600">
// //       <p>Signing you in with Google...</p>
// //     </div>
// //   );
// // }
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";

// export default function GoogleSuccessPage() {
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     if (status === "loading") return; // wait for session

//     if (session?.user?.id && session?.user?.email) {
//       const fullName = session.user.name || "";
//       const [firstname, ...rest] = fullName.split(" ");
//       const lastname = rest.join(" ");

//       const username =
//         (session.user as any).username || session.user.email.split("@")[0];

//       const userData = {
//         id: session.user.id,
//         email: session.user.email,
//         username,
//         firstname: firstname || "",
//         lastname: lastname || "",
//         name: fullName,
//         image: session.user.image || "",
//       };

//       // Save to localStorage
//       localStorage.setItem("user", JSON.stringify(userData));
//       console.log("✅ Google user stored in localStorage:", userData);

//       // Redirect to timeline instead of profile
//       router.push("/dashboard/timeline");
//     } else {
//       console.log("❌ No session found, redirecting to login");
//       router.push("/authentication/login");
//     }
//   }, [session, status, router]);

//   return (
//     <div className="flex items-center justify-center h-screen text-gray-600">
//       <p>Signing you in with Google...</p>
//     </div>
//   );
// }
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// ✅ Define a TypeScript interface for user storage
interface StoredUser {
  id: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  name: string;
  image: string | null;
}

export default function GoogleSuccessPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (session?.user?.id && session.user.email) {
      const fullName = session.user.name || "";
      const [firstname, ...rest] = fullName.split(" ");
      const lastname = rest.join(" ");

      // Ensure username exists
      const username = session.user.username || session.user.email.split("@")[0];

      const userData: StoredUser = {
        id: session.user.id,
        email: session.user.email,
        username,
        firstname: firstname || "",
        lastname: lastname || "",
        name: fullName,
        image: session.user.image || null,
      };

      // Save typed user to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("✅ Google user stored in localStorage:", userData);

      // Redirect to timeline
      router.push("/dashboard/timeline");
    } else {
      console.log("❌ No session found, redirecting to login");
      router.push("/authentication/login");
    }
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center h-screen text-gray-600">
      <p>Signing you in with Google...</p>
    </div>
  );
}

