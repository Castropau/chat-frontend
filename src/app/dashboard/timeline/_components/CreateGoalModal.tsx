"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const categories = [
  { id: 1, name: "Fitness" },
  { id: 2, name: "Learning" },
  { id: 3, name: "Health" },
  { id: 4, name: "Finance" },
  { id: 5, name: "Personal" },
];
const durations = ["Daily", "Weekly", "Custom"];
const privacyOptions = ["Public", "Private", "Anonymous"];

export default function CreateGoalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0].id);
  const [duration, setDuration] = useState(durations[0]);
  const [privacy, setPrivacy] = useState("Public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);


    const router = useRouter();
   useEffect(() => {
      // On component mount, check for user information in localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?.id) {
        setUserId(user.id); // Set userId if present in localStorage
      }
    }, []);

  const resetForm = () => {
    setTitle("");
    setCategory(categories[0].id);
    setDuration(durations[0]);
    setPrivacy("Public");
    setError("");
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // const handleSubmit = async () => {
  //   if (!title.trim()) {
  //     setError("Title is required.");
  //     return;
  //   }
  //   setIsSubmitting(true);
  //   setError("");

  //   setTimeout(() => {
  //     console.log({ title, category, duration, privacy, image });
  //     setIsSubmitting(false);
  //     resetForm();
  //     setIsOpen(false);
  //     alert("Goal created successfully!");
  //   }, 1000);
  // };
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
      // formData.append("category", category); // Use category_id here
      formData.append("category", String(category));

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
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        + Create Goal
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-lg border border-gray-200 dark:border-gray-700 relative max-h-[90vh] overflow-y-auto p-6">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-white text-xl font-bold"
              aria-label="Close"
              title="Close"
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              🎯 Create a New Goal
            </h2>

            {/* Title */}
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

            {/* Category */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
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

            {/* Privacy */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Privacy
              </label>
              <div className="flex flex-wrap gap-3">
                {privacyOptions.map((option) => (
                  <label
                    key={option}
                    className="inline-flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="radio"
                      value={option}
                      checked={privacy === option}
                      onChange={(e) => setPrivacy(e.target.value)}
                      className="dark:text-white text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                    />
                    <span className="dark:text-white">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full px-4 py-2 rounded-lg border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              {image && (
                <div className="mt-4 relative">
                  <Image
                    src={imagePreview || ""}
                    alt="Image Preview"
                    className="w-full h-auto rounded-lg shadow-md"
                    width={400}
                    height={300}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 text-3xl text-white bg-black bg-opacity-50 rounded-full p-1"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            {/* Error */}
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {isSubmitting ? "Starting..." : "Start Goal"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
