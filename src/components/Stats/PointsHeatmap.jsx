import { useMemo } from "react";

function PointsHeatmap({ pointsByDate }) {
  const heatmapData = useMemo(() => {
    if (!pointsByDate || pointsByDate.length === 0) {
      return [];
    }

    // Crear últimos 28 días (4 semanas)
    const today = new Date();
    const days = [];

    for (let i = 27; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split("T")[0],
        dayName: date.toLocaleDateString("es-ES", { weekday: "short" }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString("es-ES", { month: "short" }),
        points: 0,
      });
    }

    // Agrupar puntos por fecha
    const pointsByDay = pointsByDate.reduce((acc, point) => {
      const date = new Date(point.date).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + point.quantity;
      return acc;
    }, {});

    // Asignar puntos a los días
    days.forEach((day) => {
      if (pointsByDay[day.date]) {
        day.points = pointsByDay[day.date];
      }
    });

    // Calcular máximo para escala
    const maxPoints = Math.max(...days.map((d) => d.points), 1);

    // Agregar intensidad (0-4)
    days.forEach((day) => {
      if (day.points === 0) {
        day.intensity = 0;
      } else {
        const ratio = day.points / maxPoints;
        if (ratio <= 0.25) day.intensity = 1;
        else if (ratio <= 0.5) day.intensity = 2;
        else if (ratio <= 0.75) day.intensity = 3;
        else day.intensity = 4;
      }
    });

    return days;
  }, [pointsByDate]);

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 0:
        return "bg-white/5";
      case 1:
        return "bg-green-500/30";
      case 2:
        return "bg-green-500/50";
      case 3:
        return "bg-green-500/70";
      case 4:
        return "bg-green-500/90";
      default:
        return "bg-white/5";
    }
  };

  if (!pointsByDate || pointsByDate.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/40 text-4xl mb-2">📆</div>
          <p className="text-white/60 text-sm">
            No hay datos de actividad disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Activity Heatmap</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">Menos</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((intensity) => (
              <div
                key={intensity}
                className={`w-3 h-3 rounded ${getIntensityColor(
                  intensity
                )} border border-white/10`}
              />
            ))}
          </div>
          <span className="text-xs text-white/50">Más</span>
        </div>
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-2">
        {heatmapData.map((day, index) => (
          <div
            key={index}
            className="group relative flex flex-col items-center"
          >
            {/* Día de la semana (solo primera fila) */}
            {index < 7 && (
              <span className="text-xs text-white/40 mb-1 uppercase">
                {day.dayName.charAt(0)}
              </span>
            )}

            {/* Celda del día */}
            <div
              className={`w-full aspect-square rounded ${getIntensityColor(
                day.intensity
              )} border border-white/10 hover:border-white/30 transition-all duration-200 cursor-pointer relative`}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div className="font-semibold">
                  {day.dayNumber} {day.month}
                </div>
                <div className="text-white/70">
                  {day.points > 0 ? `${day.points} puntos` : "Sin actividad"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estadística rápida */}
      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
        <div className="text-xs text-white/60">Últimos 28 días</div>
        <div className="text-xs text-white/80">
          <span className="font-semibold">
            {heatmapData.filter((d) => d.points > 0).length}
          </span>{" "}
          días activos
        </div>
      </div>
    </div>
  );
}

export default PointsHeatmap;
