import React, { useState } from "react";

type FilterBarProps = {
  selected: string[];
  onSelect: (selected: string[]) => void;
  categories: string[]; // Added categories prop
};

const MAX_VISIBLE = 5;

const FilterBar: React.FC<FilterBarProps> = ({ selected, onSelect, categories }) => {
  const [showAll, setShowAll] = useState(false);

  // Handle category selection or deselection
  const handleClick = (category: string) => {
    let newSelected;

    if (category === "All") {
      // Selecting "All" clears all other categories and selects "All"
      newSelected = ["All"];
    } else {
      const isSelected = selected.includes(category);

      if (isSelected) {
        // Deselect category
        newSelected = selected.filter((c) => c !== category);
      } else {
        // Add category, but keep "All" if already selected
        newSelected = selected.includes("All")
          ? [...selected.filter((c) => c !== "All"), category]
          : [...selected, category];
      }
    }

    if (newSelected.length === 0) {
      // Ensure at least one category is selected (falling back to "All" if necessary)
      newSelected = ["All"];
    }

    onSelect(newSelected);
  };

  // Logic for limiting the number of visible categories
  const visibleCategories = showAll ? categories : categories.slice(0, MAX_VISIBLE);

//   return (
//     <div className="flex flex-wrap justify-center gap-2 mb-4 px-2 overflow-x-auto scrollbar-hide">
//      {visibleCategories.map((category, index) => {
//   const isActive = selected.includes(category);
//   return (
//     <button
//       key={`${category}-${index}`} // ✅ make the key unique
//       onClick={() => handleClick(category)}
//       className={`px-4 py-1 rounded-full text-sm font-medium border transition whitespace-nowrap ${
//         isActive
//           ? "bg-blue-500 text-white border-blue-500"
//           : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
//       }`}
//     >
//       {category}
//     </button>
//   );
// })}


//       {categories.length > MAX_VISIBLE && (
//         <button
//           onClick={() => setShowAll(!showAll)}
//           className="px-4 py-1 rounded-full text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
//         >
//           {showAll ? "Show Less" : "Show More"}
//         </button>
//       )}
//     </div>
//   );
return (
  <div className="flex flex-wrap justify-center gap-2 mb-4 px-2 overflow-x-auto scrollbar-hide">
    {visibleCategories.map((category, index) => {
      const isActive = selected.includes(category);
      return (
        <button
          key={`${category}-${index}`} // ✅ make the key unique
          onClick={() => handleClick(category)}
          className={`px-4 py-1 rounded-full text-sm font-medium border transition whitespace-nowrap 
            ${isActive
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            }`}
        >
          {category}
        </button>
      );
    })}

    {/* {categories.length > MAX_VISIBLE && (
      <button
        onClick={() => setShowAll(!showAll)}
        className="px-4 py-1 rounded-full text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        {showAll ? "Show Less" : "Show More"}
      </button>
    )} */}
    {categories.length > MAX_VISIBLE && (
  <button
    onClick={() => setShowAll(!showAll)}
    className="px-4 py-1 rounded-full text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
  >
    {showAll ? (
      <span className="dark:text-white dark:hover:text-white">Show Less</span>
    ) : (
      <span className="dark:text-white dark:hover:text-white">Show More</span>
    )}
  </button>
)}

  </div>
);

};

export default FilterBar;
