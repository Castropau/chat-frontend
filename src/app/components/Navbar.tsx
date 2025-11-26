// "use client";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const Navbar = () => {
//   const [locale, setLocale] = useState<string>("");
//   const router = useRouter();

//   useEffect(() => {
//     const cookieLocale = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("MYNEXTAPP_LOCALE="))
//       ?.split("=")[1];

//     if (cookieLocale) {
//       setLocale(cookieLocale);
//     } else {
//       const browserLocale = navigator.language.slice(0, 2);
//       setLocale(browserLocale);
//       document.cookie = `MYNEXTAPP_LOCALE=${browserLocale}; path=/`;
//       router.refresh();
//     }
//   }, [router]);

//   const changeLocale = (newLocale: string) => {
//     setLocale(newLocale);
//     document.cookie = `MYNEXTAPP_LOCALE=${newLocale}; path=/`;
//     router.refresh();
//   };

//   return (
//     <div className="flex items-center gap-3">
//       <label
//         htmlFor="language-select"
//         className="text-sm font-medium text-white dark:text-gray-300"
//       >
//         Language:
//       </label>
//       <select
//         id="language-select"
//         value={locale}
//         onChange={(e) => changeLocale(e.target.value)}
//         className="border p-2 rounded-md text-sm bg-white text-black dark:bg-gray-800 dark:text-white"
//       >
//         <option value="en">English</option>
//         <option value="fr">Français</option>
//         {/* Add more languages here as needed */}
//       </select>
//     </div>
//   );
// };

// export default Navbar;
"use client";
// import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
// import jwtDecode from "jwt-decode";
// import Cookies from "js-cookie"; // Make sure this is at the top
// import { useAuth } from "../authentication/context/AuthContext";
import Link from "next/link";
import { FaFacebookMessenger } from "react-icons/fa";
import CreateGoalModal from "../dashboard/timeline/_components/CreateGoalModal";
import { MdViewTimeline } from "react-icons/md";
import { deleteCookies } from "@/server/action/deleteCookies";
import { ThemeToggleButton } from "./ThemeToggleButton";
// import Notification from "../dashboard/timeline/_components/Notification";
import NotificationBell from "../dashboard/timeline/_components/Notification";
import UserDropdown from "./UserDropdown";
import axios from "axios";
import { useSession } from "next-auth/react";

const FlagEn = () => (
  <svg
    width="20"
    height="14"
    viewBox="0 0 60 30"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="English"
  >
    <clipPath id="t">
      <path d="M0 0v30h60V0z" />
    </clipPath>
    <clipPath id="s">
      <path d="M30 15h30v15zM0 0h30v15z" />
    </clipPath>
    <g clipPath="url(#t)">
      <path fill="#012169" d="M0 0h60v30H0z" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#FFF" strokeWidth="6" />
      <path
        d="M0 0l60 30M60 0L0 30"
        clipPath="url(#s)"
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path fill="#FFF" d="M25 0h10v30H25zM0 10h60v10H0z" />
      <path fill="#C8102E" d="M27 0h6v30h-6zM0 12h60v6H0z" />
    </g>
  </svg>
);

const FlagFr = () => (
  <svg
    width="20"
    height="14"
    viewBox="0 0 3 2"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Français"
  >
    <rect width="1" height="2" fill="#0055A4" />
    <rect x="1" width="1" height="2" fill="#FFF" />
    <rect x="2" width="1" height="2" fill="#EF4135" />
  </svg>
);

const FlagKr = () => (
  <svg
    width="20"
    height="14"
    viewBox="0 0 60 40"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="한국어"
  >
    <rect width="60" height="40" fill="#fff" />
    <circle cx="30" cy="20" r="10" fill="#fff" />
    <circle cx="30" cy="20" r="10" fill="none" stroke="#000" strokeWidth="2" />
    <circle cx="30" cy="20" r="7" fill="#cd2e3a" />
    <circle cx="30" cy="20" r="5" fill="#0047a0" />
  </svg>
);

const languages = [
  { code: "en", label: "English", Flag: FlagEn },
  { code: "fr", label: "Français", Flag: FlagFr },
  { code: "kr", label: "한국어", Flag: FlagKr },
];

