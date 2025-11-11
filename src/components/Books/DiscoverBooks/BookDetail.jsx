/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { CiBookmark } from "react-icons/ci";

import { CiStar } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { useBooks } from "../../../hooks/useBooks.js";
import { rankDescription } from "../../Utils/textRanking.js";

export default function BookDetail({ book, onOpenReview, onOpenCollection }) {
  const { selectBook, isBookSaved } = useBooks();

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

  if (!book) return null;

  const info = book.volumeInfo || {};
  const isSaved = isBookSaved(book.id);
  const coverImage = getCoverImage(info);

  function DescriptionRanked({ description }) {
    if (!description) return <p className="">No description available.</p>;
    const ranked = rankDescription(description);
    const top = ranked.slice(0, 3);

    return (
      <div className="mt-3 space-y-2">
        {top.map(({ txt, score }, i) => (
          <div key={i} className="flex items-start gap-2">
            <p className=" text-sm md:text-base">{txt}</p>
            <span className="sr-only">score {score.toFixed(1)}</span>
          </div>
        ))}
      </div>
    );
  }
  const handleClose = () => selectBook(null);

  const handleSave = () => {
    if (onOpenCollection) onOpenCollection();
  };

  const handleReview = () => {
    if (onOpenReview) onOpenReview();
  };

  return (
    <div className="w-full max-w-5xl mx-auto ">
      {/* CARD */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl shadow-xl backdrop-blur-xl"
      >
        <div
          className={`relative transition-all duration-700 ease-out text-black`}
        >
          <div className="relative flex flex-col items-center md:flex-row  gap-6 p-6 md:p-8">
            {/* Flecha volver */}
            <button
              onClick={handleClose}
              className="cursor-pointer relative left-4 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow border border-stone-200/60 transition"
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
                className="relative w-28 md:w-32 lg:w-36 aspect-[2/3] object-cover rounded-xl shadow-2xl"
              />
            </div>

            {/* Contenido derecho */}
            <div className="flex-1 flex flex-col justify-center md:pl-2">
              <h2 className="text-stone-900 text-2xl md:text-3xl font-semibold tracking-tight">
                {info.title}
              </h2>
              <p className="text-stone-700 text-sm md:text-base mt-1">
                {info.authors?.join(", ") || "Unknown Author"}
              </p>

              {/* Descripción  */}
              <div className="mt-3 text-stone-900">
                <DescriptionRanked description={info.description} />
              </div>

              {/* Botón Detalles + acciones pequeñas tipo icono */}
              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <IconButton
                    active={isSaved}
                    onClick={handleSave}
                    label="Save to a list"
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
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-stone-700">
                {info.pageCount && (
                  <span>
                    Pages: <b className="text-stone-900">{info.pageCount}</b>
                  </span>
                )}
                {info.categories?.[0] && (
                  <span>
                    Category:{" "}
                    <b className="text-stone-900">{info.categories[0]}</b>
                  </span>
                )}
                {info.language && (
                  <span>
                    Language:{" "}
                    <b className="text-stone-900">
                      {info.language.toUpperCase()}
                    </b>
                  </span>
                )}
                {info.publisher && (
                  <span>
                    Editorial:{" "}
                    <b className="text-stone-900">{info.publisher}</b>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modales movidos al componente padre */}
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
