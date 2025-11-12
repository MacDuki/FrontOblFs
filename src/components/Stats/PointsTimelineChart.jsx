import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function PointsTimelineChart({ pointsByDate }) {
  const chartData = useMemo(() => {
    if (!pointsByDate || pointsByDate.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Helpers seguros para YYYY-MM-DD sin desfase
    const isYMD = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
    const parseYMDToLocalDate = (ymd) => {
      if (!isYMD(ymd)) return new Date(ymd);
      const [y, m, d] = ymd.split("-").map((n) => parseInt(n, 10));
      return new Date(y, m - 1, d);
    };
    const formatDM = (ymd) => {
      if (!isYMD(ymd)) return ymd;
      const [, m, d] = ymd.split("-");
      return `${d}/${m}`;
    };

    // Ordenar por fecha usando YYYY-MM-DD en local
    const sortedPoints = [...pointsByDate].sort((a, b) => {
      if (isYMD(a.date) && isYMD(b.date)) return a.date.localeCompare(b.date);
      return parseYMDToLocalDate(a.date) - parseYMDToLocalDate(b.date);
    });

    // Agrupar páginas por día usando la clave YYYY-MM-DD
    const pointsByDay = sortedPoints.reduce((acc, point) => {
      const key = isYMD(point.date)
        ? point.date
        : (() => {
            const dt = parseYMDToLocalDate(point.date);
            const y = dt.getFullYear();
            const m = String(dt.getMonth() + 1).padStart(2, "0");
            const d = String(dt.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
          })();
      acc[key] = (acc[key] || 0) + (point.quantity || 0);
      return acc;
    }, {});

    const labelsYMD = Object.keys(pointsByDay);
    const labels = labelsYMD.map((k) => formatDM(k));
    const data = labelsYMD.map((k) => pointsByDay[k]);

    // Calcular puntos acumulados
    const cumulativeData = data.reduce((acc, value, index) => {
      acc.push((acc[index - 1] || 0) + value);
      return acc;
    }, []);

    return {
      labels,
      datasets: [
        {
          label: "Páginas diarias",
          data,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
        {
          label: "Páginas acumuladas",
          data: cumulativeData,
          borderColor: "rgb(168, 85, 247)",
          backgroundColor: "rgba(168, 85, 247, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "rgb(168, 85, 247)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 6,
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
            return `${context.dataset.label}: ${context.parsed.y} págs`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.6)",
          font: {
            size: 11,
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
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  if (!pointsByDate || pointsByDate.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/40 text-4xl mb-2">📊</div>
          <p className="text-white/60 text-sm">
            No hay datos de puntos disponibles
          </p>
          <p className="text-white/40 text-xs mt-1">
            Completa actividades para ver tu progreso
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Evolución de Puntos</h3>
        <span className="text-xs text-white/50">
          Últimos {pointsByDate.length} registros
        </span>
      </div>
      <div className="flex-1 min-h-[250px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default PointsTimelineChart;
