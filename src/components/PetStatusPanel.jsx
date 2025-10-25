import { IoHappy, IoRestaurant } from "react-icons/io5";

/**
 * Props: hunger (0-100), happiness (0-100)
 */
export default function PetStatusPanel({ hunger, happiness }) {
  const h = clamp(hunger);
  const hp = clamp(happiness);

  return (
    <div className=" w-full max-w-sm">
      <div className="flex justify-center gap-8">
        <CircularProgress
          value={h}
          color="stroke-red-500"
          icon={<IoRestaurant className="text-red-500" size={18} />}
          label="Hambre"
        />
        <CircularProgress
          value={hp}
          color="stroke-green-500"
          icon={<IoHappy className="text-green-500" size={18} />}
          label="Felicidad"
        />
      </div>
    </div>
  );
}

function CircularProgress({ value, color, icon, label }) {
  const pct = Math.round(value);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
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
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={color}
            style={{
              transition: "stroke-dashoffset 0.5s ease-in-out",
            }}
          />
        </svg>
        {/* Icon and percentage in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon}
          <span className="text-xs text-white/90 font-medium mt-1">{pct}%</span>
        </div>
      </div>
    </div>
  );
}

function clamp(n) {
  const v = Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(100, v));
}
