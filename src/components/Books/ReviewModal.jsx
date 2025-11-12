import { AnimatePresence, motion as Motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  createOptimistic,
  createReview,
  removeOptimistic,
} from "../../features/reviews.slice";
import useLibraryItems from "../../hooks/useLibraryItem";
import RatingStars from "./ReviewModal/RatingStars";
import ReviewHeader from "./ReviewModal/ReviewHeader";
import ReviewTextArea from "./ReviewModal/ReviewTextArea";

export default function ReviewModal({ book, isOpen, onClose, onSubmit }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [redirecting, setRedirecting] = useState(false);
  const [portalEl, setPortalEl] = useState(null);

  const { items } = useLibraryItems();

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
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

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
      alert(t('reviewModal.ratingRequired'));
      return;
    }

    // Verificar que el libro esté agregado como library item
    const libraryItem = items.find((it) => it.originalBookId === book.id);
    if (!libraryItem) {
      setError(t('reviewModal.addToLibraryFirst'));
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
      reviewPayload.comment = t('reviewModal.noComment');
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
        comment:
          reviewText && reviewText.trim() !== ""
            ? reviewText.trim()
            : t('reviewModal.noComment'),
        createdAt: new Date().toISOString(),
        // Datos temporales para mostrar mientras se carga
        user: {
          username: "Tu usuario", // Esto se reemplazará con los datos reales
        },
      };

      // Dispatch optimista: agregar inmediatamente al state
      dispatch(createOptimistic(tempReview));

      try {
        const resultAction = await dispatch(
          createReview({ ...reviewPayload, __tempKey: tempKey })
        ).unwrap();

        setSuccess(t('reviewModal.success'));
        if (onSubmit) onSubmit(resultAction);

        setTimeout(() => {
          setSuccess(null);
          handleClose();
        }, 1200);
      } catch (err) {
        dispatch(removeOptimistic(tempId));

        const errorWithStatus = {
          message: typeof err === "string" ? err : err?.message || err,
          status: err?.status,
          response: { status: err?.status, data: err?.data },
        };
        throw errorWithStatus;
      }
    } catch (err) {
      console.error("❌ [ReviewModal] Error creating review:", err);
      console.error("❌ Error details:", {
        message: err?.message,
        status: err?.response?.status || err?.status,
        data: err?.response?.data || err?.data,
      });

      let errorMessage = t('reviewModal.error');
      const statusCode = err?.response?.status || err?.status;

      if (statusCode === 403) {
        errorMessage = t('reviewModal.limitReached');
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
        errorMessage =
          typeof err.message === "string" ? err.message : String(err.message);

        if (
          errorMessage.toLowerCase().includes("plan") ||
          errorMessage.toLowerCase().includes("límite") ||
          errorMessage.toLowerCase().includes("limite") ||
          errorMessage.toLowerCase().includes("alcanzado") ||
          errorMessage.toLowerCase().includes("máximo") ||
          errorMessage.toLowerCase().includes("maximo")
        ) {
          errorMessage = t('reviewModal.limitReached');
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
    setReviewText("");
    setError(null);
    setSuccess(null);
    onClose();
  };

  if (!isOpen || !portalEl) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/*header*/}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-gradient-to-br from-stone-900/40 via-stone-900/60 to-black/70 backdrop-blur-md z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-gradient-to-br from-stone-50 to-stone-100/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-stone-200/60 relative max-h-[85vh] flex flex-col"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-orange-500 to-amber-600" />

              <ReviewHeader
                coverImage={coverImage}
                title={info.title}
                authors={info.authors}
                onClose={handleClose}
                CloseIcon={
                  <X className="w-5 h-5 text-stone-600 group-hover:text-stone-900 transition-colors" />
                }
              />

              <form
                onSubmit={handleSubmit}
                className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-5 relative"
              >
                {error && (
                  <Motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl flex items-start gap-3 ${
                      redirecting
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    {redirecting ? (
                      <Motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
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
                      <p
                        className={`text-sm font-medium leading-relaxed ${
                          redirecting ? "text-amber-700" : "text-red-700"
                        }`}
                      >
                        {error}
                      </p>
                    </div>
                  </Motion.div>
                )}
                {success && (
                  <Motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {success}
                  </Motion.div>
                )}
                {/*Rating*/}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-stone-200/50">
                  <label className="block text-xs font-semibold text-stone-900 mb-4 tracking-wide uppercase">
                    {t('reviewModal.rating')}
                  </label>
                  <RatingStars value={rating} onChange={setRating} />
                </div>
                {/*Your thoughts*/}
                <ReviewTextArea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder={t('reviewModal.thoughtsPlaceholder')}
                />
                {/*Buttons*/}
                <div className="flex gap-3 pt-4">
                  <Motion.button
                    type="button"
                    onClick={handleClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-5 py-3 border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-100/80 hover:border-stone-400 transition-all backdrop-blur-sm"
                  >
                    {t('reviewModal.cancel')}
                  </Motion.button>
                  <Motion.button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    whileHover={{ scale: rating === 0 ? 1 : 1.02 }}
                    whileTap={{ scale: rating === 0 ? 1 : 0.98 }}
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:from-stone-300 disabled:to-stone-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/25 disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        {t('reviewModal.saving')}
                      </span>
                    ) : (
                      t('reviewModal.publish')
                    )}
                  </Motion.button>
                </div>
              </form>
            </Motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, portalEl);
}
