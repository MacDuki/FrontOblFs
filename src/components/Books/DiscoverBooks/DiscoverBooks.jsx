import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { IoBookSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../../ui/Loader.jsx";

import {
  clearSearch,
  loadAllCategories,
  searchBooks,
} from "../../../features/books.slice.js";
import Aurora from "../../effects/Aurora.effect.jsx";
import BookDetail from "./BookDetail";
import CategorySection from "./CategorySection";
import DiscoverBooksHeader from "./DiscoverBooksHeader";
import EmptyState from "./EmptyState";

export default function DiscoverBooks() {
  const dispatch = useDispatch();
  const {
    categoryBooks,
    searchQuery,
    selectedBook,
    loading,
    initialized,
    visibleCategories,
  } = useSelector((state) => state.books);

  // Cargar categorías solo si no han sido inicializadas
  useEffect(() => {
    if (!initialized) {
      dispatch(loadAllCategories());
    }
  }, [dispatch, initialized]);

  // Manejar búsquedas
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      dispatch(searchBooks(searchQuery));
    } else {
      dispatch(clearSearch());
    }
  }, [dispatch, searchQuery]);

  return (
    <section className=" select-none h-screen bg-gradient-to-b from-[#040400] via-[#2f485c] to-[#b5412a] text-white font-poppins overflow-auto">
      <Aurora
        colorStops={["#000000", "#000000", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <DiscoverBooksHeader />

        {/* Contenido con scroll independiente */}
        <div className="space-y-10 pb-8 ">
          {loading && (
            <Loader size={64} icon={<IoBookSharp />} className="my-20" />
          )}

          <AnimatePresence mode="popLayout">
            {!loading &&
              Object.entries(categoryBooks)
                .filter(([category]) => visibleCategories.includes(category))
                .map(([category, books], index) => (
                  <CategorySection
                    key={category}
                    category={category}
                    books={books}
                    index={index}
                  />
                ))}
          </AnimatePresence>

          {!loading && visibleCategories.length === 0 && (
            <EmptyState categoryBooks={categoryBooks} />
          )}
        </div>

        {selectedBook && (
          <BookDetail key={selectedBook.id} book={selectedBook} />
        )}
      </div>
    </section>
  );
}
