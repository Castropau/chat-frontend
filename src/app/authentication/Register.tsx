"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
  email: string;
  username: string;
  password: string;
  password2: string;
}

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { mutate: register, isLoading } = useMutation({
    mutationFn: (data: FormData) => {
      return axios.post("http://192.168.0.112:8000/register/", {
        email: data.email,
        username: data.username,
        password: data.password,
      });
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error: AxiosError<any>) => {
      if (error.response?.data?.email) {
        setError(error.response.data.email[0]);
      } else if (error.response?.data?.username) {
        setError(error.response.data.username[0]);
      } else {
        setError("Registration failed");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    register(formData);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign up for an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Confirm Password
            </label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            {isLoading ? "Registering..." : "Sign up"}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
