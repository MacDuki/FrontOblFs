import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaChartLine } from "react-icons/fa";

function UsageIndicatorPlus({ reviewCount }) {
  const { t } = useTranslation();
  const maxReviews = 10;

  const { percentage, color } = useMemo(() => {
    const pct = Math.min((reviewCount / maxReviews) * 100, 100);
    let clr;
    if (pct >= 80) clr = "red";
    else if (pct >= 60) clr = "yellow";
    else clr = "green";
    return { percentage: pct, color: clr };
  }, [reviewCount]);

  const getColorClasses = (color) => {
    switch (color) {
      case "red":
        return {
          bg: "bg-red-500/20",
          border: "border-red-500/50",
          text: "text-red-400",
          glow: "shadow-red-500/20",
          barBg: "bg-red-500",
        };
      case "yellow":
        return {
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/50",
          text: "text-yellow-400",
          glow: "shadow-yellow-500/20",
          barBg: "bg-yellow-500",
        };
      case "green":
        return {
          bg: "bg-green-500/20",
          border: "border-green-500/50",
          text: "text-green-400",
          glow: "shadow-green-500/20",
          barBg: "bg-green-500",
        };
      default:
        return {
          bg: "bg-white/10",
          border: "border-white/20",
          text: "text-white",
          glow: "shadow-white/10",
          barBg: "bg-white/50",
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <div
      className={`group relative p-3 rounded-xl border ${colors.border} ${colors.bg} text-white 
        flex flex-col items-center justify-center transition-all duration-300 ease-out 
        hover:scale-110 hover:-translate-y-1 hover:shadow-xl ${colors.glow}
        backdrop-blur-md cursor-default`}
      title={t("usage.reviewUsage")}
    >
      <FaChartLine size={20} className={colors.text} />

      <div className={`text-sm font-bold mt-1 ${colors.text}`}>
        {percentage.toFixed(0)}%
      </div>

      <div className="text-xs text-white/60 mt-0.5">
        {reviewCount}/{maxReviews}
      </div>

      <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
        <div
          className={`h-full ${colors.barBg} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div
        className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 
        bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap
        opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50
        shadow-xl border border-white/10"
      >
        <div className="font-semibold mb-1">{t("usage.reviewUsage")}</div>
        <div className="text-white/80">
          {t("usage.created")}: {reviewCount} / {maxReviews}
        </div>
        <div className="text-white/80">
          {t("usage.usage")}: {percentage.toFixed(1)}%
        </div>
        {percentage >= 90 && (
          <div className="text-red-400 mt-1 font-medium">
            ⚠️ {t("usage.nearLimit")}
          </div>
        )}
      </div>
    </div>
  );
}

export default UsageIndicatorPlus;
