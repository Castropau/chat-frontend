"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // For navigating after successful password change
// Backend: types/User.ts

 interface User {
  id: number;           // User's unique identifier (primary key)
  username: string;     // Username or display name
  email: string;        // User's email address
  password: string;     // User's hashed password
  created_at: string;   // Timestamp when the user was created
  updated_at: string;   // Timestamp when the user information was last updated
}

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Store the user info
  const router = useRouter();

  // Fetch user data from localStorage or API
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      router.push("/authentication/login"); // If no user data, redirect to login
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password must match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (!user?.id) {
      setError("User not found.");
      return;
    }

    setIsSubmitting(true);
    setError(""); // Reset error message

    try {
      // Log data for debugging
      console.log({
        currentPassword,
        newPassword,
        confirmPassword,
        userId: user.id,
      });

      // Send PUT request to change password
      const response = await axios.put(`/api/change-password/${user.id}`, {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (response.status === 200) {
        alert("Password changed successfully!");
        router.push("/dashboard"); // Redirect to the dashboard or another page
      } else {
        setError("Failed to change password. Please try again.");
      }
    } catch (error) {
      // Handle errors based on the status code
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "An unexpected error occurred.";
        setError(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        setError("An error occurred while changing the password.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guard clause: If user is still loading
  if (!user) {
    return <p>Loading...</p>; // Or any other loading component
  }

  return (
    <div className="w-full h-screen bg-white dark:bg-gray-800 p-8 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className="w-full px-4 py-3 rounded-lg border text-sm bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter a new password"
              className="w-full px-4 py-3 rounded-lg border text-sm bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="w-full px-4 py-3 rounded-lg border text-sm bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
            >
              {isSubmitting ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
