import { useMemo } from "react";
import { FaCalendarAlt, FaChartLine, FaTrophy } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { useTranslation } from "react-i18next";

function PointsOverview({ summary, pointsByDate }) {
  const { t } = useTranslation();
  const stats = useMemo(() => {
    const total = summary?.total || 0;

    if (!pointsByDate || pointsByDate.length === 0) {
      return {
        total,
        dailyAverage: 0,
        bestDay: 0,
        activeDays: 0,
        trend: 0,
      };
    }

    // Calcular estadísticas
    const sortedPoints = [...pointsByDate].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Agrupar por día
    const pointsByDay = sortedPoints.reduce((acc, point) => {
      const date = new Date(point.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + point.quantity;
      return acc;
    }, {});

    const dailyTotals = Object.values(pointsByDay);
    const activeDays = dailyTotals.length;
    const dailyAverage = activeDays > 0 ? Math.round(total / activeDays) : 0;
    const bestDay = Math.max(...dailyTotals, 0);

    // Calcular tendencia (últimos 7 días vs 7 días anteriores)
    let trend = 0;
    if (sortedPoints.length > 7) {
      const recentPoints = sortedPoints
        .slice(-7)
        .reduce((sum, p) => sum + p.quantity, 0);
      const previousPoints = sortedPoints
        .slice(-14, -7)
        .reduce((sum, p) => sum + p.quantity, 0);

      if (previousPoints > 0) {
        trend = Math.round(
          ((recentPoints - previousPoints) / previousPoints) * 100
        );
      }
    }

    return {
      total,
      dailyAverage,
      bestDay,
      activeDays,
      trend,
    };
  }, [summary, pointsByDate]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Total Points */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 backdrop-blur-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <FaTrophy className="text-xl text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-400 drop-shadow-lg">
              {stats.total.toLocaleString()}
            </span>
            <span className="text-white/70 text-xs font-medium mt-1">
              {t('stats.totalPoints')}
            </span>
          </div>
        </div>
      </div>

      {/* Daily Average */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 backdrop-blur-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <FaCalendarAlt className="text-xl text-green-400" />
            {stats.activeDays > 0 && (
              <span className="text-xs text-green-300 bg-green-500/20 px-2 py-0.5 rounded-full">
                {stats.activeDays} {t('stats.days')}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-400 drop-shadow-lg">
              {stats.dailyAverage}
            </span>
            <span className="text-white/70 text-xs font-medium mt-1">
              {t('stats.dailyAverage')}
            </span>
          </div>
        </div>
      </div>

      {/* Best Day */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 backdrop-blur-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <GiProgression className="text-xl text-yellow-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-yellow-400 drop-shadow-lg">
              {stats.bestDay}
            </span>
            <span className="text-white/70 text-xs font-medium mt-1">
              {t('stats.bestDay')}
            </span>
          </div>
        </div>
      </div>

      {/* Trend */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 backdrop-blur-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <FaChartLine className="text-xl text-purple-400" />
            {stats.trend !== 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  stats.trend > 0
                    ? "text-green-300 bg-green-500/20"
                    : "text-red-300 bg-red-500/20"
                }`}
              >
                {stats.trend > 0 ? "↑" : "↓"} {Math.abs(stats.trend)}%
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span
              className={`text-2xl font-bold drop-shadow-lg ${
                stats.trend > 0
                  ? "text-green-400"
                  : stats.trend < 0
                  ? "text-red-400"
                  : "text-purple-400"
              }`}
            >
              {stats.trend > 0 ? "+" : ""}
              {stats.trend}%
            </span>
            <span className="text-white/70 text-xs font-medium mt-1">
              {t('stats.trend7d')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PointsOverview;
