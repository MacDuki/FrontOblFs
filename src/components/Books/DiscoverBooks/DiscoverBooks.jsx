// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoBookSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useBooks } from "../../../hooks/useBooks.js";
import { Loader } from "../../ui/Loader.jsx";

import BookDetail from "./BookDetail";
import CategorySection from "./CategorySection";
import DiscoverBooksHeader from "./DiscoverBooksHeader";
import EmptyState from "./EmptyState";

export default function DiscoverBooks() {
  const navigate = useNavigate();
  const {
    categoryBooks,
    searchQuery,
    selectedBook,
    loading,
    initialized,
    visibleCategories,
    loadCategories,
    searchForBooks,
    clearSearchResults,
    selectBook,
  } = useBooks();

  // Cargar categorías solo si no han sido inicializadas
  useEffect(() => {
    if (!initialized) {
      loadCategories();
    }
  }, [initialized, loadCategories]);

  // Manejar búsquedas con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        searchForBooks(searchQuery);
      } else {
        clearSearchResults();
      }
    }, 500); // Esperar 500ms después de que el usuario deje de escribir

    return () => clearTimeout(timer);
  }, [searchQuery, searchForBooks, clearSearchResults]);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && selectedBook) {
        selectBook(null);
      }
    };

    if (selectedBook) {
      document.addEventListener("keydown", handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedBook, selectBook]);

  return (
    <section className=" select-none h-screen bg-gray-100 text-black font-poppins overflow-auto">
      <button
        className="cursor-pointer absolute top-5 left-5 text-center rounded-full bg-gray-200 transition-all hover:scale-110"
        onClick={() => navigate("/")}
      >
        <IoIosArrowBack size={24} className="transition-all hover:scale-110" />
      </button>
      <div className=" mx-auto p-4 md:p-8 w-2/3">
        <DiscoverBooksHeader />

        {/* Contenido con scroll independiente */}
        <div className="space-y-10 pb-8 ">
          {loading && (
            <Loader
              size={64}
              icon={<IoBookSharp />}
              className="my-20 "
              isBlack={true}
            />
          )}

          <AnimatePresence mode="popLayout">
            {!loading &&
              Object.entries(categoryBooks)
                .filter(([category]) => {
                  // Si hay búsqueda activa, mostrar solo resultados de búsqueda
                  if (searchQuery.trim() !== "") {
                    return category === "Search Results";
                  }
                  // Si no hay búsqueda, mostrar categorías visibles
                  return visibleCategories.includes(category);
                })
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

        <AnimatePresence>
          {selectedBook && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={(e) => {
                // Cerrar si se hace clic en el overlay (no en el contenido)
                if (e.target === e.currentTarget) {
                  selectBook(null);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1], // Curva de animación más suave
                }}
                className="max-w-4xl w-full max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <BookDetail key={selectedBook.id} book={selectedBook} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
