import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSearch,
  loadAllCategories,
  searchBooks,
} from "../../features/books.slice";
import "../styles/DiscoverBooks.css";
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
    <section className="discover-root h-screen p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="discover-inner max-w-6xl mx-auto">
        <h1 className="discover-title text-4xl font-Relieve mb-6 text-center">
          Discover Books
        </h1>

        <SearchBar search={search} setSearch={setSearch} />

        {loading && (
          <p className="loading text-center mt-4">Loading books...</p>
        )}

        {!loading &&
          Object.entries(categoryBooks).map(([category, books]) => (
            <div key={category} className="mb-10">
              <h2 className="text-2xl font-semibold mb-3">{category}</h2>
              <BooksGrid books={books} onSelectBook={setSelectedBook} />
            </div>
          ))}

        {!loading && Object.keys(categoryBooks).length === 0 && (
          <p className="no-results text-center mt-10">No books found.</p>
        )}

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
