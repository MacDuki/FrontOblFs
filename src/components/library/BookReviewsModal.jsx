import { AnimatePresence, motion as Motion } from "framer-motion";
import { Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReviewsByBook,
  selectReviewsByBook,
  selectReviewsLoading,
} from "../../features/reviews.slice";
import { Loader } from "../ui/Loader";

export default function BookReviewsModal({ item, isOpen, onClose }) {
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviewsByBook(item?.originalBookId));
  const loading = useSelector(selectReviewsLoading);
  const [portalEl, setPortalEl] = useState(null);

  // Create (or reuse) a portal root for modals
  useEffect(() => {
    let el = document.getElementById("app-modal-root");
    if (!el) {
      el = document.createElement("div");
      el.setAttribute("id", "app-modal-root");
      document.body.appendChild(el);
    }
    setPortalEl(el);
  }, []);

  useEffect(() => {
    if (isOpen && item?.originalBookId) {
      dispatch(fetchReviewsByBook(item.originalBookId));
    }
  }, [isOpen, item?.originalBookId, dispatch]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Debug: ver estructura de reviews
  useEffect(() => {
    if (reviews.length > 0) {
      console.log("📊 Reviews structure:", reviews[0]);
    }
  }, [reviews]);

  if (!item) return null;

  const title = item?.titulo || "Sin título";
  const authors = item?.authors?.join(", ") || "Autor desconocido";
  const coverUrl = item?.coverUrl;

  // Calcular estadísticas
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.score || 0), 0) / totalReviews
        ).toFixed(1)
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.score === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  const renderStars = (score) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= score ? "fill-amber-400 text-amber-400" : "text-stone-300"
            }
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Hoy";
    if (diffInDays === 1) return "Ayer";
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
    if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isOpen || !portalEl) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gradient-to-br from-stone-900/40 via-stone-900/60 to-black/70 backdrop-blur-md z-[999]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="w-full max-w-3xl max-h-[85vh] flex items-center justify-center">
              <Motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="bg-gradient-to-br from-stone-50 to-stone-100/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full overflow-hidden border border-stone-200/60 relative max-h-[85vh] flex flex-col"
              >
                {/* Barra lateral decorativa */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-orange-500 to-amber-600" />

                {/* Header */}
                <div className="relative px-6 py-5 border-b border-stone-200/50 bg-white/30 backdrop-blur-sm">
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 hover:bg-stone-200/50 rounded-full transition-colors group"
                  >
                    <X className="w-5 h-5 text-stone-600 group-hover:text-stone-900 transition-colors" />
                  </button>

                  <div className="flex gap-4 pr-12">
                    {/* Cover */}
                    <div className="flex-shrink-0">
                      <img
                        src={coverUrl}
                        alt={title}
                        className="w-20 h-28 object-cover rounded-lg shadow-md border border-stone-200"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-stone-900 mb-1 line-clamp-2">
                        {title}
                      </h2>
                      <p className="text-sm text-stone-600 mb-3">{authors}</p>

                      {/* Rating Summary */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-stone-900">
                            {averageRating}
                          </span>
                          <span className="text-sm text-stone-500">/ 5</span>
                        </div>
                        {renderStars(Math.round(Number(averageRating)))}
                        <span className="text-sm text-stone-500">
                          ({totalReviews}{" "}
                          {totalReviews === 1 ? "reseña" : "reseñas"})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                      <Loader size={40} iconSize={0} />
                      <p className="text-stone-600 font-medium">
                        Cargando reseñas...
                      </p>
                    </div>
                  ) : totalReviews === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center">
                        <Star className="w-8 h-8 text-stone-400" />
                      </div>
                      <p className="text-lg font-semibold text-stone-700">
                        Sin reseñas todavía
                      </p>
                      <p className="text-sm text-stone-500 text-center max-w-md">
                        Sé el primero en compartir tu opinión sobre este libro
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Rating Distribution */}
                      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-stone-200/50">
                        <h3 className="text-sm font-semibold text-stone-900 mb-3 uppercase tracking-wide">
                          Distribución de calificaciones
                        </h3>
                        <div className="space-y-2">
                          {ratingDistribution.map(
                            ({ rating, count, percentage }) => (
                              <div
                                key={rating}
                                className="flex items-center gap-3"
                              >
                                <div className="flex items-center gap-1 w-16">
                                  <span className="text-sm font-medium text-stone-700">
                                    {rating}
                                  </span>
                                  <Star
                                    size={12}
                                    className="fill-amber-400 text-amber-400"
                                  />
                                </div>
                                <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                                  <Motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
                                  />
                                </div>
                                <span className="text-xs text-stone-500 w-12 text-right">
                                  {count}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Reviews List */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide">
                          Todas las reseñas
                        </h3>
                        {reviews.map((review, index) => (
                          <Motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-stone-200/50 hover:border-stone-300/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                                  {review.user?.username
                                    ? review.user.username[0].toUpperCase()
                                    : review.userId?.username
                                    ? review.userId.username[0].toUpperCase()
                                    : review.username
                                    ? review.username[0].toUpperCase()
                                    : "?"}
                                </div>
                                <div>
                                  <p className="font-semibold text-stone-900">
                                    {review.user?.username ||
                                      review.userId?.username ||
                                      review.username ||
                                      "Usuario desconocido"}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {renderStars(review.score)}
                                    <span className="text-xs text-stone-500">
                                      {formatDate(review.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {review.comment &&
                              review.comment !== "Sin comentario" && (
                                <p className="text-sm text-stone-700 leading-relaxed">
                                  {review.comment}
                                </p>
                              )}
                          </Motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-stone-200/50 bg-white/30 backdrop-blur-sm">
                  <button
                    onClick={onClose}
                    className="w-full px-5 py-3 border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-100/80 hover:border-stone-400 transition-all"
                  >
                    Cerrar
                  </button>
                </div>
              </Motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, portalEl);
}
