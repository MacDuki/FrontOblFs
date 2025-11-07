/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import { useState } from "react";
import useLibraryItems from "../../hooks/useLibraryItem";
import api from "../../api/api";

export default function ReviewModal({ book, isOpen, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  

  const { items } = useLibraryItems();

  if (!book) return null;

  const info = book.volumeInfo || {};
  
  const getCoverImage = (info) => {
    const img = info?.imageLinks;
    if (!img) return "https://via.placeholder.com/120x180?text=No+Cover";
    return (
      img.thumbnail ||
      img.smallThumbnail ||
      img.medium ||
      img.large ||
      "https://via.placeholder.com/120x180?text=No+Cover"
    );
  };

  const coverImage = getCoverImage(info);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Please select a rating before saving.");
      return;
    }

    // Verificar que el libro esté agregado como library item
    const libraryItem = items.find((it) => it.originalBookId === book.id);
    if (!libraryItem) {
      setError(
        "Debes agregar este libro a tu biblioteca antes de crear una reseña."
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const reviewPayload = {
      originalBookId: book.id,
      bookTitle: info.title,
      score: Number(rating),
    };

    if (reviewText && reviewText.trim() !== "") {
      reviewPayload.comment = reviewText.trim();
    } else {
      reviewPayload.comment = "Sin comentario";
    }

    try {
      const { data } = await api.post("/reviews", reviewPayload);
      // Persist a local copy so the client can show the review even if backend
      // doesn't provide a GET endpoint for reviews.
      try {
        const saved = data || { ...reviewPayload, _id: `local_${Date.now()}` };
        const existing = JSON.parse(localStorage.getItem("my_reviews") || "[]");
        existing.unshift(saved);
        // keep a reasonable cap
        localStorage.setItem("my_reviews", JSON.stringify(existing.slice(0, 200)));
        // notify other parts of the app (ReviewsList) that local reviews updated
        try {
          window.dispatchEvent(new CustomEvent("my_reviews_updated", { detail: saved }));
        } catch (e) {
          // ignore if CustomEvent not available in some env
        }
        console.debug("[ReviewModal] saved local review", saved);
      } catch (e) {
        console.warn("Could not persist local review:", e);
      }
      setSuccess("Reseña publicada correctamente");
      if (onSubmit) onSubmit(data);
      setTimeout(() => {
        setSuccess(null);
        handleClose();
      }, 1200);
    } catch (err) {
      console.error("Error creating review:", err);
      const body = err.response?.data;
      const msg = body?.message || body?.error || err.message || "Error al crear la reseña";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setReviewText("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-gradient-to-br from-stone-900/40 via-stone-900/60 to-black/70 backdrop-blur-md z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-gradient-to-br from-stone-50 to-stone-100/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-stone-200/60 relative"
            >

              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-orange-500 to-amber-600" />
              
              
              <div className="px-8 py-6 relative backdrop-blur-sm bg-white/40 border-b border-stone-200/50">
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-5 p-2 rounded-lg hover:bg-stone-900/5 transition-all group active:scale-95 z-10"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-stone-600 group-hover:text-stone-900 transition-colors" />
                </button>
                <div className="flex items-center gap-5">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative shrink-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg blur-xl" />
                    <img
                      src={coverImage}
                      alt={info.title}
                      className="relative w-24 h-36 object-cover rounded-lg shadow-lg border border-stone-200/50"
                    />
                  </motion.div>
                  
                  {/* Texto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                      <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                        Review
                      </h2>
                    </div>
                    <p className="text-stone-600 text-sm line-clamp-2 font-medium pr-8">
                      {info.title}
                    </p>
                    {info.authors && info.authors.length > 0 && (
                      <p className="text-stone-500 text-xs mt-1 line-clamp-1">
                        by {info.authors.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="px-8 py-7 space-y-6 relative">
                {/* Feedback */}
                {error && (
                  <div className="p-3 bg-red-700/20 border border-red-600/30 rounded-lg text-sm text-red-100">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-emerald-700/20 border border-emerald-600/30 rounded-lg text-sm text-emerald-900">
                    {success}
                  </div>
                )}
                
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-stone-200/50">
                  <label className="block text-sm font-semibold text-stone-900 mb-4 tracking-wide uppercase text-xs">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="transition-all p-1 rounded-lg hover:bg-amber-50"
                      >
                        <Star
                          className={`w-8 h-8 transition-all duration-200 ${
                            star <= (hoveredRating || rating)
                              ? "fill-amber-400 text-amber-500 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]"
                              : "text-stone-300 fill-transparent hover:text-stone-400"
                          }`}
                          strokeWidth={2}
                        />
                      </motion.button>
                    ))}
                    {rating > 0 && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-3 text-base font-bold text-stone-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/50"
                      >
                        {rating}/5
                      </motion.span>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="review-text"
                    className="block text-sm font-semibold text-stone-900 mb-3 tracking-wide uppercase text-xs"
                  >
                    Your Thoughts
                    <span className="text-stone-500 font-normal normal-case ml-2 text-xs">(optional)</span>
                  </label>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200/50 focus-within:border-amber-400/50 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all">
                    <textarea
                      id="review-text"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share what you loved, what surprised you, or what you learned..."
                      rows={5}
                      className="w-full px-5 py-4 bg-transparent border-none focus:outline-none resize-none transition text-stone-800 placeholder:text-stone-400 text-[15px] leading-relaxed"
                    />
                    <div className="flex justify-between items-center px-5 py-3 border-t border-stone-200/50 bg-stone-50/50">
                      <p className="text-xs text-stone-500 font-medium">
                        {reviewText.length} characters
                      </p>
                      {reviewText.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Writing
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>


                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-5 py-3 border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-100/80 hover:border-stone-400 transition-all backdrop-blur-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    whileHover={{ scale: rating === 0 ? 1 : 1.02 }}
                    whileTap={{ scale: rating === 0 ? 1 : 0.98 }}
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:from-stone-300 disabled:to-stone-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/25 disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Saving...
                      </span>
                    ) : (
                      "Publish Review"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
