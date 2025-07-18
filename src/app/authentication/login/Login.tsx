"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
// import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";
import { setCookies } from "@/server/action/setCookies";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("LoginPage");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const { setToken } = useAuth();
  // const queryClient = useQueryClient();

  const { mutate: login, isPending } = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      axios.post("http://192.168.0.122:8000/api/token/", data),
    onSuccess: (response) => {
      const token = response.data.access;
      // Cookies.set("token", token);
      setCookies("token", token);
      setToken(token);
      router.push("/dashboard");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.code === "ERR_NETWORK") {
          setErrorKey("networkError");
        } else if (error.response?.status === 401) {
          setErrorKey("incorrect");
        } else {
          setErrorKey("genericError");
        }
      } else {
        setErrorKey("genericError");
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  function validateEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorKey(null);

    if (!formData.email || !validateEmail(formData.email)) {
      setErrorKey("invalidEmail");
      return;
    }
    if (!formData.password) {
      setErrorKey("emptyPassword");
      return;
    }

    login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 to-pink-300">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp')",
          }}
        />
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t("loginTitle")}
          </h2>
          <p className="text-gray-600 mb-8">{t("loginSubtitle")}</p>

          {errorKey && (
            <div className="mb-4 text-red-500 text-sm">{t(errorKey)}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t("email")}
              </label>
              <input
                type="text"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {t("password")}
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <a href="#" className="hover:underline">
                {t("forgotPassword")}
              </a>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {isPending ? t("loggingIn") : t("login")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {t("noAccount")}{" "}
            <Link
              href="/authentication"
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
