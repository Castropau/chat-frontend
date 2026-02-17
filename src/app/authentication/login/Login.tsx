// "use client";

// import React, { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import axios, { AxiosError } from "axios";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useTranslations } from "next-intl";
// import { useAuth } from "../context/AuthContext";
// import { setCookies } from "@/server/action/setCookies";
// import { signIn } from "next-auth/react";

// export default function LoginPage() {
//   const router = useRouter();
//   const t = useTranslations("LoginPage");

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errorKey, setErrorKey] = useState<string | null>(null);
//   const [googleLoading, setGoogleLoading] = useState(false); // ✅ new state
//   const { setToken } = useAuth();

//   const { mutate: login, isPending } = useMutation({
//     mutationFn: (data: { email: string; password: string }) =>
//       axios.post("/api/login/", data),
//     onSuccess: (response) => {
//       const token = response.data.token;
//       localStorage.setItem("user", JSON.stringify(response.data.user));

//       setCookies("token", token);
//       setToken(token);
//       router.push("/dashboard");
//     },
//     onError: (error) => {
//       if (error instanceof AxiosError) {
//         if (error.code === "ERR_NETWORK") setErrorKey("networkError");
//         else if (error.response?.status === 401) setErrorKey("incorrect");
//         else setErrorKey("genericError");
//       } else setErrorKey("genericError");
//     },
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   function validateEmail(email: string) {
//     return /\S+@\S+\.\S+/.test(email);
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorKey(null);

//     if (!formData.email || !validateEmail(formData.email)) {
//       setErrorKey("invalidEmail");
//       return;
//     }
//     if (!formData.password) {
//       setErrorKey("emptyPassword");
//       return;
//     }

//     login(formData);
//   };

//   // const handleGoogleSignIn = async () => {
//   //   setGoogleLoading(true);
//   //   try {
//   //     await signIn("google", { callbackUrl: "/dashboard" });
//   //   } finally {
//   //     setGoogleLoading(false);
//   //   }
//   // };
//   const handleGoogleSignIn = async () => {
//   setGoogleLoading(true);
//   try {
//     await signIn("google", { callbackUrl: "/dashboard" });
//   } finally {
//     setGoogleLoading(false);
//   }
// };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 to-pink-300">
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
//         <div
//           className="hidden md:block md:w-1/2 bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp')",
//           }}
//         />
//         <div className="w-full md:w-1/2 p-8 sm:p-12">
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">{t("loginTitle")}</h2>
//           <p className="text-gray-600 mb-8">{t("loginSubtitle")}</p>

//           {errorKey && <div className="mb-4 text-red-500 text-sm">{t(errorKey)}</div>}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t("email")}</label>
//               <input
//                 type="text"
//                 name="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t("password")}</label>
//               <input
//                 type="password"
//                 name="password"
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
//               />
//             </div>

//             <button
//               type="button"
//               onClick={handleGoogleSignIn}
//               disabled={googleLoading}
//               className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
//             >
//               {googleLoading ? "Please wait..." : <>
//                 <img
//                   src="https://www.svgrepo.com/show/475656/google-color.svg"
//                   alt="Google logo"
//                   className="w-5 h-5"
//                 />
//                 Sign in with Google
//               </>}
//             </button>

//             <div className="flex justify-between items-center text-sm text-gray-600">
//               <a href="#" className="hover:underline">{t("forgotPassword")}</a>
//             </div>

//             <button
//               type="submit"
//               disabled={isPending}
//               className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
//             >
//               {isPending ? t("loggingIn") : t("login")}
//             </button>
//           </form>

//           <p className="mt-6 text-center text-sm text-gray-600">
//             {t("noAccount")}{" "}
//             <Link
//               href="/authentication"
//               className="text-rose-600 font-medium hover:underline"
//             >
//               {t("registerNow")}
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
// "use client";

// import React, { useEffect, useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import axios, { AxiosError } from "axios";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useTranslations } from "next-intl";
// import { useAuth } from "../context/AuthContext";
// import { setCookies } from "@/server/action/setCookies";
// import { signIn, useSession } from "next-auth/react";

// export default function LoginPage() {
//   const router = useRouter();
//   const t = useTranslations("LoginPage");

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errorKey, setErrorKey] = useState<string | null>(null);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const { setToken } = useAuth();
//   const { data: session } = useSession();

