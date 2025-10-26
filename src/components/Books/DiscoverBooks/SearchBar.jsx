import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../../features/books.slice";

export default function SearchBar() {
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state) => state.books);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <div className="flex justify-center mb-8">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for a book or an author..."
        className="w-3/5 px-5 py-4 rounded-4xl border-2 border-white bg-white/5 text-white text-xl transition-all duration-300 ease-in-out placeholder:text-white/60 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(66,133,244,0.5)]"
      />
    </div>
  );
}
