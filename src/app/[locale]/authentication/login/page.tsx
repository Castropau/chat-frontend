// src/app/[locale]/authentication/login/page.tsx
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Login() {
  const t = useTranslations("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 to-pink-300">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row">
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp')",
          }}
        />

        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t("welcome")}
          </h2>
          <p className="text-gray-600 mb-8">{t("signIn")}</p>

          {/* Form Inputs (translate labels) */}
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("email")}
              </label>
              <input
                type="email"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("password")}
              </label>
              <input
                type="password"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <a href="#" className="hover:underline">
                {t("forgot")}
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-rose-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              {t("loginBtn")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {t("registerPrompt")}{" "}
            <Link
              href="/register"
              className="text-rose-600 font-medium hover:underline"
            >
              {t("registerNow")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