//   const [hasToken, setHasToken] = useState(false);

//   // 🔥 Detect token cookie automatically
//   useEffect(() => {
//     const detectToken = () => {
//       const cookieExists = document.cookie.includes("token=");
//       setHasToken(cookieExists);
//     };

//     detectToken();
//     const interval = setInterval(detectToken, 300); // check every 300ms
//     return () => clearInterval(interval);
//   }, []);

//   // 🔥 Detect login in other tabs
//   useEffect(() => {
//     const sync = (event: StorageEvent) => {
//       if (event.key === "login") {
//         router.replace("/dashboard/timeline");
//       }
//     };

//     window.addEventListener("storage", sync);
//     return () => window.removeEventListener("storage", sync);
//   }, []);

//   // 🔥 If cookie exists OR NextAuth session exists → redirect
//   useEffect(() => {
//     if (hasToken || session?.user) {
//       router.replace("/dashboard/timeline");
//     }
//   }, [hasToken, session, router]);

//   // -------------------------
//   //    Manual Login Handler
//   // -------------------------
//   const { mutate: login, isPending } = useMutation({
//     mutationFn: (data: { email: string; password: string }) =>
//       axios.post("/api/login/", data),

//     onSuccess: (response) => {
//       const token = response.data.token;

//       localStorage.setItem("user", JSON.stringify(response.data.user));

//       // 🔥 IMPORTANT for cross-tab & auto-redirect
//       localStorage.setItem("login", Date.now().toString());

//       setCookies("token", token);
//       setToken(token);
//       router.push("/dashboard/timeline");
//     },

