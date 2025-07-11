// import { ReactNode } from "react";
// import { NextIntlClientProvider } from "next-intl";
// import { messages } from "../../lib/i18n";
// import Navbar from "../components/Navbar";

import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import { ReactNode } from "react";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

// interface Props {
//   children: ReactNode;
//   params: { locale: string };
// }

// export async function generateStaticParams() {
//   return [{ locale: "en" }, { locale: "kr" }];
// }

// export default function LocaleLayout({ children, params }: Props) {
//   const { locale } = params;

//   return (
//     <html lang={locale}>
//       <body>
//         <NextIntlClientProvider locale={locale} messages={messages[locale]}>
//           <Navbar />
//           {children}
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }
const inter = Inter({ subsets: ["latin"] });
interface Props {
  children: ReactNode;
  params: { locale: string };
}
export default async function Layout({ children }: Props) {
  const messages = await getMessages();
  return (
    <html>
      <body className={(inter.className, "flex h-full flex-col")}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
