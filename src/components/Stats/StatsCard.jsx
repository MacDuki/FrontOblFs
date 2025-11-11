/* eslint-disable no-unused-vars */
function StatsCard({ icon: Icon, label, value, color, suffix = "" }) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 shadow-blue-500/20",
    green:
      "from-green-500/20 to-green-600/20 border-green-500/30 shadow-green-500/20",
    purple:
      "from-purple-500/20 to-purple-600/20 border-purple-500/30 shadow-purple-500/20",
    yellow:
      "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 shadow-yellow-500/20",
    pink: "from-pink-500/20 to-pink-600/20 border-pink-500/30 shadow-pink-500/20",
  };

  const iconColorClasses = {
    blue: "text-blue-400",
    green: "text-green-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
    pink: "text-pink-400",
  };

  return (
    <div
      className={`relative p-4 rounded-xl bg-gradient-to-br ${colorClasses[color]} 
      border backdrop-blur-sm overflow-hidden group transition-all duration-300`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Icon className={`text-2xl ${iconColorClasses[color]}`} />
          <span
            className={`text-3xl font-bold ${iconColorClasses[color]} drop-shadow-lg`}
          >
            {value}
            {suffix && (
              <span className="text-sm text-white/60 ml-1">{suffix}</span>
            )}
          </span>
        </div>
        <span className="text-white/80 text-sm font-medium">{label}</span>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
      </div>
    </div>
  );
}

export default StatsCard;
