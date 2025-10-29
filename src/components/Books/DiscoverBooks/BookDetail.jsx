/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Bookmark, ChevronLeft, Heart, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useBookGradient } from "../../Utils/colorExtractor.js";
import { rankDescription } from "../../Utils/textRanking.js";
import { useState } from "react";
import ReviewModal from "./ReviewModal.jsx";

import {
  addToFavorites,
  addToSaved,
  removeFromFavorites,
  removeFromSaved,
  setSelectedBook,
} from "../../../features/books.slice";

export default function BookDetail({ book }) {
  const dispatch = useDispatch();
  const { favoriteBooks, savedBooks } = useSelector((s) => s.books);
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
  const { gradient, loading: gradientLoading } = useBookGradient(
    book?.id,
    bookInfo.title
  );

  if (!book) return null;

  const info = book.volumeInfo || {};
  const isFavorite = favoriteBooks.some((b) => b.id === book.id);
  const isSaved = savedBooks.some((b) => b.id === book.id);
  const coverImage = getCoverImage(info);

  // Generar el estilo de fondo dinámico
  const getBackgroundStyle = () => {
    if (!gradient) {
      return {
        background:
          "linear-gradient(135deg, #ff6b6b 0%, #ff8e53 35%, #ff6b9d 70%, #c44569 100%)",
        transition: "background 0.8s ease-in-out",
      };
    }

    return {
      background: gradient.gradient,
      transition: "background 0.8s ease-in-out",
    };
  };
  function DescriptionRanked({ description }) {
    if (!description)
      return <p className="text-white/60">No description available.</p>;
    const ranked = rankDescription(description);
    const top = ranked.slice(0, 3);

    return (
      <div className="mt-3 space-y-2">
        {top.map(({ txt, score }, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-white/70 shrink-0" />
            <p className="text-white/90 text-sm md:text-base">{txt}</p>
            <span className="sr-only">score {score.toFixed(1)}</span>
          </div>
        ))}
      </div>
    );
  }
  const handleClose = () => dispatch(setSelectedBook(null));
  const handleFavorite = () =>
    isFavorite
      ? dispatch(removeFromFavorites(book.id))
      : dispatch(addToFavorites(book));
  const handleSave = () =>
    isSaved ? dispatch(removeFromSaved(book.id)) : dispatch(addToSaved(book));
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
        {/* Fondo dinámico basado en colores de la portada */}
        <div
          className={`relative transition-all duration-700 ease-out ${
            gradientLoading ? "animate-pulse" : ""
          }`}
          style={getBackgroundStyle()}
        >
          <div className="relative flex flex-col items-center md:flex-row  gap-6 p-6 md:p-8">
            {/* Flecha volver */}
            <button
              onClick={handleClose}
              className=" cursor-pointer relative left-4 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full bg-white/70 hover:bg-white shadow transition"
              aria-label="Volver"
              title="Volver"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
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
              <h2 className="text-white text-2xl md:text-3xl font-semibold drop-shadow-sm">
                {info.title}
              </h2>
              <p className="text-white/80 text-sm md:text-base mt-1">
                {info.authors?.join(", ") || "Unknown Author"}
              </p>

              {/* Descripción  */}
              <div className="mt-3">
                <DescriptionRanked description={info.description} />
              </div>

              {/* Botón Detalles + acciones pequeñas tipo icono */}
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => {}}
                  className="px-5 py-2 text-sm font-medium rounded-full bg-white/70 hover:bg-white text-gray-800 shadow transition"
                >
                  Detalles
                </button>

                <div className="flex items-center gap-2">
                  <IconButton
                    active={isFavorite}
                    onClick={handleFavorite}
                    label={isFavorite ? "Quitar de favoritos" : "Favorito"}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite
                          ? "fill-rose-500 text-rose-500"
                          : "text-gray-700"
                      }`}
                    />
                  </IconButton>

                  <IconButton
                    active={isSaved}
                    onClick={handleSave}
                    label={isSaved ? "Quitar de guardados" : "Guardar"}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isSaved ? "fill-sky-500 text-sky-500" : "text-gray-700"
                      }`}
                    />
                  </IconButton>

                  <IconButton onClick={handleReview} label="Reseñar">
                    <Star className="w-4 h-4 text-yellow-500" />
                  </IconButton>
                </div>
              </div>

              {/* Meta compacta bajo el botón, opcional */}
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/80">
                {info.pageCount && (
                  <span>
                    Páginas: <b className="text-white">{info.pageCount}</b>
                  </span>
                )}
                {info.categories?.[0] && (
                  <span>
                    Categoría:{" "}
                    <b className="text-white">{info.categories[0]}</b>
                  </span>
                )}
                {info.language && (
                  <span>
                    Idioma:{" "}
                    <b className="text-white">{info.language.toUpperCase()}</b>
                  </span>
                )}
                {info.publisher && (
                  <span>
                    Editorial: <b className="text-white">{info.publisher}</b>
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
      className={`grid place-items-center w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow transition ${
        active ? "ring-2 ring-white/60" : ""
      }`}
      aria-label={label}
    >
      {children}
    </motion.button>
  );
}