export default function Navbar() {
  const [locale, setLocale] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { data: session, status } = useSession();

  // const [user, setUser] = useState<{
  //   id: number;
  //   email: string;
  //   firstname: string;
  //   lastname?: string;
  //   name?: string;
  //   image?: string;
  // } | null>(null);
  const [user, setUser] = useState<User | null>(null);



  // Set locale from cookie or browser
  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("MYNEXTAPP_LOCALE="))
      ?.split("=")[1];

    if (cookieLocale) setLocale(cookieLocale);
    else {
      const browserLocale = navigator.language.slice(0, 2);
      setLocale(browserLocale);
      document.cookie = `MYNEXTAPP_LOCALE=${browserLocale}; path=/`;
      router.refresh();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [router]);

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    document.cookie = `MYNEXTAPP_LOCALE=${newLocale}; path=/`;
    router.refresh();
    setIsOpen(false);
  };

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  const handleLogout = async () => {
    try {
      setIsSigningOut(true);
      await deleteCookies("token");
      localStorage.removeItem("user");
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Load user from localStorage first
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);
 interface User {
  id: number;
  username?: string;   // Optional because manual login may not have it
  email?: string;      // Optional because manual login may not have it
  firstname: string;
  lastname?: string;
  name?: string;
  image?: string | null;
}


  // Fetch user info (Google or manual login)
//  useEffect(() => {
//   if (status === "loading") return;

//   const fetchUser = async () => {
//     try {
//       // let userData: any = null;
//         let userData: User | null = null; // ✅ type instead of any


//       const stored = localStorage.getItem("user");
//       const manualUser = stored ? JSON.parse(stored) : null;

//       // ✅ Manual login has priority
//       if (manualUser && !session?.user) {
//         // Fetch latest DB info for manual login
//         const res = await axios.get(`/api/my-profile/${manualUser.id}`);
//         const dbUser = res.data;
//         userData = {
//           ...manualUser,
//           firstname: dbUser.firstname || manualUser.firstname || "",
//           lastname: dbUser.lastname || manualUser.lastname || "",
//           name: `${dbUser.firstname || manualUser.firstname || ""} ${dbUser.lastname || manualUser.lastname || ""}`.trim(),
//         };
//       } 
//       // ✅ Google session used only if no manual login
//       else if (session?.user?.id) {
//         const res = await axios.get(`/api/my-profile/${session.user.id}`);
//         const dbUser = res.data;
//         const firstname = dbUser.firstname?.trim() || session.user.name?.split(" ")[0] || "";
//         const lastname = dbUser.lastname?.trim() || session.user.name?.split(" ").slice(1).join(" ") || "";
//         userData = {
//           id: dbUser.id,
//           email: dbUser.email,
//           firstname,
//           lastname,
//           name: `${firstname} ${lastname}`.trim(),
//           image: session.user.image,
//         };
//       }

//       if (userData) {
//         setUser(userData);
//         localStorage.setItem("user", JSON.stringify(userData));
//       } else {
//         router.push("/authentication/login");
//       }
//     } catch (err) {
//       console.error("Failed to fetch user:", err);
//       router.push("/authentication/login");
//     }
//   };

//   fetchUser();
// }, [session, status, router]);
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
useEffect(() => {
    if (status === "loading") return;

    const fetchUser = async () => {
      try {
        let userData: StoredUser | null = null;
        const stored = localStorage.getItem("user");
        const manualUser = stored ? JSON.parse(stored) : null;

        if (manualUser && !session?.user) {
          // const res = await axios.get<DbUser>(`/api/my-profile/${manualUser.id}`);
          const res = await axios.get<DbUser>(
  `/api/my-profile/${manualUser.id || manualUser.email}`
);

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
          // const res = await axios.get<DbUser>(`/api/my-profile/${userEmail}`);
          const res = await axios.get<DbUser>(
  `/api/my-profile/${manualUser.id || manualUser.email}`
);

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
        console.error("Failed to fetch user:2", err);
        router.push("/authentication/login");
      }
    };

    fetchUser();
  }, [session, status, router]);


  return (
    <nav className="fixed top-0 w-full px-6 py-4 shadow-md bg-white dark:bg-gray-900 flex justify-between items-center z-[100]">
      <div className="text-xl font-bold text-gray-800 dark:text-white">🌐 GrowUp</div>

      {user ? (
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700 dark:text-white mr-4">
            Hi, <strong>{user.name || user.firstname || "User"}</strong>
          </div>
          <button
            onClick={handleLogout}
            disabled={isSigningOut}
            className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-700 dark:text-white mr-4">Loading...</div>
      )}

      <div className="relative z-[9999] flex" ref={dropdownRef}>
        <NotificationBell />
        <ThemeToggleButton />
        <CreateGoalModal />
        <Link
          href="/dashboard/timeline"
          className="mr-3 text-blue-600 hover:text-blue-800 transition flex items-center"
          aria-label="Timeline"
          title="Timeline"
        >
          <MdViewTimeline className="text-2xl" />
        </Link>
        <Link
          href="/dashboard/"
          className="mr-3 text-blue-600 hover:text-blue-800 transition flex items-center"
          aria-label="Messenger"
          title="Messenger"
        >
          <FaFacebookMessenger className="text-2xl" />
        </Link>
        <UserDropdown />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <currentLang.Flag />
          <span>{currentLang.label}</span>
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg z-[10000]">
            {languages.map(({ code, label, Flag }) => (
              <button
                key={code}
                onClick={() => changeLocale(code)}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
              >
                <Flag />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
