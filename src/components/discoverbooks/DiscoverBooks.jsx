import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import BooksGrid from "./BooksGrid";
import "../styles/DiscoverBooks.css";

export default function DiscoverBooks() {
  const [search, setSearch] = useState("");
  const [categoryBooks, setCategoryBooks] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    { name: "Thriller", query: "subject:thriller" },
    { name: "Fiction", query: "subject:fiction" },
    { name: "Fantasy", query: "subject:fantasy" },
    { name: "Self Help", query: "subject:self-help" },
    { name: "Romance", query: "subject:romance" },
  ];

  // Fetch libros por query
  const fetchBooks = async (query) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&orderBy=relevance&maxResults=12`
      );
      const data = await res.json();
      return data.items || [];
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
          Object.entries(categoryBooks).map(([title, books]) => (
            <div key={title} className="category-section mb-12">
              <h2 className="text-2xl font-semibold mb-4">{title}</h2>
              <BooksGrid books={books} />
            </div>
          ))}

        {!loading &&
          Object.values(categoryBooks).every((b) => b.length === 0) && (
            <p className="no-results text-center mt-10">No books found.</p>
          )}
      </div>
    </div>
  );
}
