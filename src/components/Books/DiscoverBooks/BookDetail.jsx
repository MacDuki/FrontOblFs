/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { CiBookmark } from "react-icons/ci";

import { useState } from "react";
import { CiStar } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { useBooks } from "../../../hooks/useBooks.js";
import { rankDescription } from "../../Utils/textRanking.js";
import ReviewModal from "./ReviewModal.jsx";

export default function BookDetail({ book }) {
  const {
    favoriteBooks,
    savedBooks,
    selectBook,
    saveBook,
    unsaveBook,
    isBookSaved,
  } = useBooks();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const getCoverImage = (info) => {
    const img = info?.imageLinks;
    if (!img) return "https://via.placeholder.com/300x450?text=No+Cover";
    return (
      img.extraLarge ||
      img.large ||
      img.medium ||
      img.thumbnail ||
      img.smallThumbnail ||
      "https://via.placeholder.com/300x450?text=No+Cover"
    );
  };

  // Seleccionar gradiente predeterminado basado en el libro
  const bookInfo = book?.volumeInfo || {};

  if (!book) return null;

  const info = book.volumeInfo || {};
  const isFavorite = favoriteBooks.some((b) => b.id === book.id);
  const isSaved = isBookSaved(book.id);
  const coverImage = getCoverImage(info);

  function DescriptionRanked({ description }) {
    if (!description)
      return <p className="text-white/60">No description available.</p>;
    const ranked = rankDescription(description);
    const top = ranked.slice(0, 3);

    return (
      <div className="mt-3 space-y-2">
        {top.map(({ txt, score }, i) => (
          <div key={i} className="flex items-start gap-2">
            <p className="text-black/90 text-sm md:text-base">{txt}</p>
            <span className="sr-only">score {score.toFixed(1)}</span>
          </div>
        ))}
      </div>
    );
  }
  const handleClose = () => selectBook(null);

  const handleSave = () => {
    if (isSaved) {
      unsaveBook(book.id);
    } else {
      saveBook(book.id);
    }
  };
  const handleReview = () => setIsReviewModalOpen(true);

  const handleReviewSubmit = (review) => {
    console.log("Reseña guardada:", review);
    // Aquí puedes agregar la lógica para guardar la reseña en Redux o enviarla al backend
    // Por ejemplo: dispatch(addReview(review));
  };

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden">
      {/* CARD */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl shadow-2xl"
      >
        <div
          className={`relative transition-all duration-700 ease-out bg-slate-50 text-black`}
        >
          <div className="relative flex flex-col items-center md:flex-row  gap-6 p-6 md:p-8">
            {/* Flecha volver */}
            <button
              onClick={handleClose}
              className=" cursor-pointer relative left-4 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full bg-white/70 hover:bg-white shadow transition"
              aria-label="Volver"
              title="Volver"
            >
              <IoIosArrowBack className="w-5 h-5 text-gray-700" />
            </button>

            {/* Portada flotante */}
            <div className="relative md:pl-8">
              {/* “Tarjeta” blanca detrás de la portada para simular relieve */}

              <motion.img
                src={coverImage}
                alt={info.title}
                initial={{ rotate: -2, y: 8 }}
                whileHover={{ y: -2, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="relative w-40 md:w-44 lg:w-48 aspect-[2/3] object-cover rounded-xl shadow-2xl"
              />
            </div>

            {/* Contenido derecho */}
            <div className="flex-1 flex flex-col justify-center md:pl-4">
              <h2 className="text-black text-2xl md:text-3xl font-semibold drop-shadow-sm">
                {info.title}
              </h2>
              <p className="text-black/80 text-sm md:text-base mt-1">
                {info.authors?.join(", ") || "Unknown Author"}
              </p>

              {/* Descripción  */}
              <div className="mt-3 text-black/80">
                <DescriptionRanked description={info.description} />
              </div>

              {/* Botón Detalles + acciones pequeñas tipo icono */}
              <div className="mt-5 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <IconButton
                    active={isSaved}
                    onClick={handleSave}
                    label={isSaved ? "remove from list" : "Save to a list"}
                  >
                    <CiBookmark
                      className={`w-4 h-4 ${
                        isSaved ? "fill-sky-500 text-sky-500" : "text-gray-700"
                      }`}
                    />
                  </IconButton>

                  <IconButton onClick={handleReview} label="Review">
                    <CiStar className="w-4 h-4 text-yellow-500" />
                  </IconButton>
                </div>
              </div>

              {/* Meta compacta bajo el botón, opcional */}
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-black/80">
                {info.pageCount && (
                  <span>
                    Pages: <b className="text-black">{info.pageCount}</b>
                  </span>
                )}
                {info.categories?.[0] && (
                  <span>
                    Category: <b className="text-black">{info.categories[0]}</b>
                  </span>
                )}
                {info.language && (
                  <span>
                    Language:{" "}
                    <b className="text-black">{info.language.toUpperCase()}</b>
                  </span>
                )}
                {info.publisher && (
                  <span>
                    Editorial: <b className="text-black">{info.publisher}</b>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal de Reseña */}
      <ReviewModal
        book={book}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}

function IconButton({ children, onClick, label = "", active = false }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      title={label}
      className={`cursor-pointer grid place-items-center w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow transition ${
        active ? "ring-2 ring-white/60" : ""
      }`}
      aria-label={label}
    >
      {children}
    </motion.button>
  );
}
