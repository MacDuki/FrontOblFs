import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSearch,
  loadAllCategories,
  searchBooks,
} from "../../features/books.slice";
import Aurora from "../effects/Aurora.effect";
import BookDetail from "./BookDetail";
import BooksGrid from "./BooksGrid";
import SearchBar from "./SearchBar";
export default function DiscoverBooks() {
  const dispatch = useDispatch();
  const { categoryBooks, loading, initialized } = useSelector(
    (state) => state.books
  );
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  // Cargar categorías solo si no han sido inicializadas
  useEffect(() => {
    if (!initialized) {
      dispatch(loadAllCategories());
    }
  }, [dispatch, initialized]);

  // Manejar búsquedas
  useEffect(() => {
    if (search.trim() !== "") {
      dispatch(searchBooks(search));
    } else {
      dispatch(clearSearch());
    }
  }, [dispatch, search]);

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
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/10">
          <h1 className="font-['Relieve'] text-center text-3xl md:text-5xl mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
            Discover Books
          </h1>

          <SearchBar search={search} setSearch={setSearch} />
        </div>

        {/* Contenido con scroll independiente */}
        <div className="space-y-10 pb-8">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="ml-4 text-xl text-white/80">Loading books...</p>
            </div>
          )}

          {!loading &&
            Object.entries(categoryBooks).map(([category, books]) => (
              <div
                key={category}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <h2 className="text-2xl font-semibold mb-4 text-orange-200 border-b border-orange-200/30 pb-2">
                  {category}
                </h2>
                <BooksGrid books={books} onSelectBook={setSelectedBook} />
              </div>
            ))}

          {!loading && Object.keys(categoryBooks).length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-white/60">No books found.</p>
            </div>
          )}
        </div>

        {selectedBook && (
          <BookDetail
            key={selectedBook.id}
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </div>
    </section>
  );
}
