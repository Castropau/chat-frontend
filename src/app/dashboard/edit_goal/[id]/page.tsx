"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

const durations = ["Daily", "Weekly", "Custom"];
const privacyOptions = ["Public", "Private", "Anonymous"];
interface GoalData {
  id: number;
  title: string;
  category: string;
  duration: string;
  privacy: string;
  image: string | null; // The existing image (could be null)
  post_image: string;   // The image used for the post (could be a URL)
  created_at: string;
  user_id: number;
}

export default function EditGoal() {
  const { id } = useParams(); // Fetch the goal ID from URL params
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<{ category_id: string; category_name: string }[]>([]);
  const [duration, setDuration] = useState(durations[0]);
  const [privacy, setPrivacy] = useState("Public");
  const [image, setImage] = useState<File | null>(null); // Store the updated image file
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Preview for the image
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [goalData, setGoalData] = useState<GoalData | null>(null); // Store the existing goal data
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...");
        const response = await axios.get("/api/categories/list");
        setCategories(response.data);
        console.log("Categories fetched:", response.data);  // Log categories to check the response
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  // Fetch goal data
// Fetch goal data
useEffect(() => {
  const fetchGoalData = async () => {
    try {
      console.log("Fetching goal data for ID:", id);
      const response = await axios.get(`/api/goal/${id}`); // Fetch existing goal data using the goal ID
      const data = response.data;
      console.log("Fetched goal data:", data); // Log the goal data

      setGoalData(data);
      setTitle(data.title);
      setCategory(data.category);
      setDuration(data.duration);
      setPrivacy(data.privacy);

      // Set the image preview to the correct field (post_image)
      if (data.post_image) {
        setImagePreview(data.post_image);  // Set the existing image URL from post_image
      } else {
        setImagePreview(null);  // If no image exists, set preview to null
      }
    } catch (err) {
      console.error("Error fetching goal:", err);
      setError("Failed to load goal data.");
    }
  };

  if (id) {
    fetchGoalData();
  }
}, [id]);




  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage); // Save the updated image file
      const previewUrl = URL.createObjectURL(selectedImage); // Create a preview URL for the new image
      setImagePreview(previewUrl); // Update the preview
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setImage(null); // Reset the image state (if the user wants to remove the uploaded image)
    setImagePreview(null); // Reset the preview URL
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the input file field
    }
  };

  // Handle form submit
// const handleSubmit = async () => {
//   if (!title.trim()) {
//     setError("Title is required.");
//     return;
//   }

//   if (!category) {
//     setError("Category is required.");
//     return;
//   }

//   setIsSubmitting(true);
//   setError(""); // Reset previous error

//   // Log the current state values to inspect them before submitting
//   console.log("Submitting form with values:");
//   console.log("Title:", title);
//   console.log("Category:", category);
//   console.log("Duration:", duration);
//   console.log("Privacy:", privacy);
//   console.log("Image selected:", image); // This will log the image file or null
//   console.log("Image preview:", imagePreview); // Log the preview image (if any)

//   // Prepare form data
//   const formData = new FormData();
//   formData.append("title", title);
//   formData.append("category", category); // Use category_id here
//   formData.append("duration", duration);
//   formData.append("privacy", privacy);

//   // If a new image is provided, append it to the form data
//   let imageToUpload = image;  // Default to the selected image if available
//   if (!imageToUpload && imagePreview) {
//     // If no new image, use the existing image preview value (post_image)
//     console.log("No new image uploaded. Using existing image:", imagePreview);
//     imageToUpload = imagePreview;  // Use the existing image URL for the form
//   }

//   if (imageToUpload) {
//     console.log("Appending image to form data:", imageToUpload); // Log the image being sent
//     formData.append("image", imageToUpload);  // Append the image to the form data
//   }

//   try {
//     const response = await axios.put(`/api/goal_update/${id}`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data", // Specify the content type
//       },
//     });

//     setIsSubmitting(false); // Set submission state to false
//     alert("Goal updated successfully!");
//     router.push("/dashboard/timeline"); // Redirect to dashboard after success
//   } catch (err) {
//     console.error("Error updating goal:", err);
//     setIsSubmitting(false);
//     setError("Failed to update goal. Please try again.");
//   }
// };
const handleSubmit = async () => {
  if (!title.trim()) {
    setError("Title is required.");
    return;
  }

  if (!category) {
    setError("Category is required.");
    return;
  }

  setIsSubmitting(true);
  setError(""); // Reset previous error

  // Log the current state values to inspect them before submitting
  console.log("Submitting form with values:");
  console.log("Title:", title);
  console.log("Category:", category);
  console.log("Duration:", duration);
  console.log("Privacy:", privacy);
  console.log("Image selected:", image); // This will log the image file or null
  console.log("Image preview:", imagePreview); // Log the preview image (if any)

  // Prepare form data
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category); // Use category_id here
  formData.append("duration", duration);
  formData.append("privacy", privacy);

  // If a new image is provided, append it to the form data
  if (image && image instanceof File) {
    // If a new image is selected, append it to the form data as a file
    console.log("Appending new image to form data:", image); // Log the new image being appended
    formData.append("image", image);  // Append the File object to the form
  } else if (!image && imagePreview) {
    // If no new image is selected but there is an existing image preview, we can send the URL or skip it
    console.log("No new image uploaded. Using existing image URL:", imagePreview);
    formData.append("image", imagePreview);  // Append the existing image URL as a string
  }

  try {
    // Make the PUT request but don't assign it to 'response'
    await axios.put(`/api/goal_update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Specify the content type
      },
    });

    setIsSubmitting(false); // Set submission state to false
    alert("Goal updated successfully!");
    router.push("/dashboard/timeline"); // Redirect to dashboard after success
  } catch (err) {
    console.error("Error updating goal:", err);
    setIsSubmitting(false);
    setError("Failed to update goal. Please try again.");
  }
};





  if (!goalData) {
    return <p>Loading goal data...</p>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition mb-2 mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">🎯 Edit Goal</h2>

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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name}
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
          ref={fileInputRef}
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="w-full px-4 py-2 rounded-lg border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {imagePreview ? (
          <div className="mt-4 relative">
            <Image
              src={imagePreview}
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
        ) : goalData?.post_image ? (
          <div className="mt-4 relative">
            <Image
              src={goalData.post_image}  // Use the post_image field instead
              alt="Existing Goal Image"
              className="w-full h-auto rounded-lg shadow-md"
              width={400}
              height={300}
            />
          </div>
        ) : null}
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50"
      >
        {isSubmitting ? "Updating..." : "Update Goal"}
      </button>
    </div>
  );
}
