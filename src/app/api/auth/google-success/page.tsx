// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";

// export default function GoogleSuccess() {
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     if (status === "loading") return;

//     if (session?.user?.id && session?.user?.email) {
//       localStorage.setItem(
//         "user",
//         JSON.stringify({
//           id: session.user.id,
//           email: session.user.email,
//         })
//       );
//       console.log("✅ Google user stored in localStorage:", session.user);

//       // Redirect to your main page (change /dashboard if you want)
//       router.push("/dashboard");
//     } else {
//       console.log("❌ No session found, returning to login");
//       router.push("/login");
//     }
//   }, [session, status, router]);

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <p className="text-gray-600 text-lg">
//         Setting up your Google account, please wait...
//       </p>
//     </div>
//   );
// }
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";

// export default function GoogleSuccess() {
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     if (status === "loading") return;

//     if (session?.user?.id && session?.user?.email) {
//       // Fetch firstname from backend
//       const fetchUserData = async () => {
//         try {
//           const res = await fetch(`/api/profile/${session.user!.id}`);
//           const data = await res.json();

//           localStorage.setItem(
//             "user",
//             JSON.stringify({
//               id: session.user!.id,
//               email: session.user!.email,
//               firstname: data.firstname, // ✅ include firstname
//             })
//           );

//           console.log("✅ Google user saved:", data.firstname);
//           router.push("/dashboard");
//         } catch (err) {
//           console.error("Error fetching firstname:", err);
//           router.push("/dashboard");
//         }
//       };

//       fetchUserData();
//     } else {
//       router.push("/login");
//     }
//   }, [session, status, router]);

//   return (
//     <div className="flex items-center justify-center h-screen text-gray-600">
//       <p>Setting up your account, please wait...</p>
//     </div>
//   );
// }


// gumagana
// "use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function GoogleSuccess() {
//   const router = useRouter();

//   useEffect(() => {
//     const getGoogleUser = async () => {
//       // Retrieve email from sessionStorage or query param
//       const email = localStorage.getItem("google_email");
//       if (!email) return router.push("/authentication/login");

//       const res = await fetch(`/api/auth/google-user?email=${email}`);
//       const data = await res.json();

//       if (res.ok && data.user) {
//         localStorage.setItem("user", JSON.stringify(data.user));
//         router.push("/dashboard");
//       } else {
//         console.error("User not found:", data.error);
//       }
//     };

//     getGoogleUser();
//   }, [router]);

//   return <div>Loading your account...</div>;
// }
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUser = async () => {
      const id = searchParams.get("id");
      if (!id) {
        console.error("❌ Missing user ID from Google redirect");
        return router.push("/authentication/login");
      }

      try {
        const res = await fetch(`/api/my-profile/${id}`);
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("user", JSON.stringify(data));
          console.log("✅ Google user stored:", data);
          router.push("/dashboard");
        } else {
          console.error("❌ User fetch failed:", data.error);
          router.push("/authentication/login");
        }
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        router.push("/authentication/login");
      }
    };

    fetchUser();
  }, [router, searchParams]);

  return <div>Loading your account...</div>;
}
