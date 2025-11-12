import { Calendar, Edit2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  deleteReview,
  fetchMyReviews,
  revertUpdate,
  selectMyReviews,
  selectReviewsError,
  selectReviewsLoading,
  selectReviewsState,
  updateOptimistic,
  updateReview,
} from "../../features/reviews.slice";
import useLibraryItems from "../../hooks/useLibraryItem";
import EditReviewModal from "./EditReviewModal";

function ReviewsList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const reviews = useSelector(selectMyReviews);
  const loading = useSelector(selectReviewsLoading);
  const error = useSelector(selectReviewsError);
  const { lastSyncAt, myReviewsIds } = useSelector(selectReviewsState);
  const booksState = useSelector((state) => state.books);
  const { items: libraryItems } = useLibraryItems();

  useEffect(() => {
    if (!lastSyncAt && myReviewsIds.length === 0 && !loading) {
      console.log("📝 [ReviewsList] Carga inicial de reviews");
      dispatch(fetchMyReviews());
    }
  }, [dispatch, lastSyncAt, myReviewsIds.length, loading]);

  const [editingReview, setEditingReview] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");
  const [showCustomDates, setShowCustomDates] = useState(false);

  const filteredReviews = useMemo(() => {
    if (dateFilter === "all") return reviews;

    const now = new Date();
    let filterDateFrom = null;
    let filterDateTo = null;

    if (dateFilter === "week") {
      filterDateFrom = new Date();
      filterDateFrom.setDate(now.getDate() - 7);
      filterDateFrom.setHours(0, 0, 0, 0);
      filterDateTo = new Date();
      filterDateTo.setHours(23, 59, 59, 999);
    } else if (dateFilter === "month") {
      filterDateFrom = new Date();
      filterDateFrom.setMonth(now.getMonth() - 1);
      filterDateFrom.setHours(0, 0, 0, 0);
      filterDateTo = new Date();
      filterDateTo.setHours(23, 59, 59, 999);
    } else if (dateFilter === "custom") {
      if (customDateFrom) {
        const [year, month, day] = customDateFrom.split("-").map(Number);
        filterDateFrom = new Date(year, month - 1, day, 0, 0, 0, 0);
      }
      if (customDateTo) {
        const [year, month, day] = customDateTo.split("-").map(Number);
        filterDateTo = new Date(year, month - 1, day, 23, 59, 59, 999);
      }
    }

    return reviews.filter((review) => {
      if (!review.createdAt) return true;
      const reviewDate = new Date(review.createdAt);
      if (filterDateFrom && reviewDate < filterDateFrom) return false;
      if (filterDateTo && reviewDate > filterDateTo) return false;
      return true;
    });
  }, [reviews, dateFilter, customDateFrom, customDateTo]);

  const handleDelete = async (reviewId) => {
    try {
      await dispatch(deleteReview(reviewId)).unwrap();
    } catch (err) {
      console.error("❌ Error al eliminar review:", err);
    }
  };

  const handleEdit = (review) => setEditingReview(review);

  const handleSaveEdit = async (id, score, comment) => {
    const validComment =
      comment && typeof comment === "string" && comment.trim().length > 0
        ? comment.trim()
        : "Sin comentario";

    dispatch(clearError());
    dispatch(updateOptimistic({ id, score, comment: validComment }));

    try {
      await dispatch(
        updateReview({ id, score, comment: validComment })
      ).unwrap();
      setEditingReview(null);
    } catch (err) {
      dispatch(revertUpdate({ id }));
      const errorMessage =
        err.message || err || "Error al actualizar la reseña";
      setTimeout(() => dispatch(clearError()), 100);
      throw new Error(errorMessage);
    }
  };

  const getCoverImage = (review) => {
    if (review.originalBookId && libraryItems) {
      const libraryItem = libraryItems.find(
        (item) => item.originalBookId === review.originalBookId
      );
      if (libraryItem?.coverUrl) return libraryItem.coverUrl;
    }

    const book = findBook(review);
    if (book) {
      const info = book.volumeInfo;
      const img = info?.imageLinks;
      if (img) {
        return (
          img.extraLarge ||
          img.large ||
          img.medium ||
          img.small ||
          img.thumbnail ||
          img.smallThumbnail
        );
      }
    }
    return null;
  };

  const findBook = (review) => {
    const { categoryBooks } = booksState;
    for (const category in categoryBooks) {
      const books = categoryBooks[category];
      if (Array.isArray(books)) {
        if (review.originalBookId) {
          const book = books.find((b) => b.id === review.originalBookId);
          if (book) return book;
        }
        const bookTitle = review.bookTitle || review.title;
        if (bookTitle) {
          const book = books.find(
            (b) =>
              b.volumeInfo?.title?.toLowerCase() === bookTitle.toLowerCase()
          );
          if (book) return book;
        }
      }
    }
    return null;
  };

  if (loading)
    return <div className="p-4 text-white">{t("common.loading")}</div>;

  if (error)
    return (
      <div className="p-4 text-red-400">
        <div className="font-semibold">{t("common.error")}</div>
        <div className="text-sm mt-1">{String(error)}</div>
      </div>
    );

  if (!reviews.length)
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-lg text-gray-300 font-medium">
          {t("reviews.noReviews")}
        </p>
        <p className="text-sm text-gray-500 mt-2">{t("reviews.writeFirst")}</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <Calendar size={18} className="text-amber-400" />
          <span className="text-sm font-medium text-gray-300">
            {t("reviews.filterBy")}
          </span>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setDateFilter("week");
                setShowCustomDates(false);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                dateFilter === "week"
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                  : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-300"
              }`}
            >
              {t("reviews.lastWeek")}
            </button>
            <button
              onClick={() => {
                setDateFilter("month");
                setShowCustomDates(false);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                dateFilter === "month"
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                  : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-300"
              }`}
            >
              {t("reviews.lastMonth")}
            </button>
            <button
              onClick={() => {
                setDateFilter("custom");
                setShowCustomDates(true);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                dateFilter === "custom"
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                  : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-300"
              }`}
            >
              {t("reviews.custom")}
            </button>
            <button
              onClick={() => {
                setDateFilter("all");
                setShowCustomDates(false);
                setCustomDateFrom("");
                setCustomDateTo("");
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                dateFilter === "all"
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                  : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-300"
              }`}
            >
              {t("reviews.all")}
            </button>
          </div>

          {dateFilter !== "all" && (
            <span className="ml-auto text-xs text-gray-500">
              {filteredReviews.length} {t("reviews.of")} {reviews.length}
            </span>
          )}
        </div>

        {showCustomDates && (
          <div className="flex items-center gap-3 pt-3 border-t border-white/10 animate-fade-in">
            <div className="flex items-center gap-2 flex-1">
              <label className="text-xs text-gray-400 whitespace-nowrap">
                {t("reviews.from")}:
              </label>
              <input
                type="date"
                value={customDateFrom}
                onChange={(e) => setCustomDateFrom(e.target.value)}
                max={customDateTo || new Date().toISOString().split("T")[0]}
                className="flex-1 px-3 py-1.5 text-xs bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <label className="text-xs text-gray-400 whitespace-nowrap">
                {t("reviews.to")}:
              </label>
              <input
                type="date"
                value={customDateTo}
                onChange={(e) => setCustomDateTo(e.target.value)}
                min={customDateFrom}
                max={new Date().toISOString().split("T")[0]}
                className="flex-1 px-3 py-1.5 text-xs bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {filteredReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-base text-gray-300 font-medium">
            {t("reviews.noReviewsInPeriod")}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {t("reviews.tryAnotherRange")}
          </p>
        </div>
      ) : (
        <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid gap-4 pb-18">
            {filteredReviews.map((review) => {
              const rating = review.score ?? review.rating ?? 0;
              const bookCover = getCoverImage(review);
              const book = findBook(review);
              const info = book?.volumeInfo;

              const libraryItem = libraryItems?.find(
                (item) => item.originalBookId === review.originalBookId
              );

              return (
                <div
                  key={review._id || review.id}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1"
                >
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                    <button
                      onClick={() => handleEdit(review)}
                      className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all"
                      title={t("reviews.edit")}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(review._id || review.id)}
                      className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all"
                      title={t("reviews.delete")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex gap-4 p-4">
                    <div className="flex-shrink-0">
                      {bookCover ? (
                        <img
                          src={bookCover}
                          alt={
                            info?.title ||
                            libraryItem?.titulo ||
                            review.bookTitle ||
                            review.title ||
                            t("reviews.bookCover")
                          }
                          className="w-20 h-28 object-cover rounded-lg shadow-lg border border-white/20"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-20 h-28 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg shadow-lg border border-white/20 flex items-center justify-center text-3xl"
                        style={{ display: bookCover ? "none" : "flex" }}
                      >
                        📖
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-lg mb-1 truncate">
                        {info?.title ||
                          libraryItem?.titulo ||
                          review.bookTitle ||
                          review.title ||
                          t("reviews.unknownBook")}
                      </h3>

                      {(info?.authors || libraryItem?.authors) && (
                        <p className="text-xs text-gray-400 mb-2">
                          {t("reviews.by")}{" "}
                          {Array.isArray(info?.authors)
                            ? info.authors.join(", ")
                            : Array.isArray(libraryItem?.authors)
                            ? libraryItem.authors.join(", ")
                            : info?.authors || libraryItem?.authors}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg transition-all ${
                                star <= rating
                                  ? "text-yellow-400 scale-110"
                                  : "text-gray-600"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-400 font-medium">
                          {rating}/5
                        </span>
                      </div>

                      {review.comment && (
                        <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                          {review.comment}
                        </p>
                      )}

                      {review.createdAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.createdAt).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-orange-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:via-orange-500/5 group-hover:to-amber-500/5 transition-all duration-500 pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <EditReviewModal
        review={editingReview}
        isOpen={!!editingReview}
        onClose={() => setEditingReview(null)}
        onSave={handleSaveEdit}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.7);
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default ReviewsList;
