import { useDispatch, useSelector } from "react-redux";
import {
  categories,
  setSearchQuery,
  toggleCategoryVisibility,
} from "../../../features/books.slice";

export default function SearchBar() {
  const dispatch = useDispatch();
  const { searchQuery, visibleCategories } = useSelector(
    (state) => state.books
  );

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleCategoryToggle = (categoryName) => {
    dispatch(toggleCategoryVisibility(categoryName));
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for a book or an author..."
          className="w-3/5 px-5 py-4 rounded-4xl border-2 border-black/70 bg-white/5 text-black/60 text-xl transition-all duration-300 ease-in-out placeholder:text-black/60"
        />
      </div>

      {/* Category Tags */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => {
          const isVisible = visibleCategories.includes(category.name);
          return (
            <button
              key={category.name}
              onClick={() => handleCategoryToggle(category.name)}
              className={` cursor-pointer
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out
                border transform hover:scale-105 active:scale-95 backdrop-blur-sm
                ${
                  isVisible
                    ? "border-black/40 text-black shadow-lg shadow-black/20 backdrop-blur-md"
                    : "border-black/20 text-black/70 hover:border-black/30 hover:text-black hover:shadow-md hover:shadow-black/10 hover:backdrop-blur-md"
                }
              `}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
