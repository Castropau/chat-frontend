import React, { useState } from "react";

type FilterBarProps = {
  selected: string[];
  onSelect: (selected: string[]) => void;
};

const categories = [
  "All",
  "Fitness",
  "Study",
  "Games",
  "Relax",
  "Jogging",
  "Watching",
  "Food",
  "Tournament",
  "Reading",
  "Walking",
  "Fun",
  "Visiting",
  "Drinking",
  "Dancing",
  "Singing",
  "Listening",
];

const MAX_VISIBLE = 5;

const FilterBar: React.FC<FilterBarProps> = ({ selected, onSelect }) => {
  const [showAll, setShowAll] = useState(false);

  const handleClick = (category: string) => {
    if (category === "All") {
      onSelect(["All"]);
    } else {
      const isSelected = selected.includes(category);
      let newSelected = isSelected
        ? selected.filter((c) => c !== category)
        : [...selected.filter((c) => c !== "All"), category];

      if (newSelected.length === 0) {
        newSelected = ["All"];
      }

      onSelect(newSelected);
    }
  };

  const visibleCategories = showAll
    ? categories
    : categories.slice(0, MAX_VISIBLE);

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4 px-2 overflow-x-auto scrollbar-hide">
      {visibleCategories.map((category) => {
        const isActive = selected.includes(category);
        return (
          <button
            key={category}
            onClick={() => handleClick(category)}
            className={`px-4 py-1 rounded-full text-sm font-medium border transition whitespace-nowrap ${
              isActive
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {category}
          </button>
        );
      })}

      {categories.length > MAX_VISIBLE && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-4 py-1 rounded-full text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default FilterBar;
