// app/layout.tsx

import Providers from "@/ReactQueryProvider";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../context/ThemeContext";

// import { Geist, Geist_Mono } from "next/font/google";
// import Providers from "@/ReactQueryProvider";
// import Navbar from "../components/Navbar";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// CORRECT: remove <html> and <body> in nested layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <>
    <Navbar />
      {/* Add dashboard-specific UI here if needed */}
      {/* <main className="pt-16"> */}
       {/* <main className="flex flex-col h-[calc(100vh-64px)] overflow-hidden pt-0"> */}
      <main className="flex flex-col  overflow-hidden ">

        <ThemeProvider>
          <Providers>{children}</Providers>
          </ThemeProvider>
      </main>
    </>
  );
}

