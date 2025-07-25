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
import { useAuth } from "../authentication/context/AuthContext";
import Link from "next/link";
import { FaFacebookMessenger } from "react-icons/fa";
import CreateGoalModal from "../dashboard/timeline/_components/CreateGoalModal";
import { MdViewTimeline } from "react-icons/md";

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
  // const [userEmail, setUserEmail] = useState<string | null>(null);
  // const { email } = useAuth();
  const { userEmail, logout } = useAuth(); // get email from context directly

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("MYNEXTAPP_LOCALE="))
      ?.split("=")[1];

    if (cookieLocale) {
      setLocale(cookieLocale);
    } else {
      const browserLocale = navigator.language.slice(0, 2);
      setLocale(browserLocale);
      document.cookie = `MYNEXTAPP_LOCALE=${browserLocale}; path=/`;
      router.refresh();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
  //  const token = localStorage.getItem("authTokens");
  //     if (token) {
  //       try {
  //         const decoded: DecodedToken = jwtDecode(token);
  //         setUserEmail(decoded.email || decoded.username); // fallback to username
  //       } catch (error) {
  //         console.error("Invalid token:", error);
  //       }
  //     }
  // useEffect(() => {
  //   const token = localStorage.getItem("authTokens");
  //   if (token) {
  //     try {
  //       const decoded: DecodedToken = jwtDecode(token);
  //       setUserEmail(decoded.email || decoded.username); // fallback to username
  //     } catch (error) {
  //       console.error("Invalid token:", error);
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   // const token = Cookies.get("token"); // ✅ Use Cookies instead of localStorage
  //   const token = localStorage.getItem("authTokens") || Cookies.get("token");

  //   if (token) {
  //     try {
  //       const decoded: DecodedToken = jwtDecode(token);
  //       const emailOrUsername = decoded.email || decoded.username;
  //       setUserEmail(emailOrUsername);
  //       console.log("Decoded user email/username:", emailOrUsername); // ✅ This will now show
  //     } catch (error) {
  //       console.error("Invalid token:", error);
  //     }
  //   }
  // }, []);

  const handleLogout = () => {
    logout();
    router.push("/authentication/login"); // or wherever you want to send user after logout
  };
  return (
    <nav className="fixed top-0 w-full px-6 py-4 shadow-md bg-white dark:bg-gray-900 flex justify-between items-center">
      <div className="text-xl font-bold text-gray-800 dark:text-white">
        🌐 MyPlatform
      </div>
      {/* {userEmail && (
        <div className="text-sm text-gray-700 dark:text-white mr-4">
          Signed in as <strong>{userEmail}</strong>
        </div>
      )} */}
      {userEmail ? (
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700 dark:text-white mr-4">
            Signed in as <strong>{userEmail}</strong>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-700 dark:text-white mr-4">
          Please login
        </div>
      )}

      <div className="relative flex" ref={dropdownRef}>
        <CreateGoalModal />
        <Link
          href="/dashboard/timeline"
          className="mr-3 text-blue-600 hover:text-blue-800 transition flex items-center"
          aria-label="Facebook Messenger"
          title="Timeline"
        >
          <MdViewTimeline className="text-2xl" />
        </Link>
        <Link
          href="/dashboard/"
          className="mr-3 text-blue-600 hover:text-blue-800 transition flex items-center"
          aria-label="Facebook Messenger"
          title="Messenger"
        >
          <FaFacebookMessenger className="text-2xl" />
        </Link>
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {/* <Link
          href="/dashboard/"
          className="ml-3 text-blue-600 hover:text-blue-800 transition flex items-center"
          aria-label="Facebook Messenger"
          title="Messenger"
        >
          <FaFacebookMessenger className="text-2xl" />
        </Link> */}
        {isOpen && (
          <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-20 w-44">
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
