// "use client";

// import { SessionProvider } from "next-auth/react";
// import { ThemeProvider } from "./context/ThemeContext";
// import { NextIntlClientProvider } from "next-intl";
// import Providers from "@/ReactQueryProvider";

// export default function ClientLayout({
//   children,
//   messages,
// }: {
//   children: React.ReactNode;
//   messages: any;
// }) {
//   return (
//     <SessionProvider>
//       <ThemeProvider>
//         <NextIntlClientProvider messages={messages}>
//           <Providers>{children}</Providers>
//         </NextIntlClientProvider>
//       </ThemeProvider>
//     </SessionProvider>
//   );
// }
