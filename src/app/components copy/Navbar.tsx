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
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

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
    {/* You can refine the Taegeuk symbol here */}
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
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border px-3 py-2 rounded-md bg-white text-black dark:bg-gray-800 dark:text-white"
      >
        <currentLang.Flag />
        <span className="text-sm">{currentLang.label}</span>
        <svg
          className="w-4 h-4 ml-2"
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

      {isOpen && (
        <div className="absolute mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 w-40">
          {languages.map(({ code, label, Flag }) => (
            <button
              key={code}
              onClick={() => changeLocale(code)}
              className="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Flag />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
