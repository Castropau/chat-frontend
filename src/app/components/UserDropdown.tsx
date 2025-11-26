// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { deleteCookies } from "@/server/action/deleteCookies";

// export default function UserDropdown() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSigningOut, setIsSigningOut] = useState(false);
//   const router = useRouter();

//   const toggleDropdown = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setIsOpen((prev) => !prev);
//   };

//   const handleLogout = async () => {
//     try {
//       setIsSigningOut(true);
//       await deleteCookies("token");
//       router.push("/");
//     } catch (err) {
//       console.error("Logout failed", err);
//     } finally {
//       setIsSigningOut(false);
//     }
//   };

//   // close when clicking outside
//   useEffect(() => {
//     const handleClickOutside = () => setIsOpen(false);
//     if (isOpen) {
//       document.addEventListener("click", handleClickOutside);
//     }
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [isOpen]);
// const [user, setUser] = useState<{
//     id: number;
//     email: string;
//     firstname: string;
//   } | null>(null);
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);
//   return (
//     <div className="relative z-[9998]">
//       <button
//         onClick={toggleDropdown}
//         className="flex items-center text-gray-700"
//       >
//         <span className="mr-3 overflow-hidden rounded-full h-11 w-11 bg-gray-200 flex items-center justify-center text-sm font-semibold">
//           TN
//         </span>

//         <span className="block mr-1 font-medium text-black dark:text-white">
//           Test names
//         </span>

//         <svg
//           className={`stroke-gray-500 transition-transform duration-200 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//           width="18"
//           height="20"
//           viewBox="0 0 18 20"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
//             stroke="currentColor"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-[17px] w-[260px] flex flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900">
//           {/* User info */}
//           <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
//             <span className="block font-medium text-gray-800 dark:text-white">
//               Test names
//             </span>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               testemail@email.com
//             </span>
//           </div>

//           {/* Dropdown links */}
//           <ul className="flex flex-col gap-1 py-3">
//             {[
//               { label: "Edit Profile", href: "/profile" },
//               //  { label: "Profile", href: "/dashboard/profile" },
//                   { label: "Profile", href: user ? `/dashboard/profile/${user.id}` : "/profile" },

//               { label: "Change Password", href: "/change-password" },
//               { label: "Account Settings", href: "/settings" },
//               { label: "Support", href: "/support" },
//             ].map((item) => (
//               <li key={item.label}>
//                 <a
//                   href={item.href}
//                   onClick={() => setIsOpen(false)}
//                   className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-gray-700 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
//                 >
//                   <span>•</span>
//                   {item.label}
//                 </a>
//               </li>
//             ))}
//           </ul>

//           {/* Logout */}
//           <button
//             onClick={handleLogout}
//             disabled={isSigningOut}
//             className="mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
//           >
//             {isSigningOut ? (
//               <>
//                 <span className="loading loading-spinner loading-sm"></span>
//                 <span>Signing out...</span>
//               </>
//             ) : (
//               <>
//                 <svg
//                   className="w-4 h-4 fill-current"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path d="M15 3H9a2 2 0 0 0-2 2v4h2V5h6v14H9v-4H7v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM10.59 15.59 9.17 14l3.58-3.59L9.17 7.82 10.59 6.4 16.18 12l-5.59 5.59z" />
//                 </svg>
//                 Sign Out
//               </>
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }








// working
// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { deleteCookies } from "@/server/action/deleteCookies";
// import { signOut, useSession } from "next-auth/react";

// export default function UserDropdown() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSigningOut, setIsSigningOut] = useState(false);
//   const router = useRouter();
//   const { data: session } = useSession();

//   const toggleDropdown = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setIsOpen((prev) => !prev);
//   };

//   const handleLogout = async () => {
//     try {
//       setIsSigningOut(true);

//       // ✅ Delete your token cookie
//       await deleteCookies("token");

//       // ✅ Clear localStorage user info
//       localStorage.removeItem("user");

//       // ✅ Sign out Google/NextAuth session if exists
//       if (session) {
//         await signOut({ redirect: false }); // redirect false because we'll redirect manually
//       }

//       router.push("/"); // redirect to home or login page
//     } catch (err) {
//       console.error("Logout failed", err);
//     } finally {
//       setIsSigningOut(false);
//     }
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = () => setIsOpen(false);
//     if (isOpen) {
//       document.addEventListener("click", handleClickOutside);
//     }
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [isOpen]);

