"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const hasToken = document.cookie.includes("token=");
      if (!hasToken) {
        router.replace("/authentication/login");
      }
    };

    checkToken();

    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, [router]);
}
