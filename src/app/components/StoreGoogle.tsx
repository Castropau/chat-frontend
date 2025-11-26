"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function StoreGoogleUser() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id && session.user.email) {
      const user = {
        id: session.user.id,
        email: session.user.email,
      };
      console.log("📦 Storing Google user in localStorage:", user);
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [session]);

  return null;
}
