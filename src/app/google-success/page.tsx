// // "use client";

// // import { useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import { useSession } from "next-auth/react";

// // export default function GoogleSuccess() {
// //   const router = useRouter();
// //   const { data: session, status } = useSession();

// //   useEffect(() => {
// //     if (status === "loading") return;

// //     if (session?.user?.id && session?.user?.email) {
// //       localStorage.setItem(
// //         "user",
// //         JSON.stringify({
// //           id: session.user.id,
// //           email: session.user.email,
// //         })
// //       );
// //       console.log("✅ Google user stored in localStorage:", session.user);

// //       // Redirect to your main page (change /dashboard if you want)
// //       router.push("/dashboard");
// //     } else {
// //       console.log("❌ No session found, returning to login");
// //       router.push("/login");
// //     }
// //   }, [session, status, router]);

// //   return (
// //     <div className="flex items-center justify-center h-screen">
// //       <p className="text-gray-600 text-lg">
// //         Setting up your Google account, please wait...
// //       </p>
// //     </div>
// //   );
// // }
// // "use client";

// // import { useEffect } from "react";
// // import { useRouter, useSearchParams } from "next/navigation";
// // import axios from "axios";

// // export default function GoogleSuccessPage() {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const userId = searchParams.get("id");

// //   useEffect(() => {
// //     const fetchUser = async () => {
// //       if (!userId) return;

// //       try {
// //         const res = await axios.get(`/api/my-profile/${userId}`);
// //         const user = res.data;

// //         // ✅ Store full user info in localStorage
// //         localStorage.setItem(
// //           "user",
// //           JSON.stringify({
// //             id: user.id,
// //             email: user.email,
// //             firstname: user.firstname,
// //           })
// //         );

// //         console.log("✅ Google user stored:", user.firstname);

// //         // Redirect to dashboard (or wherever you want)
// //         router.push("/dashboard");
// //       } catch (err) {
// //         console.error("Failed to fetch Google user:", err);
// //         router.push("/authentication/login");
// //       }
// //     };

// //     fetchUser();
// //   }, [userId, router]);

// //   return (
// //     <div className="flex items-center justify-center h-screen text-lg">
// //       Signing you in with Google...
// //     </div>
// //   );
// // }
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        // ✅ Fetch full user info from DB
        const res = await axios.get(`/api/my-profile/${userId}`);
        const user = res.data;

        // ✅ Store it in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,
            email: user.email,
            firstname: user.firstname,
          })
        );

        console.log("✅ Google user stored in localStorage:", user.firstname);

        // Redirect to dashboard or home
        router.push("/dashboard");
      } catch (err) {
        console.error("❌ Failed to fetch Google user:", err);
        router.push("/authentication/login");
      }
    };

    fetchUser();
  }, [userId, router]);

  return (
    <div className="flex items-center justify-center h-screen text-lg">
      Signing you in with Google...
    </div>
  );
}
