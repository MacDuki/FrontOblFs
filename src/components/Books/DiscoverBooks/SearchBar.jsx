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
    <div className="space-y-6  ">
      {/* Search Input */}
      <div className="flex justify-center ">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for a book or an author..."
          className="w-full md:w-3/5 px-5 py-3.5 rounded-2xl border border-stone-300/60 bg-white/70 backdrop-blur-xl text-stone-800 text-[15px] transition-all duration-300 ease-in-out placeholder:text-stone-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400/60"
        />
      </div>

      {/* Category Tags */}
      <div className="flex flex-wrap justify-center gap-2.5">
        {categories.map((category) => {
          const isVisible = visibleCategories.includes(category.name);
          return (
            <button
              key={category.name}
              onClick={() => handleCategoryToggle(category.name)}
              className={`cursor-pointer px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200
                border backdrop-blur-xl shadow-sm active:scale-95
                ${
                  isVisible
                    ? "bg-white/80 text-stone-900 border-stone-300/70 hover:bg-white"
                    : "bg-white/50 text-stone-600 border-stone-300/50 hover:bg-white/70 hover:text-stone-800"
                }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
