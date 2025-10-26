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
import BooksGrid from "./BooksGrid";
import SearchBar from "./SearchBar.jsx";

export default function DiscoverBooks() {
  const dispatch = useDispatch();
  const { categoryBooks, searchQuery, selectedBook, loading, initialized } =
    useSelector((state) => state.books);

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
    <section className="h-screen bg-gradient-to-b from-[#040400] via-[#2f485c] to-[#b5412a] text-white font-poppins overflow-auto">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header mejorado */}
        <div className="bg-black/20 backdrop-blur-sm rounded-4xl p-6 mb-8 border border-white/10">
          <h1 className="font-['Relieve'] text-center text-3xl md:text-5xl mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
            Discover Books
          </h1>

          <SearchBar />
        </div>

        {/* Contenido con scroll independiente */}
        <div className="space-y-10 pb-8 ">
          {loading && (
            <Loader size={64} icon={<IoBookSharp />} className="my-20" />
          )}

          {!loading &&
            Object.entries(categoryBooks).map(([category, books]) => (
              <div
                key={category}
                className="bg-black/80 backdrop-blur-sm rounded-4xl p-6 border border-white/10"
              >
                <h2 className="text-2xl font-semibold mb-4 text-orange-200 border-b border-orange-200/30 pb-2">
                  {category}
                </h2>
                <BooksGrid books={books} />
              </div>
            ))}

          {!loading && Object.keys(categoryBooks).length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-white/60">No books found.</p>
            </div>
          )}
        </div>

        {selectedBook && (
          <BookDetail key={selectedBook.id} book={selectedBook} />
        )}
      </div>
    </section>
  );
}
