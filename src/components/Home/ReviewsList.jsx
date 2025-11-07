import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyReviews,
  selectMyReviews,
  selectReviewsError,
  selectReviewsLoading,
  selectReviewsState,
} from "../../features/reviews.slice";

function ReviewsList() {
  const dispatch = useDispatch();
  const reviews = useSelector(selectMyReviews);
  const loading = useSelector(selectReviewsLoading);
  const error = useSelector(selectReviewsError);
  const { lastSyncAt } = useSelector(selectReviewsState);

  useEffect(() => {
    const FIVE_MINUTES = 5 * 60 * 1000;
    const shouldRefresh = !lastSyncAt || Date.now() - lastSyncAt > FIVE_MINUTES;
    
    if (shouldRefresh) {
      console.log("🔍 [ReviewsList] Fetching my reviews (cache expired or empty)...");
      dispatch(fetchMyReviews());
    } else {
      console.log("✅ [ReviewsList] Using cached reviews");
    }
  }, [dispatch, lastSyncAt]);

  console.log("📊 [ReviewsList] State:", { reviews, loading, error });

  if (loading) return <div className="p-4">Loading reviews...</div>;
  if (error)
    return (
      <div className="p-4 text-red-400">
        <div className="font-semibold">Error loading reviews</div>
        <div className="text-sm mt-1">{String(error)}</div>
      </div>
    );

  if (!reviews.length)
    return <div className="p-4 text-sm text-gray-400">You have no reviews yet.</div>;

  return (
    <div className="p-4 grid gap-3">
      {reviews.map((r) => (
        <div key={r._id || r.id} className="p-3 rounded border bg-white/5">
          <div className="font-semibold">{r.bookTitle || r.title || "Unknown book"}</div>
          <div className="text-xs text-yellow-300">Rating: {r.score ?? r.rating}/5</div>
          {r.comment ? (
            <div className="text-sm text-gray-300 mt-2">{r.comment}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default ReviewsList;
