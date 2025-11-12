import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PointsActivityChart({ pointsByDate }) {
  const chartData = useMemo(() => {
    if (!pointsByDate || pointsByDate.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Ordenar por fecha
    const sortedPoints = [...pointsByDate].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Agrupar por día de la semana
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const pointsByDayOfWeek = Array(7).fill(0);
    const countByDayOfWeek = Array(7).fill(0);

    // Parse seguro de YYYY-MM-DD a fecha local
    const isYMD = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
    const parseYMDToLocalDate = (ymd) => {
      if (!isYMD(ymd)) return new Date(ymd);
      const [y, m, d] = ymd.split("-").map((n) => parseInt(n, 10));
      return new Date(y, m - 1, d);
    };

    sortedPoints.forEach((point) => {
      const dayOfWeek = parseYMDToLocalDate(point.date).getDay();
      pointsByDayOfWeek[dayOfWeek] += point.quantity;
      countByDayOfWeek[dayOfWeek] += 1;
    });

    // Calcular promedio de páginas por día de la semana
    const avgPointsByDay = pointsByDayOfWeek.map((total, index) => {
      return countByDayOfWeek[index] > 0
        ? Math.round(total / countByDayOfWeek[index])
        : 0;
    });

    return {
      labels: dayNames,
      datasets: [
        {
          label: "Promedio de páginas",
          data: avgPointsByDay,
          backgroundColor: [
            "rgba(239, 68, 68, 0.8)", // Domingo - rojo
            "rgba(59, 130, 246, 0.8)", // Lunes - azul
            "rgba(16, 185, 129, 0.8)", // Martes - verde
            "rgba(245, 158, 11, 0.8)", // Miércoles - amarillo
            "rgba(168, 85, 247, 0.8)", // Jueves - púrpura
            "rgba(236, 72, 153, 0.8)", // Viernes - rosa
            "rgba(20, 184, 166, 0.8)", // Sábado - teal
          ],
          borderColor: [
            "rgb(239, 68, 68)",
            "rgb(59, 130, 246)",
            "rgb(16, 185, 129)",
            "rgb(245, 158, 11)",
            "rgb(168, 85, 247)",
            "rgb(236, 72, 153)",
            "rgb(20, 184, 166)",
          ],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  }, [pointsByDate]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          padding: 15,
          font: {
            size: 12,
            weight: "500",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `Promedio: ${context.parsed.y} págs`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.6)",
          font: {
            size: 11,
            weight: "500",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.6)",
          font: {
            size: 11,
          },
          callback: function (value) {
            return value + " págs";
          },
        },
      },
    },
  };

  if (!pointsByDate || pointsByDate.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/40 text-4xl mb-2">📅</div>
          <p className="text-white/60 text-sm">
            No hay datos de actividad disponibles
          </p>
          <p className="text-white/40 text-xs mt-1">
            Registra actividades para ver tu patrón semanal
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">
          Actividad semanal (páginas)
        </h3>
        <span className="text-xs text-white/50">Promedio por día</span>
      </div>
      <div className="flex-1 min-h-[250px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default PointsActivityChart;