//   const [user, setUser] = useState<{
//     id: number;
//     email: string;
//     firstname: string;
//   } | null>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   return (
//     <div className="relative z-[9998]">
//       <button onClick={toggleDropdown} className="flex items-center text-gray-700">
//         <span className="mr-3 overflow-hidden rounded-full h-11 w-11 bg-gray-200 flex items-center justify-center text-sm font-semibold">
//           {user?.firstname?.[0] || "U"}{user?.lastname?.[0] || ""}
//         </span>
//         <span className="block mr-1 font-medium text-black dark:text-white">
//           {user?.firstname || "User"}
//         </span>
//         <svg
//           className={`stroke-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
//           width="18"
//           height="20"
//           viewBox="0 0 18 20"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M4.3125 8.65625L9 13.3437L13.6875 8.65625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-[17px] w-[260px] flex flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900">
//           {/* User info */}
//           <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
//             <span className="block font-medium text-gray-800 dark:text-white">
//               {user?.firstname || "User"}
//             </span>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               {user?.email || "user@example.com"}
//             </span>
//           </div>

//           {/* Dropdown links */}
//           <ul className="flex flex-col gap-1 py-3">
//             {[
//               { label: "Edit Profile", href: "/profile" },
//               { label: "Profile", href: user ? `/dashboard/profile/${user.id}` : "/profile" },
//               { label: "Change Password", href: "/change-password" },
//               { label: "Account Settings", href: "/settings" },
//               { label: "Support", href: "/support" },
//             ].map((item) => (
//               <li key={item.label}>
//                 <a
//                   href={item.href}
//                   onClick={() => setIsOpen(false)}
//                   className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-gray-700 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
//                 >
//                   <span>•</span>
//                   {item.label}
//                 </a>
//               </li>
//             ))}
//           </ul>

//           {/* Logout */}
//           <button
//             onClick={handleLogout}
//             disabled={isSigningOut}
//             className="mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
//           >
//             {isSigningOut ? (
//               <>
//                 <span className="loading loading-spinner loading-sm"></span>
//                 <span>Signing out...</span>
//               </>
//             ) : (
//               <>
//                 <svg
//                   className="w-4 h-4 fill-current"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path d="M15 3H9a2 2 0 0 0-2 2v4h2V5h6v14H9v-4H7v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM10.59 15.59 9.17 14l3.58-3.59L9.17 7.82 10.59 6.4 16.18 12l-5.59 5.59z" />
//                 </svg>
//                 Sign Out
//               </>
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCookies } from "@/server/action/deleteCookies";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
// import { getSocket } from "@/utils/webSocket";
import Image from "next/image";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
    firstname: string;
    lastname?: string;
    name?: string;
    image?: string;
  } | null>(null);
// interface User {
//   id: string;
//   email: string;
//   username: string;
//   firstname: string;
//   lastname: string;
//   name: string;
//   image?: string | null;
// }
interface StoredUser {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname?: string;
  name?: string;
  image?: string;
}

interface DbUser {
  id: number;
  username?: string;
  email: string;
  firstname?: string;
  lastname?: string;
  image?: string | null;
}
  // Load stored user first
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Fetch user info (manual login prioritized, then Google)
//   useEffect(() => {
//     if (status === "loading") return;

//     const fetchUser = async () => {
//       try {
//         let userData: User | null = null;

//         const stored = localStorage.getItem("user");
//         const manualUser = stored ? JSON.parse(stored) : null;

//         // ✅ Manual login first
//         if (manualUser && !session?.user) {
//           const res = await axios.get(`/api/my-profile/${manualUser.id}`);
//           const dbUser = res.data;
//           userData = {
//             ...manualUser,
//             username: dbUser.username || session!.user!.email!.split("@")[0] || `user${dbUser.id}`,

//             firstname: dbUser.firstname || manualUser.firstname || "",
//             lastname: dbUser.lastname || manualUser.lastname || "",
//             name: `${dbUser.firstname || manualUser.firstname || ""} ${dbUser.lastname || manualUser.lastname || ""}`.trim(),
//             //  image: dbUser.image ? `/image/users/${dbUser.image}` : undefined, // use local image if exists
//              image: dbUser.image ? `${dbUser.image}` : undefined, // use local image if exists

//           };
//         }
//         // ✅ Google session next
//         else if (session?.user?.id) {
//           const res = await axios.get(`/api/my-profile/${session.user.id}`);
//           const dbUser = res.data;

