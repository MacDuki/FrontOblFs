import { AnimatePresence, motion } from "framer-motion";
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
        {/* Header mejorado */}
        <motion.div
          className="bg-black/20 backdrop-blur-sm rounded-4xl p-6 mb-8 border border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.h1
            className="font-['Relieve'] text-center text-3xl md:text-5xl mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Discover Books
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SearchBar />
          </motion.div>
        </motion.div>

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
                  <motion.div
                    key={category}
                    layout
                    initial={{
                      opacity: 0,
                      y: 20,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.3,
                        delay: index * 0.1,
                        ease: "easeOut",
                      },
                    }}
                    exit={{
                      opacity: 0,
                      y: -20,
                      scale: 0.95,
                      transition: {
                        duration: 0.3,
                        ease: "easeIn",
                      },
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    className="bg-black/80 backdrop-blur-sm rounded-4xl p-6 border border-white/10"
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-orange-200/30 pb-2">
                      <motion.h2
                        className="text-2xl font-semibold text-orange-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: { delay: index * 0.1 + 0.1 },
                        }}
                      >
                        {category}
                      </motion.h2>
                      <motion.button
                        className="cursor-pointer text-sm text-white/70 hover:text-white transition-colors duration-200 px-3 py-1 rounded-full border border-white/20 hover:border-white/40 backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        See More
                      </motion.button>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { delay: index * 0.1 + 0.2 },
                      }}
                    >
                      <BooksGrid books={books} />
                    </motion.div>
                  </motion.div>
                ))}
          </AnimatePresence>

          {!loading && visibleCategories.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                className="text-xl text-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {Object.keys(categoryBooks).length === 0
                  ? "No books found."
                  : "No categories selected. Use the tags above to show categories."}
              </motion.p>
            </motion.div>
          )}
        </div>

        {selectedBook && (
          <BookDetail key={selectedBook.id} book={selectedBook} />
        )}
      </div>
    </section>
  );
}
