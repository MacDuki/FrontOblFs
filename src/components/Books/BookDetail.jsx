import { motion } from "framer-motion";
import { Bookmark, Heart, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavorites,
  addToSaved,
  removeFromFavorites,
  removeFromSaved,
  setSelectedBook,
} from "../../features/books.slice";

export default function BookDetail({ book }) {
  const dispatch = useDispatch();
  const { favoriteBooks, savedBooks } = useSelector((state) => state.books);

  if (!book) return null;

  const info = book.volumeInfo;
  const isFavorite = favoriteBooks.some((b) => b.id === book.id);
  const isSaved = savedBooks.some((b) => b.id === book.id);

  const getCoverImage = (info) => {
    const img = info.imageLinks;
    if (!img) return "https://via.placeholder.com/300x450?text=No+Cover";
    return (
      img.extraLarge ||
      img.large ||
      img.medium ||
      img.thumbnail ||
      img.smallThumbnail
    );
  };

  const handleClose = () => {
    dispatch(setSelectedBook(null));
  };

  const handleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(book.id));
    } else {
      dispatch(addToFavorites(book));
    }
  };

  const handleSave = () => {
    if (isSaved) {
      dispatch(removeFromSaved(book.id));
    } else {
      dispatch(addToSaved(book));
    }
  };

  const handleReview = () => {
    console.log("Reseñar:", info.title);
    // Aquí puedes implementar la funcionalidad de reseñas más adelante
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative flex flex-col items-center bg-gray-900 text-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-xl mx-auto my-10"
    >
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1 rounded-md"
      >
        ✕ Close
      </button>

      <div className="relative">
        <img
          src={getCoverImage(info)}
          alt={info.title}
          className="w-56 h-80 object-cover rounded-xl shadow-lg"
        />

        <div className="absolute -right-16 top-8 flex flex-col gap-4">
          <FloatingIcon
            icon={<Heart size={20} />}
            color={isFavorite ? "rose" : "gray"}
            tooltip={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            onClick={handleFavorite}
            active={isFavorite}
          />
          <FloatingIcon
            icon={<Bookmark size={20} />}
            color={isSaved ? "blue" : "gray"}
            tooltip={isSaved ? "Quitar de guardados" : "Guardar para después"}
            onClick={handleSave}
            active={isSaved}
          />
          <FloatingIcon
            icon={<Star size={20} />}
            color="yellow"
            tooltip="Reseñar"
            onClick={handleReview}
          />
        </div>
      </div>

      <h2 className="mt-6 text-2xl font-bold text-center">{info.title}</h2>
      <p className="text-gray-400 text-sm mb-4">
        {info.authors?.join(", ") || "Unknown Author"}
      </p>
      <p className="text-gray-300 text-center max-w-md">
        {info.description || "No description available."}
      </p>
    </motion.div>
  );
}

function FloatingIcon({ icon, color, tooltip, onClick, active = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.2, rotate: 8 }}
      whileTap={{ scale: 0.9 }}
      className={`relative bg-${color}-500 p-3 rounded-full cursor-pointer shadow-lg hover:shadow-${color}-400/40 transition ${
        active ? "ring-2 ring-white/50" : ""
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="absolute right-12 top-2 text-xs text-gray-300 opacity-0 hover:opacity-100 transition whitespace-nowrap">
        {tooltip}
      </span>
    </motion.div>
  );
}
