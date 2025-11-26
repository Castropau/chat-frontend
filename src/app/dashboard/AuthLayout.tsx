"use client";

import { useAuthRedirect } from "../hooks/useAuthRedirect";

// import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  useAuthRedirect(); // 🔥 Protects all dashboard pages

  return <>{children}</>;
}
