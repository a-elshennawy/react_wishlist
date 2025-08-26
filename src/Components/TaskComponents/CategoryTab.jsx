import { useState } from "react";

export default function CategoryTab({ onCategoryChange, activeCategory = "" }) {
  const categories = [
    { id: "all", name: "all" },
    { id: "work", name: "work" },
    { id: "personal", name: "personal" },
    { id: "workout", name: "workout" },
    { id: "entertainment", name: "entertainment" },
    { id: "daily", name: "daily" },
  ];

  const [selectedCategory, setSelectedCategory] = useState(activeCategory);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <>
      <div className="col-12 row justify-content-start align-items-center gap-1 m-0 categoryTab">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`categoryTabBtn ${
              selectedCategory === category.id ? category.name + " active" : ""
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </>
  );
}