//     onError: (error) => {
//       if (error instanceof AxiosError) {
//         if (error.code === "ERR_NETWORK") setErrorKey("networkError");
//         else if (error.response?.status === 401) setErrorKey("incorrect");
//         else setErrorKey("genericError");
//       } else setErrorKey("genericError");
//     },
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   function validateEmail(email: string) {
//     return /\S+@\S+\.\S+/.test(email);
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorKey(null);

//     if (!formData.email || !validateEmail(formData.email)) {
//       setErrorKey("invalidEmail");
//       return;
//     }
//     if (!formData.password) {
//       setErrorKey("emptyPassword");
//       return;
//     }

//     login(formData);
//   };

//   // -------------------------
//   //    Google Login Handler
//   // -------------------------
//   const handleGoogleSignIn = async () => {
//     setGoogleLoading(true);
//     try {
//       await signIn("google", { callbackUrl: "/dashboard/timeline" });
//       // Google-success page will handle localStorage + login event
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 to-pink-300">
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        
//         <div
//           className="hidden md:block md:w-1/2 bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp')",
//           }}
//         />

//         <div className="w-full md:w-1/2 p-8 sm:p-12">
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">{t("loginTitle")}</h2>
//           <p className="text-gray-600 mb-8">{t("loginSubtitle")}</p>

//           {errorKey && (
//             <div className="mb-4 text-red-500 text-sm">{t(errorKey)}</div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
            
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 {t("email")}
//               </label>
//               <input
//                 type="text"
//                 name="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 {t("password")}
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
//               />
//             </div>

//             {/* Google Login Button */}
//             <button
//               type="button"
//               onClick={handleGoogleSignIn}
//               disabled={googleLoading}
//               className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
//             >
//               {googleLoading ? (
//                 "Please wait..."
//               ) : (
//                 <>
//                   <img
//                     src="https://www.svgrepo.com/show/475656/google-color.svg"
//                     alt="Google logo"
//                     className="w-5 h-5"
//                   />
//                   Sign in with Google
//                 </>
//               )}
//             </button>

//             <button
//               type="submit"
//               disabled={isPending}
//               className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
//             >
//               {isPending ? t("loggingIn") : t("login")}
//             </button>
//           </form>

//           <p className="mt-6 text-center text-sm text-gray-600">
//             {t("noAccount")}{" "}
//             <Link
//               href="/authentication"
//               className="text-rose-600 font-medium hover:underline"
//             >
//               {t("registerNow")}
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "../context/AuthContext";
import { setCookies } from "@/server/action/setCookies";
import { signIn, useSession } from "next-auth/react";
import { initSocket } from "@/utils/webSocket";
import Image from "next/image";
import { ThemeToggleButton } from "@/app/components/ThemeToggleButton";
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
export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("LoginPage");
  const { data: session } = useSession();
  const { setToken } = useAuth();
const [locale, setLocale] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentLang = languages.find((l) => l.code === locale) || languages[0];
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
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    // const socket = initSocket("http://localhost:4000");
    
    const socket = initSocket(socketUrl!);

  // ✅ AUTO REDIRECT IF ALREADY LOGGED IN (NO refresh needed)
  // useEffect(() => {
  //   const localUser = localStorage.getItem("user");
  //   const token = document.cookie.includes("token=");

  //   if (session?.user || localUser || token) {
  //     router.replace("/dashboard");
  //   }
  // }, [session, router]);
  useEffect(() => {
  const redirectIfLoggedIn = () => {
    const localUser = localStorage.getItem("user");
    const token = document.cookie.includes("token=");

    if (session?.user || localUser || token) {
      router.replace("/dashboard");
    }
  };

  // 1️⃣ Run on mount
  redirectIfLoggedIn();

  // 2️⃣ Listen for localStorage changes (cross-tab login/logout)
  const syncAuth = (event: StorageEvent) => {
    if (event.key === "user" || event.key === "login") {
      redirectIfLoggedIn();
    }
    if (event.key === "logout") {
      router.replace("/"); // optional: redirect on logout
    }
  };

  window.addEventListener("storage", syncAuth);

  return () => window.removeEventListener("storage", syncAuth);
}, [session, router]);


  const { mutate: login, isPending } = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      axios.post("/api/login/", data),
    onSuccess: (response) => {
      // const token = response.data.token;
            const { user } = response.data;


      localStorage.setItem("user", JSON.stringify(response.data.user));
      // setCookies("token", token);
      // setToken(token);
       setCookies("token", response.data.token);
      setToken(response.data.token);
      socket?.emit("onlineStatus:update", { userId: user.id, online: 1 });

      router.push("/dashboard");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.code === "ERR_NETWORK") setErrorKey("networkError");
        else if (error.response?.status === 401) setErrorKey("incorrect");
        else setErrorKey("genericError");
      } else setErrorKey("genericError");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  function validateEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorKey(null);

    if (!formData.email || !validateEmail(formData.email)) {
      setErrorKey("invalidEmail");
      return;
    }
    if (!formData.password) {
      setErrorKey("emptyPassword");
      return;
    }

    login(formData);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } finally {
      setGoogleLoading(false);
    }
  };
   const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    document.cookie = `MYNEXTAPP_LOCALE=${newLocale}; path=/`;
    router.refresh();
    setIsOpen(false);
  };

  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 to-pink-300">
  //     <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
  //       <div
  //         // className=" "
  //         // style={{
  //         //   backgroundImage:
  //         //     "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp')",
  //         // }}
  //       />
  //       <Image
  //         src="/logo/IMG_1114.png" // path to your image in /public folder          alt="Background"
  //         className=" md:w-1/2 "
  //         width={50} 
  //         height={50}
  //         alt="Background"
  //       />
  //       <div className="w-full md:w-1/2 p-8 sm:p-12">
  //         <h2 className="text-3xl font-bold text-gray-800 mb-4">{t("loginTitle")}</h2>
  //         <p className="text-gray-600 mb-8">{t("loginSubtitle")}</p>

  //         {errorKey && <div className="mb-4 text-red-500 text-sm">{t(errorKey)}</div>}

  //         <form onSubmit={handleSubmit} className="space-y-6">
  //           <div>
  //             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
  //               {t("email")}
  //             </label>
  //             <input
  //               type="text"
  //               name="email"
  //               required
  //               value={formData.email}
  //               onChange={handleChange}
  //               className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
  //             />
  //           </div>

  //           <div>
  //             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
  //               {t("password")}
  //             </label>
  //             <input
  //               type="password"
  //               name="password"
  //               required
  //               value={formData.password}
  //               onChange={handleChange}
  //               className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
  //             />
  //           </div>

  //           <button
  //             type="button"
  //             onClick={handleGoogleSignIn}
  //             disabled={googleLoading}
  //             className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
  //           >
  //             {googleLoading ? "Please wait..." : (
  //               <>
  //                 <Image
  //                   src="https://www.svgrepo.com/show/475656/google-color.svg"
  //                   alt="Google logo"
  //                   className="w-5 h-5"
  //                   width={20}
  //                   height={20}
  //                 />
  //                 Sign in with Google
  //               </>
  //             )}
  //           </button>

  //           <div className="flex justify-between items-center text-sm text-gray-600">
  //             <a href="#" className="hover:underline">
  //               {t("forgotPassword")}
  //             </a>
  //           </div>

  //           <button
  //             type="submit"
  //             disabled={isPending}
  //             className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
  //           >
  //             {isPending ? t("loggingIn") : t("login")}
  //           </button>
  //         </form>

  //         <p className="mt-6 text-center text-sm text-gray-600">
  //           {t("noAccount")}{" "}
  //           <Link href="/authentication" className="text-rose-600 font-medium hover:underline">
  //             {t("registerNow")}
  //           </Link>
  //         </p>
  //       </div>
  //     </div>
  //   </div>
  // );
