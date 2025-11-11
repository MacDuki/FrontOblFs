import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useLibraryItems from "../../hooks/useLibraryItem";
import { createReview, createOptimistic, removeOptimistic } from "../../features/reviews.slice";

export default function ReviewModal({ book, isOpen, onClose, onSubmit }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

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
      // Crear un placeholder temporal con ID único
      const tempId = `temp-${Date.now()}`;
      const tempKey = `k-${Date.now()}`;
      const tempReview = {
        _id: tempId,
        __tempKey: tempKey,
        originalBookId: book.id,
        bookTitle: info.title,
        score: Number(rating),
        comment: reviewText && reviewText.trim() !== "" ? reviewText.trim() : "Sin comentario",
        createdAt: new Date().toISOString(),
        // Datos temporales para mostrar mientras se carga
        user: {
          username: "Tu usuario" // Esto se reemplazará con los datos reales
        }
      };

      // Dispatch optimista: agregar inmediatamente al state
      dispatch(createOptimistic(tempReview));

      try {
        const resultAction = await dispatch(
          createReview({ ...reviewPayload, __tempKey: tempKey })
        ).unwrap();
        
        setSuccess("Reseña publicada correctamente");
        if (onSubmit) onSubmit(resultAction);
        
        setTimeout(() => {
          setSuccess(null);
          handleClose();
        }, 1200);
      } catch (err) {
        dispatch(removeOptimistic(tempId));
        
        const errorWithStatus = {
          message: typeof err === 'string' ? err : (err?.message || err),
          status: err?.status,
          response: { status: err?.status, data: err?.data }
        };
        throw errorWithStatus;
      }
    } catch (err) {
      console.error("❌ [ReviewModal] Error creating review:", err);
      console.error("❌ Error details:", {
        message: err?.message,
        status: err?.response?.status || err?.status,
        data: err?.response?.data || err?.data
      });
      
      let errorMessage = "Error al crear la reseña";
      const statusCode = err?.response?.status || err?.status;
      
      if (statusCode === 403) {
        errorMessage = "Has alcanzado el límite de reseñas de tu plan. Redirigiendo a cambiar plan...";
        setError(errorMessage);
        setRedirecting(true);
        
        setTimeout(() => {
          handleClose();
          navigate("/home?openPlanModal=true");
        }, 2000);
        
        return;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = typeof err.message === 'string' ? err.message : String(err.message);
        
        if (errorMessage.toLowerCase().includes("plan") || 
            errorMessage.toLowerCase().includes("límite") ||
            errorMessage.toLowerCase().includes("limite") ||
            errorMessage.toLowerCase().includes("alcanzado") ||
            errorMessage.toLowerCase().includes("máximo") ||
            errorMessage.toLowerCase().includes("maximo")) {
          errorMessage = "Has alcanzado el límite de reseñas de tu plan. Redirigiendo a cambiar plan...";
          setError(errorMessage);
          setRedirecting(true);
          
          setTimeout(() => {
            handleClose();
            navigate("/home?openPlanModal=true");
          }, 2000);
          
          return;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setReviewText("");
    setError(null);
    setSuccess(null);
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
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl flex items-start gap-3 ${
                      redirecting 
                        ? 'bg-amber-50 border border-amber-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {redirecting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-amber-400 border-t-amber-600 rounded-full flex-shrink-0 mt-0.5"
                      />
                    ) : (
                      <svg 
                        className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium leading-relaxed ${
                        redirecting ? 'text-amber-700' : 'text-red-700'
                      }`}>
                        {error}
                      </p>
                    </div>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {success}
                  </motion.div>
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
