import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaCalendarAlt, FaChartLine, FaTrophy } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";

function PointsOverview({ summary, pointsByDate }) {
  const { t } = useTranslation();
  const stats = useMemo(() => {
    const total = summary?.total || 0; // Total histórico de páginas

    if (!pointsByDate || pointsByDate.length === 0) {
      return {
        total,
        rangeTotal: 0,
        bestDay: 0,
        activeDays: 0,
        trend: 0,
        last7Days: [],
      };
    }

    // Calcular estadísticas
    const sortedPoints = [...pointsByDate].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Normalizar por día local para coherencia
    const toLocalYMD = (d) => {
      const dt = new Date(d);
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, "0");
      const day = String(dt.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    const pointsByDay = sortedPoints.reduce((acc, point) => {
      const key =
        typeof point.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(point.date)
          ? point.date
          : toLocalYMD(point.date);
      acc[key] = (acc[key] || 0) + (point.quantity || 0);
      return acc;
    }, {});

    const dailyTotals = Object.values(pointsByDay);
    const activeDays = dailyTotals.length;
    const rangeTotal = dailyTotals.reduce((s, v) => s + v, 0);
    const bestDay = Math.max(...dailyTotals, 0);

    // Últimos 7 días con sus totales
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const ymd = toLocalYMD(date);
      const pages = pointsByDay[ymd] || 0;
      const dayName = date.toLocaleDateString("es-ES", { weekday: "short" });
      const dayNum = date.getDate();
      last7Days.push({ date: ymd, dayName, dayNum, pages });
    }

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
      rangeTotal,
      bestDay,
      activeDays,
      trend,
      last7Days,
    };
  }, [summary, pointsByDate]);

  return (
    <div className="flex flex-col  gap-3">
      <div className="flex items-center justify-around">
        {/* Total Páginas */}
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
                Páginas totales
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
                Mejor día (páginas)
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
                Tendencia 7d (páginas)
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* Últimos 7 días */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 backdrop-blur-sm col-span-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-semibold text-sm">
                Últimos 7 días
              </h4>
              <FaCalendarAlt className="text-lg text-green-400" />
            </div>
            <div className="grid grid-cols-7 gap-1">
              {stats.last7Days.map((day, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center p-1 rounded bg-white/5"
                >
                  <span className="text-[10px] text-white/50 uppercase">
                    {day.dayName}
                  </span>
                  <span className="text-xs text-white/70">{day.dayNum}</span>
                  <span className="text-lg font-bold text-green-400">
                    {day.pages}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PointsOverview;