return (
  

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-400 dark:from-green-900 dark:to-blue-950 px-4 " ref={dropdownRef}>

  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row dark:bg-gray-800">

    <div className="hidden md:flex md:w-1/2 flex-col ">
      
      <div className="relative w-full h-full">
        <Image
          src="/logo/IMG_1114.png"
          alt="Login Illustration"
          fill
          className="object-cover"
        />

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10  backdrop-blur-md px-4 py-2">
          <h1 className="text-2xl font-bold text-green-700 text-center dark:text-white">GrowUp</h1>
        </div>
      </div>

      <div className="w-full bg-white p-4 text-center shadow-inner dark:bg-gray-800">
        <p className="text-gray-700 text-sm font-medium px-4 dark:text-white">
          Share your daily moments and personal growth on GrowUp!
        </p>
      </div>
    </div>
 
    <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
    
       <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
   
    <ThemeToggleButton />

    {/* Language Selector */}
    <div className="relative">
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

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-[10000]">
          {languages.map(({ code, label, Flag }) => (
            <button
              key={code}
              onClick={() => changeLocale(code)}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-gray-700 dark:text-gray-200"
            >
              <Flag />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
       </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 dark:text-white">{t("loginTitle")}</h2>
      <p className="text-gray-600 mb-6 dark:text-white">{t("loginSubtitle")}</p>

      {errorKey && (
        <div className="mb-4 text-red-500 text-sm font-medium">{t(errorKey)}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
            {t("email")}
          </label>
          <input
            type="text"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm
               focus:outline-none focus:ring-2 focus:ring-green-400
               bg-white dark:bg-gray-800 text-gray-700 dark:text-white
               placeholder-gray-400 dark:placeholder-gray-400"          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">
            {t("password")}
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm
               focus:outline-none focus:ring-2 focus:ring-green-400
               bg-white dark:bg-gray-800 text-gray-700 dark:text-white
               placeholder-gray-400 dark:placeholder-gray-400"
            // className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className=" w-full bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        >
          {googleLoading ? "Please wait..." : (
            <>
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              Sign in with Google
            </>
          )}
        </button>

        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-white">
          <a href="#" className="hover:underline">
            {t("forgotPassword")}
          </a>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
        >
          {isPending ? t("loggingIn") : t("login")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-white">
        {t("noAccount")}{" "}
        <Link href="/authentication" className="text-green-600 font-medium hover:underline">
          {t("registerNow")}
        </Link>
      </p>
    </div>
  </div>
</div>


);
}
