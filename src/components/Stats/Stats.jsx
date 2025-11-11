import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllCollections } from "../../features/collections.slice";
import { selectAllLibraryItems } from "../../features/libraryItem.slice";
import {
  selectAllReviews,
  selectMyReviews,
} from "../../features/reviews.slice";
import { usePoints } from "../../hooks/usePoints";

import PointsAchievements from "./PointsAchievements";
import PointsActivityChart from "./PointsActivityChart";
import PointsHeatmap from "./PointsHeatmap";
import PointsOverview from "./PointsOverview";
import PointsTimelineChart from "./PointsTimelineChart";

function Stats() {
  // Obtener datos del store usando los selectores correctos
  const libraryItems = useSelector(selectAllLibraryItems);
  const myReviews = useSelector(selectMyReviews);
  const allReviews = useSelector(selectAllReviews);
  const collections = useSelector(selectAllCollections);

  // Hook de puntos
  const {
    summary,
    pointsByDate,
    isLoading: isLoadingPoints,
    fetchPointsByDate,
    fetchPointsSummary,
  } = usePoints();

  // Estado para el rango de fechas
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  // Calcular fechas por defecto (últimos 30 días)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const from = thirtyDaysAgo.toISOString().split("T")[0];
    const to = today.toISOString().split("T")[0];

    setDateRange({ from, to });

    // Fetch datos de puntos
    fetchPointsSummary();
    fetchPointsByDate(from, to);
  }, [fetchPointsSummary, fetchPointsByDate]);

  // Usar myReviews si tiene datos, sino usar allReviews
  const reviews = myReviews?.length > 0 ? myReviews : allReviews;

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalBooks = libraryItems?.length || 0;
    const completedBooks =
      libraryItems?.filter((item) => item.estado === "TERMINADO")?.length || 0;
    const readingBooks =
      libraryItems?.filter((item) => item.estado === "LEYENDO")?.length || 0;
    const totalReviews = reviews?.length || 0;
    const totalCollections = collections?.length || 0;

    // Calcular promedio de calificación
    const avgRating =
      reviews?.length > 0
        ? (
            reviews.reduce((sum, review) => sum + (review.score || 0), 0) /
            reviews.length
          ).toFixed(1)
        : 0;

    // Calcular total de páginas leídas
    const totalPagesRead = libraryItems?.reduce((sum, item) => {
      if (item.estado === "TERMINADO") {
        return sum + (item.book?.pageCount || 0);
      }
      return sum + (item.progreso || 0);
    }, 0);

    return {
      totalBooks,
      completedBooks,
      readingBooks,
      totalReviews,
      totalCollections,
      avgRating,
      totalPagesRead,
    };
  }, [libraryItems, reviews, collections]);

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex-shrink-0">
        <h2 className="text-2xl font-bold text-white mb-2">Reading Stats</h2>
        <p className="text-white/60 text-sm">
          Track your reading progress and achievements
        </p>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-4 flex-shrink-0">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Currently Reading</span>
            <span className="text-white font-bold text-xl">
              {stats.readingBooks}
            </span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Collections</span>
            <span className="text-white font-bold text-xl">
              {stats.totalCollections}
            </span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Pages Read</span>
            <span className="text-white font-bold text-xl">
              {stats.totalPagesRead?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Points Section */}
      <div className="flex-shrink-0 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Points Analytics</h2>
            <p className="text-white/60 text-xs mt-1">
              Track your points and activity over time
            </p>
          </div>
          {isLoadingPoints && (
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
              Loading...
            </div>
          )}
        </div>

        {/* Points Overview Cards */}
        <div className="mb-4">
          <PointsOverview summary={summary} pointsByDate={pointsByDate} />
        </div>

        {/* Points Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="min-h-[350px]">
            <PointsTimelineChart pointsByDate={pointsByDate} />
          </div>
          <div className="min-h-[350px]">
            <PointsActivityChart pointsByDate={pointsByDate} />
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="mt-4">
          <PointsHeatmap pointsByDate={pointsByDate} />
        </div>

        {/* Achievements */}
        <div className="mt-4">
          <PointsAchievements summary={summary} pointsByDate={pointsByDate} />
        </div>

        {/* Date Range Info */}
        {dateRange.from && dateRange.to && (
          <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-white/60 text-xs text-center">
              Mostrando datos desde{" "}
              <span className="text-white/80 font-medium">
                {new Date(dateRange.from).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>{" "}
              hasta{" "}
              <span className="text-white/80 font-medium">
                {new Date(dateRange.to).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Stats;
