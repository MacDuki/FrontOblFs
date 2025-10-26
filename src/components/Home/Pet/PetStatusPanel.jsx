import { IoHappy, IoRestaurant } from "react-icons/io5";

/**
 * Función para obtener colores basados en el porcentaje
 * @param {number} value - Valor entre 0-100
 * @param {string} type - 'hunger' o 'happiness'
 * @returns {object} - Objeto con strokeColor e iconColor
 */
function getColorByValue(value, type) {
  if (type === "hunger") {
    // Para hambre: valores altos = buenos (colores fríos), valores bajos = malos (colores cálidos alarmantes)
    if (value >= 80) return { strokeColor: "#A8E6CF", iconColor: "#A8E6CF" }; // Verde pastel
    if (value >= 60) return { strokeColor: "#FFD3A5", iconColor: "#FFD3A5" }; // Naranja pastel
    if (value >= 40) return { strokeColor: "#FFAAA5", iconColor: "#FFAAA5" }; // Coral
    return { strokeColor: "#FF6B6B", iconColor: "#FF6B6B" }; // Rojo alarmante
  } else {
    // Para felicidad: valores altos = buenos (colores cálidos suaves), valores bajos = malos (colores fríos)
    if (value >= 80) return { strokeColor: "#FFE5B4", iconColor: "#FFE5B4" }; // Amarillo pastel
    if (value >= 60) return { strokeColor: "#E5A8FF", iconColor: "#E5A8FF" }; // Púrpura pastel
    if (value >= 40) return { strokeColor: "#A8D8EA", iconColor: "#A8D8EA" }; // Azul pastel
    return { strokeColor: "#6C5CE7", iconColor: "#6C5CE7" }; // Púrpura oscuro alarmante
  }
}

/**
 * Props: hunger (0-100), happiness (0-100)
 */
export default function PetStatusPanel({ hunger, happiness }) {
  const h = clamp(hunger);
  const hp = clamp(happiness);

  const hungerColors = getColorByValue(h, "hunger");
  const happinessColors = getColorByValue(hp, "happiness");

  return (
    <div className=" w-full max-w-sm">
      <div className="flex justify-center gap-8">
        <CircularProgress
          value={h}
          strokeColor={hungerColors.strokeColor}
          iconColor={hungerColors.iconColor}
          icon={<IoRestaurant size={18} />}
          label="Hambre"
        />
        <CircularProgress
          value={hp}
          strokeColor={happinessColors.strokeColor}
          iconColor={happinessColors.iconColor}
          icon={<IoHappy size={18} />}
          label="Felicidad"
        />
      </div>
    </div>
  );
}

function CircularProgress({ value, strokeColor, iconColor, icon }) {
  const pct = Math.round(value);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col h-10 items-center gap-2">
      <div className="relative">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition:
                "stroke-dashoffset 0.5s ease-in-out, stroke 0.3s ease-in-out",
            }}
          />
        </svg>
        {/* Icon and percentage in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div style={{ color: iconColor }}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

function clamp(n) {
  const v = Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(100, v));
}
