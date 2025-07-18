"use client";

import { useState } from "react";

const categories = ["Fitness", "Learning", "Health", "Finance", "Personal"];
const durations = ["Daily", "Weekly", "Custom"];
const privacyOptions = ["Public", "Private", "Anonymous"];

export default function CreateGoalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [duration, setDuration] = useState(durations[0]);
  const [privacy, setPrivacy] = useState("Public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setCategory(categories[0]);
    setDuration(durations[0]);
    setPrivacy("Public");
    setError("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    setTimeout(() => {
      console.log({ title, category, duration, privacy });
      setIsSubmitting(false);
      resetForm();
      setIsOpen(false);
      alert("Goal created successfully!");
    }, 1000);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mr-2 hover:cursor-pointer"
      >
        + Create Goal
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-lg border border-gray-200 dark:border-gray-700 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-white text-xl font-bold hover:cursor-pointer"
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
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
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
            {/* <div className="mb-5">
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
                      name="privacy"
                      value={option}
                      checked={privacy === option}
                      onChange={() => setPrivacy(option)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-800 dark:text-gray-200">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div> */}
            {/* <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Privacy
              </label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                {privacyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div> */}
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
                      className="text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
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
