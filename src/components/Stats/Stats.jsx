import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectAllCollections } from "../../features/collections.slice";
import { selectAllLibraryItems } from "../../features/libraryItem.slice";
import {
  selectAllReviews,
  selectMyReviews,
} from "../../features/reviews.slice";
import { usePoints } from "../../hooks/usePoints";

import PointsAchievements from "./PointsAchievements";
import PointsHeatmap from "./PointsHeatmap";
import PointsOverview from "./PointsOverview";
import PointsTimelineChart from "./PointsTimelineChart";

function Stats() {
  const { t, i18n } = useTranslation();
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
    // Para incluir la actividad de "hoy" si el backend trata "to" como límite exclusivo,
    // usamos "mañana" para la llamada, pero mostramos "hoy" en la UI.
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fetchTo = tomorrow.toISOString().split("T")[0];

    setDateRange({ from, to });

    // Fetch datos de puntos
    fetchPointsSummary();
    fetchPointsByDate(from, fetchTo);
  }, [fetchPointsSummary, fetchPointsByDate]);

  // Helpers de rango
  const toYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Formatea YYYY-MM-DD a dd/mm/yyyy sin depender del Date parser (evita desfases)
  const formatYMDToDMY = (ymd) => {
    if (!ymd || typeof ymd !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(ymd))
      return ymd || "";
    const [y, m, d] = ymd.split("-");
    return `${d}/${m}/${y}`;
  };

  const applyRange = (fromStr, toStr, force = true) => {
    if (!fromStr || !toStr) return;
    console.log(`📅 [Stats] Applying range: ${fromStr} to ${toStr}`);

    // Inclusivo: enviar to + 1 día al backend (parsear como fecha local)
    const [y, m, d] = toStr.split("-").map((n) => parseInt(n, 10));
    const toDate = new Date(y, m - 1, d);
    const fetchToDate = new Date(toDate);
    fetchToDate.setDate(fetchToDate.getDate() + 1);
    const fetchToStr = toYMD(fetchToDate);

    console.log(
      `📅 [Stats] Fetching from ${fromStr} to ${fetchToStr} (includes ${toStr})`
    );

    setDateRange({ from: fromStr, to: toStr });

    // Traer por fecha y también refrescar resumen por si mostrás totales
    fetchPointsByDate(fromStr, fetchToStr, force);
    fetchPointsSummary(force);
  };

  const setPresetDays = (days) => {
    const today = new Date();
    const from = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
    const fromStr = toYMD(from);
    const toStr = toYMD(today);
    applyRange(fromStr, toStr, true);
  };

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


    const avgRating =
      reviews?.length > 0
        ? (
            reviews.reduce((sum, review) => sum + (review.score || 0), 0) /
            reviews.length
          ).toFixed(1)
        : 0;

    
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
        <h2 className="text-2xl font-bold text-white mb-2">{t('stats.title')}</h2>
        <p className="text-white/60 text-sm">
          {t('stats.subtitle')}
        </p>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-4 flex-shrink-0">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">{t('stats.currentlyReading')}</span>
            <span className="text-white font-bold text-xl">
              {stats.readingBooks}
            </span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">{t('stats.collections')}</span>
            <span className="text-white font-bold text-xl">
              {stats.totalCollections}
            </span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">{t('stats.pagesRead')}</span>
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
            <h2 className="text-xl font-bold text-white">{t('stats.pointsAnalytics')}</h2>
            <p className="text-white/60 text-xs mt-1">
              {t('stats.trackPoints')}
            </p>
          </div>
          {isLoadingPoints && (
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
              {t('stats.loading')}
            </div>
          )}
        </div>

        {/* Controles de rango */}
        <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10 flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <label className="text-xs text-white/60 mb-1">{t('stats.from')}</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange((r) => ({ ...r, from: e.target.value }))
                }
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm"
              />
            </div>
            <div className="flex flex-col ">
              <label className="text-xs text-white/60 mb-1">{t('stats.until')}</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange((r) => ({ ...r, to: e.target.value }))
                }
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm"
              />
            </div>
            <button
              onClick={() => applyRange(dateRange.from, dateRange.to, true)}
              className="mt-5 h-8 px-3 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-500"
            >
              {t('stats.apply')}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">{t('stats.quick')}</span>
            <button
              onClick={() => setPresetDays(7)}
              className="h-8 px-3 rounded bg-white/10 text-white text-sm border border-white/10 hover:bg-white/15"
            >
              {t('stats.lastWeek')}
            </button>
            <button
              onClick={() => setPresetDays(30)}
              className="h-8 px-3 rounded bg-white/10 text-white text-sm border border-white/10 hover:bg-white/15"
            >
              {t('stats.lastMonth')}
            </button>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="min-h-[350px]">
            <PointsTimelineChart pointsByDate={pointsByDate} />
          </div>
          <div className="min-h-[350px] px-3">
            <PointsOverview summary={summary} pointsByDate={pointsByDate} />
          </div>
        </div>

        {/* Heatmap de actividad */}
        <div className="mt-4">
          <PointsHeatmap pointsByDate={pointsByDate} />
        </div>

        {/* Logros */}
        <div className="mt-4">
          <PointsAchievements summary={summary} pointsByDate={pointsByDate} />
        </div>

        {dateRange.from && dateRange.to && (
          <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-white/60 text-xs text-center">
              {t('stats.showingData')}{" "}
              <span className="text-white/80 font-medium">
                {formatYMDToDMY(dateRange.from)}
              </span>{" "}
              {t('stats.to')}{" "}
              <span className="text-white/80 font-medium">
                {formatYMDToDMY(dateRange.to)}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Stats;
