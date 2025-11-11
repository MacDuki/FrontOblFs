import { useMemo } from "react";
import {
  FaBolt,
  FaFire,
  FaMedal,
  FaRocket,
  FaStar,
  FaTrophy,
} from "react-icons/fa";
import { GiLaurelCrown, GiPodiumWinner } from "react-icons/gi";

function PointsAchievements({ summary, pointsByDate }) {
  const achievements = useMemo(() => {
    const total = summary?.total || 0;

    if (!pointsByDate || pointsByDate.length === 0) {
      return [];
    }

    const sortedPoints = [...pointsByDate].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Calcular racha actual
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Agrupar por día
    const datesWithPoints = new Set(
      sortedPoints.map((p) => new Date(p.date).toISOString().split("T")[0])
    );

    // Calcular racha actual
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split("T")[0];

      if (datesWithPoints.has(dateStr)) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calcular racha más larga
    let lastDate = null;
    sortedPoints.forEach((point) => {
      const currentDate = new Date(point.date).toISOString().split("T")[0];

      if (!lastDate) {
        tempStreak = 1;
      } else {
        const lastDateTime = new Date(lastDate);
        const currentDateTime = new Date(currentDate);
        const diffDays = Math.round(
          (currentDateTime - lastDateTime) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak);
      lastDate = currentDate;
    });

    // Mejor día
    const pointsByDay = sortedPoints.reduce((acc, point) => {
      const date = new Date(point.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + point.quantity;
      return acc;
    }, {});

    // Días activos
    const activeDays = Object.keys(pointsByDay).length;

    // Definir logros
    const allAchievements = [
      {
        id: "beginner",
        icon: FaStar,
        title: "Primer Paso",
        description: "Gana tus primeros 10 puntos",
        threshold: 10,
        color: "blue",
      },
      {
        id: "learner",
        icon: FaMedal,
        title: "Aprendiz",
        description: "Acumula 100 puntos",
        threshold: 100,
        color: "green",
      },
      {
        id: "expert",
        icon: FaTrophy,
        title: "Experto",
        description: "Alcanza 500 puntos",
        threshold: 500,
        color: "yellow",
      },
      {
        id: "master",
        icon: GiLaurelCrown,
        title: "Maestro",
        description: "Consigue 1000 puntos",
        threshold: 1000,
        color: "purple",
      },
      {
        id: "legend",
        icon: GiPodiumWinner,
        title: "Leyenda",
        description: "Supera los 2500 puntos",
        threshold: 2500,
        color: "pink",
      },
      {
        id: "streak3",
        icon: FaFire,
        title: "Racha de Fuego",
        description: "3 días consecutivos",
        threshold: 3,
        value: currentStreak,
        color: "orange",
        type: "streak",
      },
      {
        id: "streak7",
        icon: FaBolt,
        title: "Semana Perfecta",
        description: "7 días consecutivos",
        threshold: 7,
        value: currentStreak,
        color: "yellow",
        type: "streak",
      },
      {
        id: "active30",
        icon: FaRocket,
        title: "Dedicado",
        description: "30 días activos",
        threshold: 30,
        value: activeDays,
        color: "green",
        type: "days",
      },
    ];

    // Filtrar logros desbloqueados
    return allAchievements.map((achievement) => {
      const value =
        achievement.type === "streak"
          ? currentStreak
          : achievement.type === "days"
          ? activeDays
          : total;

      const isUnlocked = value >= achievement.threshold;
      const progress = Math.min((value / achievement.threshold) * 100, 100);

      return {
        ...achievement,
        isUnlocked,
        progress: Math.round(progress),
        currentValue: value,
      };
    });
  }, [summary, pointsByDate]);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
    green:
      "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
    yellow:
      "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400",
    purple:
      "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
    pink: "from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-400",
    orange:
      "from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400",
  };

  if (achievements.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/40 text-4xl mb-2">🏆</div>
          <p className="text-white/60 text-sm">
            Completa actividades para desbloquear logros
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Achievements</h3>
        <span className="text-xs text-white/60">
          {unlockedCount}/{achievements.length} desbloqueados
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`relative p-3 rounded-xl bg-gradient-to-br ${
              colorClasses[achievement.color]
            } border backdrop-blur-sm transition-all duration-300 ${
              achievement.isUnlocked
                ? "opacity-100 scale-100"
                : "opacity-50 scale-95 grayscale"
            }`}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              {/* Icono */}
              <div
                className={`text-3xl ${
                  achievement.isUnlocked
                    ? achievement.color === "blue"
                      ? "text-blue-400"
                      : achievement.color === "green"
                      ? "text-green-400"
                      : achievement.color === "yellow"
                      ? "text-yellow-400"
                      : achievement.color === "purple"
                      ? "text-purple-400"
                      : achievement.color === "pink"
                      ? "text-pink-400"
                      : "text-orange-400"
                    : "text-white/30"
                }`}
              >
                <achievement.icon />
              </div>

              {/* Título */}
              <div className="flex flex-col gap-1">
                <span className="text-white/90 text-xs font-semibold leading-tight">
                  {achievement.title}
                </span>
                <span className="text-white/50 text-[10px] leading-tight">
                  {achievement.description}
                </span>
              </div>

              {/* Progreso */}
              {!achievement.isUnlocked && (
                <div className="w-full">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/30 rounded-full transition-all duration-500"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/40 mt-1 block">
                    {achievement.currentValue}/{achievement.threshold}
                  </span>
                </div>
              )}

              {/* Badge de desbloqueado */}
              {achievement.isUnlocked && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white/20">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PointsAchievements;
