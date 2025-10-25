import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import BooksGrid from "./BooksGrid";
import "../styles/DiscoverBooks.css";
import axios from "axios";
import BookDetail from "./BookDetail";

export default function DiscoverBooks() {
  const [search, setSearch] = useState("");
  const [categoryBooks, setCategoryBooks] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const categories = [
    { name: "Thriller", query: "subject:thriller" },
    { name: "Fiction", query: "subject:fiction" },
    { name: "Fantasy", query: "subject:fantasy" },
    { name: "Self Help", query: "subject:self-help" },
    { name: "Romance", query: "subject:romance" },
  ];

  const fetchBooks = async (query) => {
    try {
      const res = await axios.get("https://www.googleapis.com/books/v1/volumes", {
        params: { q: query, orderBy: "relevance", maxResults: 12 },
      });
      return res.data.items || [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const results = {};
      for (let cat of categories) {
        results[cat.name] = await fetchBooks(cat.query);
      }
      setCategoryBooks(results);
      setLoading(false);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (search.trim() !== "") {
      const searchBooks = async () => {
        setLoading(true);
        const booksFound = await fetchBooks(search);
        setCategoryBooks({ "Search Results": booksFound });
        setLoading(false);
      };
      searchBooks();
    } else {
      const reloadCategories = async () => {
        setLoading(true);
        const results = {};
        for (let cat of categories) {
          results[cat.name] = await fetchBooks(cat.query);
        }
        setCategoryBooks(results);
        setLoading(false);
      };
      reloadCategories();
    }
  }, [search]);

  return (
    <div className="discover-root min-h-screen p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="discover-inner max-w-6xl mx-auto">
        <h1 className="discover-title text-4xl font-Relieve mb-6 text-center">
          Discover Books
        </h1>

        <SearchBar search={search} setSearch={setSearch} />

        {loading && <p className="loading text-center mt-4">Loading books...</p>}

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
    </div>
  );
}