//           const firstname = dbUser.firstname?.trim() || session.user.name?.split(" ")[0] || "";
//           const lastname = dbUser.lastname?.trim() || session.user.name?.split(" ").slice(1).join(" ") || "";

//           userData = {
//             id: dbUser.id,
//             email: dbUser.email,
//             firstname,
//             lastname,
//             name: `${firstname} ${lastname}`.trim(),
//               username: dbUser.username || session.user.email!.split("@")[0], // ✅ fallback if empty
//             // image: session.user.image,
// image:
//   session.user.image ||
//   (dbUser.image ? `${dbUser.image}` : null),

//             //  image: session.user.image || (dbUser.image ? `/image/users/${dbUser.image}` : undefined),

//           };
//         }

//         if (userData) {
//           setUser(userData);
//           localStorage.setItem("user", JSON.stringify(userData));
//         } else {
//           router.push("/authentication/login");
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//         router.push("/authentication/login");
//       }
//     };

//     fetchUser();
//   }, [session, status, router]);
  useEffect(() => {
    if (status === "loading") return;

    const fetchUser = async () => {
      try {
        let userData: StoredUser | null = null;
        const stored = localStorage.getItem("user");
        const manualUser = stored ? JSON.parse(stored) : null;

        if (manualUser && !session?.user) {
          const res = await axios.get<DbUser>(`/api/my-profile/${manualUser.id}`);
          const dbUser = res.data;

          userData = {
            ...manualUser,
            username: dbUser.username || `user${dbUser.id}`,
            firstname: dbUser.firstname || manualUser.firstname || "",
            lastname: dbUser.lastname || manualUser.lastname || "",
            name: `${dbUser.firstname || manualUser.firstname || ""} ${dbUser.lastname || manualUser.lastname || ""}`.trim(),
            image: dbUser.image || undefined,
          };
        } else if (session?.user?.email) {
          const userEmail = session.user.email!;
          const res = await axios.get<DbUser>(`/api/my-profile/${userEmail}`);
          const dbUser = res.data;

          const firstname = dbUser.firstname || session.user.name?.split(" ")[0] || "";
          const lastname = dbUser.lastname || session.user.name?.split(" ").slice(1).join(" ") || "";

          userData = {
            id: dbUser.id,
            email: dbUser.email,
            username: dbUser.username || userEmail.split("@")[0],
            firstname,
            lastname,
            name: `${firstname} ${lastname}`.trim(),
            image: session.user.image || dbUser.image || undefined,
          };
        }

        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          router.push("/authentication/login");
        }
      } catch (err) {
        console.error("Failed to fetch user1:", err);
        router.push("/authentication/login");
      }
    };

    fetchUser();
  }, [session, status, router]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  // const handleLogout = async () => {
  //   try {
  //     setIsSigningOut(true);

  //     // Clear localStorage
  //     localStorage.removeItem("user");

  //     // Delete token cookie
  //     await deleteCookies("token");

  //     // Sign out Google session if exists
  //     if (session) {
  //       await signOut({ redirect: false });
  //     }

  //     // Reset local state
  //     setUser(null);

  //     router.push("/");
  //   } catch (err) {
  //     console.error("Logout failed", err);
  //   } finally {
  //     setIsSigningOut(false);
  //   }
  // };
//   const handleLogout = async () => {
//   try {
//     setIsSigningOut(true);

//     localStorage.removeItem("user");

//     // 🔥 This triggers logout in other tabs
//     localStorage.setItem("logout", Date.now());

//     await deleteCookies("token");

//     if (session) {
//       await signOut({ redirect: false });
//     }

//     setUser(null);
//     router.push("/");
//   } finally {
//     setIsSigningOut(false);
//   }
// };








