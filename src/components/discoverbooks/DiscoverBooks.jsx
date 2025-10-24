import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import BooksGrid from "./BooksGrid";
import "../styles/DiscoverBooks.css";
import axios from "axios";

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
      params: {
        q: query,
        orderBy: "relevance",
        maxResults: 12,
      },
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
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </div>
    </div>
  );
}

function BookDetail({ book, onClose }) {
  const info = book.volumeInfo;

  return (
    <div className="book-detail bg-gray-800 mt-10 p-6 rounded-2xl shadow-lg text-center">
      <button
        className="mb-4 bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600"
        onClick={onClose}
      >
        ✕ Close
      </button>

      <img
        src={
          info.imageLinks?.large ||
          info.imageLinks?.medium ||
          info.imageLinks?.thumbnail ||
          "https://via.placeholder.com/300x450?text=No+Cover"
        }
        alt={info.title}
        className="mx-auto w-48 h-auto rounded-lg mb-4"
      />
      <h2 className="text-2xl font-bold mb-2">{info.title}</h2>
      <p className="text-gray-300 mb-4">
        {info.authors?.join(", ") || "Unknown Author"}
      </p>
      <p className="text-gray-400 max-w-2xl mx-auto">
        {info.description || "No description available."}
      </p>
    </div>
  );
}
