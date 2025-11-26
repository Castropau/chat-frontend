// 'use client';

// import { ReactNode } from "react";
// import { SessionProvider } from "next-auth/react";
// import { NextIntlClientProvider } from "next-intl";
// import { ThemeProvider } from "./context/ThemeContext";
// import Providers from "@/ReactQueryProvider";

// interface ProvidersWrapperProps {
//   children: ReactNode;
//   messages: Record<string, string>;
//   locale: string;
// }

// export default function ProvidersWrapper({ children, messages, locale }: ProvidersWrapperProps) {
//   return (
//     <ThemeProvider>
//       <NextIntlClientProvider messages={messages} locale={locale}>
//         <Providers>
//           <SessionProvider>{children}</SessionProvider>
//         </Providers>
//       </NextIntlClientProvider>
//     </ThemeProvider>
//   );
// }
'use client';

import { ReactNode, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "./context/ThemeContext";
import Providers from "@/ReactQueryProvider";
// import { GlobalLoadingProvider } from "./components/GlobalLoading";

interface ProvidersWrapperProps {
  children: ReactNode;
  messages: Record<string, string>;
  locale: string;
}

export default function ProvidersWrapper({ children, messages, locale }: ProvidersWrapperProps) {

  // 🔥 Sync logout across multiple tabs
  useEffect(() => {
    const syncLogout = (event: StorageEvent) => {
      if (event.key === "logout") {
        console.log("🔄 Auto logout triggered from another tab");

        // Immediately redirect to login/home
        window.location.href = "/";
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  return (
    <ThemeProvider>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Providers>
          <SessionProvider>
            {children}
          </SessionProvider>
          {/* <GlobalLoadingProvider>
            <SessionProvider>
              {children}
            </SessionProvider>
          </GlobalLoadingProvider> */}
        </Providers>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