// import { deleteCookie } from "cookies-next";
// done
const handleLogout = async () => {
  try {
    setIsSigningOut(true);
     if (user?.id) {
      await fetch("/api/set-offline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
    }


    // 1️⃣ Clear your app data
    localStorage.removeItem("user");
    localStorage.setItem("logout", Date.now().toString()); // notify other tabs

    await deleteCookies("token");

    // 2️⃣ Clear NextAuth / Google cookies even if no session exists
    const nextAuthCookies = [
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.csrf-token",
      "next-auth.callback-url",
      "next-auth.pkce.code_verifier",
      "next-auth.state",
    ];
    nextAuthCookies.forEach((cookie) => deleteCookies(cookie));

    // 3️⃣ Logout Google session if session exists
    if (session) {
      await signOut({ redirect: false });
    }

    // 4️⃣ Reset local state & redirect
    setUser(null);
    router.push("/");
  } finally {
    setIsSigningOut(false);
  }
};

// const handleLogout = async () => {
//   try {
//     setIsSigningOut(true);

//     // Clear localStorage
//     localStorage.removeItem("user");

//     // Delete all relevant cookies
//     const cookiesToDelete = [
//       "token",
//       "__next_hmr_refresh_hash__",
//       "MYNEXTAPP_LOCALE",
//       "next-auth.session-token",
//       "next-auth.csrf-token",
//       "next-auth.callback-url",
//       "PHPSESSID",
//     ];

//     for (const name of cookiesToDelete) {
//       await deleteCookies(name);
//     }

//     // Sign out NextAuth session (Google or other providers)
//     if (session) {
//       await signOut({ redirect: false });
//     }

//     // Reset local state
//     setUser(null);

//     // Redirect to homepage
//     router.push("/");
//   } catch (err) {
//     console.error("Logout failed", err);
//   } finally {
//     setIsSigningOut(false);
//   }
// };
// const handleLogout = async () => {
//   try {
//     setIsSigningOut(true);

//     // Clear localStorage
//     localStorage.removeItem("user");

//     // Set a flag in localStorage for other tabs
//     localStorage.setItem("logout", Date.now().toString());

//     // Delete token cookie
//     await deleteCookies("token");

//     // Sign out NextAuth session
//     if (session) await signOut({ redirect: false });

//     setUser(null);

//     // Redirect this tab
//     window.location.href = "/";
//   } catch (err) {
//     console.error("Logout failed", err);
//   } finally {
//     setIsSigningOut(false);
//   }
// };

// const handleLogout = async () => {
//   try {
//     setIsSigningOut(true);
//     const socket = getSocket();

//     if (user?.id && socket) {
//       // Emit typing stop before logging out
//       socket.emit("typing:stop", {
//         senderId: user.id,
//         receiverId: null, // null will broadcast to all open chats if you want, or loop through chat partners
//         senderName: user.firstname || user.email || user.username,
//       });

//       await fetch("/api/set-offline", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: user.id }),
//       });
//     }

//     // Clear local storage & cookies
//     localStorage.removeItem("user");
//     localStorage.setItem("logout", Date.now());
//     await deleteCookies("token");

//     if (session) {
//       await signOut({ redirect: false });
//     }

//     setUser(null);
//     router.push("/");
//   } finally {
//     setIsSigningOut(false);
//   }
// };

  return (
    <div className="relative z-[9998]">
      <button onClick={toggleDropdown} className="flex items-center text-gray-700">
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 bg-gray-200 flex items-center justify-center text-sm font-semibold">
          {/* {user?.firstname?.[0] || "U"}{user?.lastname?.[0] || ""} */}
          {user?.image ? (
  <Image
    width={44}
    height={44}
    src={user.image}
    alt="Profile"
    className="h-full w-full object-cover rounded-full"
    
  />
) : (
  `${user?.firstname?.[0] || "U"}${user?.lastname?.[0] || ""}`
)}

        </span>
        <span className="block mr-1 font-medium text-black dark:text-white">
          {user?.firstname || "User"}
        </span>
        <svg
          className={`stroke-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4.3125 8.65625L9 13.3437L13.6875 8.65625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-[17px] w-[260px] flex flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
            <span className="block font-medium text-gray-800 dark:text-white">{user?.firstname || "User"}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{user?.email || "user@example.com"}</span>
          </div>

          <ul className="flex flex-col gap-1 py-3">
            {[
              { label: "Edit Profile", href: "/profile" },
              { label: "Profile", href: user ? `/dashboard/user_profile/${user.username}` : "/profile" },
              { label: "Change Password", href: "/dashboard/edit_profile/change-password" },
              { label: "Account Settings", href: "/settings" },
              { label: "Support", href: "/support" },
            ].map(item => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-gray-700 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <span>•</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            onClick={handleLogout}
            disabled={isSigningOut}
            className="mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            {isSigningOut ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H9a2 2 0 0 0-2 2v4h2V5h6v14H9v-4H7v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM10.59 15.59 9.17 14l3.58-3.59L9.17 7.82 10.59 6.4 16.18 12l-5.59 5.59z" />
                </svg>
                Sign Out
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}


