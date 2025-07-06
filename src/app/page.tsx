"use client";

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';

const Loginpage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const { mutate: login, isPending } = useMutation({
    mutationFn: (data: { username: string; password: string }) => {
      return axios.post("http://127.0.0.1:8000/api/token/", data);
    },
    onSuccess: (response) => {
      console.log("Login successful:", response.data);
      // You can redirect or store token here
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      setErrorMessage(error?.response?.data?.detail || "Login failed. Try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 to-pink-300">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        {/* Left Image Panel */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp')" }}
        />

        {/* Right Form Panel */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome back 👋</h2>
          <p className="text-gray-600 mb-8">Sign in to your account</p>

          {errorMessage && <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <a href="#" className="hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Dont have an account?{" "}
            <Link href="/register" className="text-rose-600 font-medium hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
