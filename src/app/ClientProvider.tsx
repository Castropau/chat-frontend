"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import Providers from "@/ReactQueryProvider";
import { ThemeProvider } from "./context/ThemeContext";

interface ClientProvidersProps {
  children: ReactNode;
  messages: Record<string, string>;
  locale: string; // ✅ Add locale prop
}

export default function ClientProviders({ children, messages, locale }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <SessionProvider>
          <Providers>
            {children}
          </Providers>
        </SessionProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
