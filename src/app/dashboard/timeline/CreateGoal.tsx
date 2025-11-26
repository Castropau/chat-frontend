"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/authentication/context/AuthContext"; // Assuming you have this context
import Image from "next/image";
const durations = ["Daily", "Weekly", "Custom"];
const privacyOptions = ["Public", "Private", "Anonymous"];

export default function CreateGoal() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(""); // Store the selected category_id here
  const [categories, setCategories] = useState<{ category_id: string; category_name: string }[]>([]);
  const [duration, setDuration] = useState(durations[0]);
  const [privacy, setPrivacy] = useState("Public");
  const [image, setImage] = useState<File | null>(null); // State to hold the image file
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to hold the image preview URL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  // const { token } = useAuth(); // Assuming `useAuth` gives you the user's authentication token
  const router = useRouter();

  // Ref for file input field
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // On component mount, check for user information in localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.id) {
      setUserId(user.id); // Set userId if present in localStorage
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories/list");
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage); // Save the first file selected
      const previewUrl = URL.createObjectURL(selectedImage); // Create a preview URL
      setImagePreview(previewUrl); // Update the preview
    }
  };

  const handleRemoveImage = () => {
    setImage(null); // Reset the image state
    setImagePreview(null); // Reset the preview URL
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the input file field
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!userId) {
      setError("User not authenticated.");
      return;
    }

    if (!image) {
      setError("Image is required.");
      return;
    }

    if (!category) {
      setError("Category is required.");
      return;
    }

    setIsSubmitting(true);
    setError(""); // Reset previous error

    try {
      const formData = new FormData();
      formData.append("userId", String(userId));
      formData.append("title", title);
      formData.append("category", category); // Use category_id here
      formData.append("duration", duration);
      formData.append("privacy", privacy);
      formData.append("image", image);

      const response = await axios.post("/api/goal", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Specify the content type
        },
      });

      console.log(response.data); // For debugging, remove later

      setIsSubmitting(false); // Set submission state to false
      alert("Goal created successfully!"); // Provide feedback to the user
      router.push("/dashboard/timeline"); // Redirect to dashboard after success
    } catch (err) {
      console.error("Error creating goal:", err);
      setIsSubmitting(false);
      setError("Failed to create goal. Please try again."); // Set error message
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition mb-2 mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">🎯 Create a New Goal</h2>

      {/* Title Input */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Run 5km daily"
          className="w-full px-4 py-2 rounded-lg border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Category Selection */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          value={category} // Bind the value to the state `category`
          onChange={(e) => setCategory(e.target.value)} // Update the state with the selected category_id
          className="w-full px-4 py-2 rounded-lg border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name} {/* Display category_name */}
            </option>
          ))}
        </select>
      </div>


      {/* Duration Selection */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Duration
        </label>
        <div className="flex flex-wrap gap-2">
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                duration === d
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
              } hover:shadow`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Selection */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Privacy
        </label>
        <div className="flex flex-wrap gap-3">
          {privacyOptions.map((option) => (
            <label key={option} className="inline-flex items-center space-x-2 text-sm">
              <input
                type="radio"
                name="privacy"
                value={option}
                checked={privacy === option}
                onChange={() => setPrivacy(option)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-800 dark:text-gray-200">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Image Upload and Preview */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Image
        </label>
        <input
          ref={fileInputRef} // Attach the ref to the file input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="w-full px-4 py-2 rounded-lg border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {image && (
          <div className="mt-4 relative">
            {/* Image Preview */}
            <Image
              src={imagePreview || ""}
              alt="Image Preview"
              className="w-full h-auto rounded-lg shadow-md"
              width={400}
              height={300}
            />
            {/* Remove button inside the image */}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 text-3xl text-white bg-black bg-opacity-50 rounded-full p-1"
            >
              &times; {/* "X" symbol */}
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50"
      >
        {isSubmitting ? "Starting..." : "Start Goal"}
      </button>
    </div>
  );
}
