/** Simple inline SVG icons (no deps) */
const IconUser = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20a8 8 0 0116 0" />
  </svg>
);
const IconSun = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
  </svg>
);
const IconCheck = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" fill="none" />
    <path d="M7 12l3 3 7-7" />
  </svg>
);
const Star = ({ filled }) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      className={filled ? "fill-yellow-400" : "fill-transparent"}
      stroke={filled ? "none" : "currentColor"}
      d="M12 3.6l2.8 5.67 6.26.91-4.53 4.42 1.07 6.24L12 18.9l-5.6 2.94 1.07-6.24L2 10.18l6.26-.91L12 3.6z"
    />
  </svg>
);
const Trophy = ({ color = "#000" }) => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" style={{ color }}>
    <path
      fill="currentColor"
      d="M18 3H6v2H3v3a5 5 0 005 5h.35A6.01 6.01 0 0011 15.9V18H8v2h8v-2h-3v-2.1A6.01 6.01 0 0015.65 13H16a5 5 0 005-5V5h-3V3zm-9 8a3 3 0 01-3-3V7h3v4zm12-3a3 3 0 01-3 3V7h3v1z"
    />
  </svg>
);

const Stars = ({ value = 0, max = 5 }) => {
  const full = Math.round(value); // simple whole-star display
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} filled={i < full} />
      ))}
    </div>
  );
};

/** Card component */
export default function UserProfile({
  username = "Username",
  totalPoints = 48,
  dailyGoal = 10,
  level = 4, // 0-5
  trophies = ["#f5b700", "#f5b700", "#111111"], // colors
}) {
  return (
    <div className=" w-full rounded-xl p-5 select-none">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full border border-black grid place-items-center">
          <IconUser className="w-5 h-5 fill-black" />
        </div>
        <h3 className="text-sm font-medium">{username}</h3>
      </div>

      {/* Total Points */}
      <div className="flex items-center gap-3 mb-3">
        <IconSun className="w-6 h-6 stroke-black fill-none" />
        <p className="text-sm">
          <span className="font-medium">Total Points:</span> {totalPoints}
        </p>
      </div>

      {/* Daily objective */}
      <div className="flex items-center gap-3 mb-3">
        <IconCheck className="w-6 h-6 stroke-green-600 fill-none" />
        <p className="text-sm">
          <span className="font-medium">Obj del día:</span> {dailyGoal}
        </p>
      </div>

      {/* Level */}
      <div className="mb-4">
        <p className="text-sm mb-1">lvl:</p>
        <Stars value={level} />
      </div>

      {/* Trophies */}
      <div>
        <p className="text-sm mb-1">Trophies:</p>
        <div className="flex items-center gap-2">
          {trophies.map((c, i) => (
            <Trophy key={i} color={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
