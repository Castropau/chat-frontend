"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // For session management

// Define types
type User = {
  id?: string | number;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  name: string;
  image?: string;
};

type DbUser = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  image?: string;
};

// type StoredUser = {
//   id?: string | number;
//   email?: string;
//   firstname: string;
//   lastname: string;
//   username: string;
//   image?: string;
//   name: string;
// };

const EditProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  // Fetch session from next-auth
  const { data: session, status } = useSession();

  // Fetch user data
  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    const fetchUser = async () => {
      try {
        let userData: User | null = null;
        const stored = localStorage.getItem("user");
        const manualUser = stored ? JSON.parse(stored) : null;

        // If manualUser exists, we use manualUser data to fetch from the API
        if (manualUser && !session?.user) {
          const res = await axios.get<DbUser>(
            `/api/my-profile/${manualUser.id || manualUser.email}`
          );
          const dbUser = res.data;

          userData = {
            id: manualUser.id,
            // ensure email is always a string to satisfy the User type
            email: manualUser.email || dbUser.email || "",
            username: dbUser.username || `user${dbUser.id}` || manualUser.username || "",
            firstname: dbUser.firstname || manualUser.firstname || "",
            lastname: dbUser.lastname || manualUser.lastname || "",
            name: `${dbUser.firstname || manualUser.firstname || ""} ${dbUser.lastname || manualUser.lastname || ""}`.trim(),
            image: dbUser.image || undefined,
          };
        } else if (session?.user?.email) {
          const userEmail = session.user.email!;
          const res = await axios.get<DbUser>(`/api/my-profile/${userEmail}`);
          const dbUser = res.data;

          const firstname = dbUser.firstname || session.user.name?.split(" ")[0] || "";
          const lastname = dbUser.lastname || session.user.name?.split(" ").slice(1).join(" ") || "";

          userData = {
            id: dbUser.id,
            email: dbUser.email || userEmail || "",
            username: dbUser.username || userEmail.split("@")[0],
            firstname,
            lastname,
            name: `${firstname} ${lastname}`.trim(),
            image: session.user.image || dbUser.image || undefined,
          };
        }

        if (userData) {
          setUser(userData);
          setFirstname(userData.firstname);
          setLastname(userData.lastname);
          setEmail(userData.email);
        //   setBio(userData.bio || "");
          localStorage.setItem("user", JSON.stringify(userData)); // Store user data in localStorage
        } else {
          // If no user data is found, redirect to login
          router.push("/authentication/login");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        // Redirect if there's an error
        router.push("/authentication/login");
      }
    };

    fetchUser();
  }, [session, status, router]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!firstname.trim() || !lastname.trim() || !email.trim()) {
      setError("First Name, Last Name, and Email are required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("bio", bio);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    const userId = user?.id;

    try {
      const res = await axios.put(`/api/my-profile/update/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        alert("Profile updated successfully!");
        setUser(res.data.user); // Update the user state with the updated data
        // router.push("/dashboard"); // Change redirect to a relevant path
          window.location.reload(); // This will reload the current page
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guard clause: Check if user is loaded before rendering the form
  if (!user) {
    return <p>Loading...</p>; // Loading state while user is being fetched
  }

  return (
    <div className="w-full h-screen bg-white dark:bg-gray-800 p-8 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-900 dark:text-white"> Edit Profile</h2>

        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <label htmlFor="profileImage" className="cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
              <img
                src={imagePreview || user.image || "/default-avatar.png"}
                alt="Profile Image"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              id="profileImage"
              className="hidden"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
          </label>
        </div>

        <div className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="Your first name"
              className="w-full px-4 py-3 rounded-lg border text-sm bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Your last name"
              className="w-full px-4 py-3 rounded-lg border text-sm bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full px-4 py-3 rounded-lg border text-sm bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="w-full px-4 py-3 rounded-lg border text-sm bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Submit Button */}
          <div className="mt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
