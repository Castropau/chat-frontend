"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
// import Image from "next/image";

interface FormData {
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  password2: string;
}
interface ApiError {
  error: string;
}

const Register = () => {
  const router = useRouter();
  const t = useTranslations("SignUp");

  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { mutate: register, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      axios.post("/api/register/", {
        email: data.email,
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        password: data.password,
      }),
    onSuccess: () => {
      router.push("/authentication/login");
    },
    onError: (error: AxiosError<ApiError>) => {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
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

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");
    register(formData);
  };

//   return (
//     <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//         <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
//           {t("SignUpSubtitle")}
//         </h2>
//       </div>

//       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//         {/* <form onSubmit={handleSubmit} className="space-y-6">
//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           <div>
//             <label className="block text-sm font-medium text-gray-900">{t("email")}</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
//             />
//           </div>
// <div>
//   <label className="block text-sm font-medium text-gray-900">Firstname</label>
//   <input
//     type="text"
//     name="firstname"
//     value={formData.firstname}
//     onChange={handleChange}
//     required
//     className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300"
//   />
// </div>
// <div>
//   <label className="block text-sm font-medium text-gray-900">Lastname</label>
//   <input
//     type="text"
//     name="lastname"
//     value={formData.lastname}
//     onChange={handleChange}
//     required
//     className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300"
//   />
// </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-900">{t("username")}</label>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-900">{t("password")}</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-900">{t("confirm_password")}</label>
//             <input
//               type="password"
//               name="password2"
//               value={formData.password2}
//               onChange={handleChange}
//               required
//               className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isPending}
//             className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
//           >
//             {isPending ? t("Registering") : t("Register")}
//           </button>
//         </form> */}
// <form onSubmit={handleSubmit} className="space-y-6">
//   {error && <p className="text-red-500 text-sm">{error}</p>}

//   {/* EMAIL */}
//   <div>
//     <label className="block text-sm font-medium text-gray-900">{t("email")}</label>
//     <input
//       type="email"
//       name="email"
//       value={formData.email}
//       onChange={handleChange}
//       required
//       className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base 
//                  text-gray-900 outline outline-gray-300 placeholder:text-gray-400
//                  focus:outline-2 focus:outline-indigo-600 sm:text-sm"
//     />
//   </div>

//   {/* FIRSTNAME + LASTNAME INLINE */}
//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//     <div>
//       <label className="block text-sm font-medium text-gray-900">Firstname</label>
//       <input
//         type="text"
//         name="firstname"
//         value={formData.firstname}
//         onChange={handleChange}
//         required
//         className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base 
//                    text-gray-900 outline outline-gray-300 placeholder:text-gray-400
//                    focus:outline-2 focus:outline-indigo-600 sm:text-sm"
//       />
//     </div>

//     <div>
//       <label className="block text-sm font-medium text-gray-900">Lastname</label>
//       <input
//         type="text"
//         name="lastname"
//         value={formData.lastname}
//         onChange={handleChange}
//         required
//         className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base 
//                    text-gray-900 outline outline-gray-300 placeholder:text-gray-400
//                    focus:outline-2 focus:outline-indigo-600 sm:text-sm"
//       />
//     </div>
//   </div>

//   {/* USERNAME */}
//   <div>
//     <label className="block text-sm font-medium text-gray-900">{t("username")}</label>
//     <input
//       type="text"
//       name="username"
//       value={formData.username}
//       onChange={handleChange}
//       required
//       className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base 
//                  text-gray-900 outline outline-gray-300 placeholder:text-gray-400
//                  focus:outline-2 focus:outline-indigo-600 sm:text-sm"
//     />
//   </div>

//   {/* PASSWORD */}
//   <div>
//     <label className="block text-sm font-medium text-gray-900">{t("password")}</label>
//     <input
//       type="password"
//       name="password"
//       value={formData.password}
//       onChange={handleChange}
//       required
//       className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base 
//                  text-gray-900 outline outline-gray-300 placeholder:text-gray-400
//                  focus:outline-2 focus:outline-indigo-600 sm:text-sm"
//     />
//   </div>

//   {/* CONFIRM PASSWORD */}
//   <div>
//     <label className="block text-sm font-medium text-gray-900">{t("confirm_password")}</label>
//     <input
//       type="password"
//       name="password2"
//       value={formData.password2}
//       onChange={handleChange}
//       required
//       className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base 
//                  text-gray-900 outline outline-gray-300 placeholder:text-gray-400
//                  focus:outline-2 focus:outline-indigo-600 sm:text-sm"
//     />
//   </div>

//   {/* BUTTON */}
//   <button
//     type="submit"
//     disabled={isPending}
//     className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5
//                text-sm font-semibold text-white hover:bg-indigo-500"
//   >
//     {isPending ? t("Registering") : t("Register")}
//   </button>
// </form>

//         <p className="mt-10 text-center text-sm text-gray-500">
//           {t("have_an_account")}
//           <Link
//             href="/authentication/login"
//             className="font-semibold text-indigo-600 hover:text-indigo-500"
//           >
//             {t("signin")}
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-400 px-4">
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
      {/* Right Side - Form */}
      <div className="w-full p-8 sm:p-12 flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          {t("SignUpSubtitle")}
        </h2>

        {error && <div className="mb-4 text-red-500 text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("email")}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* FIRSTNAME + LASTNAME INLINE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Firstname</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Lastname</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* USERNAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("username")}</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("password")}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("confirm_password")}</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {isPending ? t("Registering") : t("Register")}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {t("have_an_account")}{" "}
          <Link href="/authentication/login" className="text-green-600 font-medium hover:underline">
            {t("signin")}
          </Link>
        </p>
      </div>
    </div>
  </div>
);


};

export default Register;
