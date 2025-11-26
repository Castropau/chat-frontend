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

import React, { useState, useEffect } from "react";
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

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("LoginPage");
  const { data: session } = useSession();
  const { setToken } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

const socketUrl = process.env.SOCKET_URL;
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 to-pink-300">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp')",
          }}
        />
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{t("loginTitle")}</h2>
          <p className="text-gray-600 mb-8">{t("loginSubtitle")}</p>

          {errorKey && <div className="mb-4 text-red-500 text-sm">{t(errorKey)}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t("email")}
              </label>
              <input
                type="text"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t("password")}
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {googleLoading ? "Please wait..." : (
                <>
                  <Image
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google logo"
                    className="w-5 h-5"
                    width={20}
                    height={20}
                  />
                  Sign in with Google
                </>
              )}
            </button>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <a href="#" className="hover:underline">
                {t("forgotPassword")}
              </a>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {isPending ? t("loggingIn") : t("login")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {t("noAccount")}{" "}
            <Link href="/authentication" className="text-rose-600 font-medium hover:underline">
              {t("registerNow")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
