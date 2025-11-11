// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IoBookSharp } from "react-icons/io5";
import { useBooks } from "../../../hooks/useBooks.js";
import { Loader } from "../../ui/Loader.jsx";

import ReviewModal from "../ReviewModal.jsx";
import BookDetail from "./BookDetail";
import CategorySection from "./CategorySection";
import CollectionSelectorModal from "./CollectionSelectorModal.jsx";
import DiscoverBooksHeader from "./DiscoverBooksHeader";
import EmptyState from "./EmptyState";
export default function DiscoverBooks({ embedded = false }) {
  const {
    categoryBooks,
    searchQuery,
    selectedBook,
    loading,
    visibleCategories,
    searchForBooks,
    clearSearchResults,
    selectBook,
  } = useBooks();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  // Cerrar modales cuando se cierra el detalle del libro
  useEffect(() => {
    if (!selectedBook) {
      setIsReviewModalOpen(false);
      setIsCollectionModalOpen(false);
    }
  }, [selectedBook]);

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

  const containerClasses = embedded
    ? "select-none h-full text-white font-poppins overflow-hidden"
    : "select-none h-screen font-poppins overflow-auto bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200/60 text-stone-900";

  const innerWidthClasses = embedded
    ? "mx-auto p-4 md:p-6 w-full"
    : "mx-auto px-6 md:px-10 py-6 w-full max-w-7xl";

  return (
    <section className={containerClasses}>
      <div className={innerWidthClasses}>
        {/* Header fijo con blur y borde sutil para integrarse con el resto de la UI */}
        <div
          className={`sticky top-0 z-40 backdrop-blur-md rounded-4xl mb-8 ${
            embedded
              ? "bg-black/30 text-white border-b border-white/10"
              : "bg-gray-100/80 text-black border-b border-black/10"
          }`}
        >
          <DiscoverBooksHeader isDark={embedded} />
        </div>

        {/* Contenido con scroll independiente */}
        <div
          className={`space-y-10 pb-8 ${
            embedded ? "max-h-[460px] overflow-y-auto pr-2" : ""
          }`}
        >
          {loading && (
            <Loader
              size={64}
              icon={<IoBookSharp />}
              className="my-20 "
              isBlack={!embedded}
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
              transition={{ duration: 0.35 }}
              className="fixed inset-0 bg-gradient-to-br from-stone-900/40 via-stone-900/60 to-black/80 backdrop-blur-md z-50 flex items-center justify-center px-4 py-8"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  selectBook(null);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative max-w-4xl w-full max-h-[88vh] overflow-hidden rounded-2xl shadow-2xl border border-stone-200/60 bg-gradient-to-br from-stone-50 to-stone-100/80 backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-orange-500 to-amber-600 rounded-l-2xl" />
                <div className="overflow-y-auto max-h-[88vh] custom-scrollbar px-8 py-6">
                  <BookDetail
                    key={selectedBook.id}
                    book={selectedBook}
                    onOpenReview={() => setIsReviewModalOpen(true)}
                    onOpenCollection={() => setIsCollectionModalOpen(true)}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modales elevados al padre para evitar restricciones de tamaño/stacking */}
        <ReviewModal
          book={selectedBook}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
        />
        <CollectionSelectorModal
          book={selectedBook}
          isOpen={isCollectionModalOpen}
          onClose={() => setIsCollectionModalOpen(false)}
        />
      </div>
    </section>
  );
}
