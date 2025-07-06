"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setCookies } from "@/server/action/setCookies";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: login, isLoading } = useMutation({
    mutationFn: (data: { email: string; password: string }) => {
      return axios.post("http://192.168.0.112:8000/api/token/", data);
    },
    onSuccess: (data) => {
      setCookies("token", data.data.token);
      router.push("/dashboard");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.code === "ERR_NETWORK") {
          setErrorMessage("Network error");
        } else if (error.response?.status === 401) {
          setErrorMessage("Email or password is incorrect");
        } else {
          setErrorMessage("An error occurred");
        }
      } else {
        setErrorMessage("An error occurred");
      }
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function validateEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.email || !validateEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!formData.password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    login(formData);
  }

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
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome back 👋</h2>
          <p className="text-gray-600 mb-8">Sign in to your account</p>

          {errorMessage && (
            <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <a href="#" className="hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-rose-600 font-medium hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
