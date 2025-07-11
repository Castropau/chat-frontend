// src/components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <select
      onChange={handleChange}
      value={locale}
      className="ml-4 border px-2 py-1 rounded"
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
      {/* Add more languages as needed */}
    </select>
  );
}
