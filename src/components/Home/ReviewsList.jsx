import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import {
  fetchMyReviews,
  selectMyReviews,
  selectReviewsError,
  selectReviewsLoading,
  selectReviewsState,
  deleteReview,
} from "../../features/reviews.slice";
import useLibraryItems from "../../hooks/useLibraryItem";

function ReviewsList() {
  const dispatch = useDispatch();
  const reviews = useSelector(selectMyReviews);
  const loading = useSelector(selectReviewsLoading);
  const error = useSelector(selectReviewsError);
  const { lastSyncAt, myReviewsIds } = useSelector(selectReviewsState);
  const booksState = useSelector((state) => state.books); // Obtener el state completo de books
  const { items: libraryItems } = useLibraryItems(); // Obtener items de la biblioteca con coverUrl

  useEffect(() => {
    const FIVE_MINUTES = 5 * 60 * 1000;
    const shouldRefresh = !lastSyncAt || Date.now() - lastSyncAt > FIVE_MINUTES;
    
    if (shouldRefresh) {
      dispatch(fetchMyReviews());
    }
  }, [dispatch, lastSyncAt]);

  // Función para manejar la eliminación de una review
  const handleDelete = async (reviewId) => {
    try {
      await dispatch(deleteReview(reviewId)).unwrap();
    } catch (err) {
      console.error("❌ Error al eliminar review:", err);
    }
  };

  // Función para obtener la imagen del libro
  const getCoverImage = (review) => {
    // 1. Primero intentar buscar en libraryItems (tienen coverUrl guardada)
    if (review.originalBookId && libraryItems) {
      const libraryItem = libraryItems.find(
        item => item.originalBookId === review.originalBookId
      );
      if (libraryItem?.coverUrl) {
        return libraryItem.coverUrl;
      }
    }

    // 2. Si no está en library, buscar en Redux books (categoryBooks)
    const book = findBook(review);
    if (book) {
      const info = book.volumeInfo;
      const img = info?.imageLinks;
      
      if (img) {
        return img.extraLarge || img.large || img.medium || img.small || img.thumbnail || img.smallThumbnail;
      }
    }

    return null;
  };

  // Función para buscar el libro en Redux por ID o título
  const findBook = (review) => {
    const { categoryBooks } = booksState;
    
    // Buscar en todas las categorías
    for (const category in categoryBooks) {
      const books = categoryBooks[category];
      if (Array.isArray(books)) {
        // Buscar por originalBookId si existe
        if (review.originalBookId) {
          const book = books.find(b => b.id === review.originalBookId);
          if (book) return book;
        }
        
        // Buscar por título como fallback
        const bookTitle = review.bookTitle || review.title;
        if (bookTitle) {
          const book = books.find(b => 
            b.volumeInfo?.title?.toLowerCase() === bookTitle.toLowerCase()
          );
          if (book) return book;
        }
      }
    }
    return null;
  };

  if (loading) return <div className="p-4 text-white">Loading reviews...</div>;
  if (error)
    return (
      <div className="p-4 text-red-400">
        <div className="font-semibold">Error loading reviews</div>
        <div className="text-sm mt-1">{String(error)}</div>
      </div>
    );

  if (!reviews.length)
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-lg text-gray-300 font-medium">No reviews yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Start reading and share your thoughts!
        </p>
      </div>
    );

  return (
    <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      <div className="grid gap-4">
        {reviews.map((review) => {
          const rating = review.score ?? review.rating ?? 0;
          const bookCover = getCoverImage(review);
          const book = findBook(review);
          const info = book?.volumeInfo;
          
          const libraryItem = libraryItems?.find(
            item => item.originalBookId === review.originalBookId
          );
          
          return (
            <div
              key={review._id || review.id}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
            >
              {/* Delete button - top right */}
              <button
                onClick={() => handleDelete(review._id || review.id)}
                className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/20 hover:scale-110 z-10"
                title="Eliminar review"
              >
                <Trash2 size={16} />
              </button>

              <div className="flex gap-4 p-4">
                {/* Book Cover */}
                <div className="flex-shrink-0">
                  {bookCover ? (
                    <img
                      src={bookCover}
                      alt={info?.title || libraryItem?.titulo || review.bookTitle || review.title || "Book cover"}
                      className="w-20 h-28 object-cover rounded-lg shadow-lg border border-white/20"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="w-20 h-28 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg shadow-lg border border-white/20 flex items-center justify-center text-3xl"
                    style={{ display: bookCover ? 'none' : 'flex' }}
                  >
                    📖
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  {/* Book Title */}
                  <h3 className="font-semibold text-white text-lg mb-1 truncate">
                    {info?.title || libraryItem?.titulo || review.bookTitle || review.title || "Unknown Book"}
                  </h3>

                  {/* Author if available */}
                  {(info?.authors || libraryItem?.authors) && (
                    <p className="text-xs text-gray-400 mb-2">
                      by {Array.isArray(info?.authors) 
                        ? info.authors.join(', ') 
                        : Array.isArray(libraryItem?.authors)
                        ? libraryItem.authors.join(', ')
                        : info?.authors || libraryItem?.authors}
                    </p>
                  )}

                  {/* Rating Stars */}
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

                  {/* Review Comment */}
                  {review.comment && (
                    <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                      {review.comment}
                    </p>
                  )}

                  {/* Review Date */}
                  {review.createdAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-pink-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
}

export default ReviewsList;
