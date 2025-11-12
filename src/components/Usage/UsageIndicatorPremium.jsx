import { useTranslation } from "react-i18next";
import { FaStar } from "react-icons/fa";

function UsageIndicatorPremium({ reviewCount }) {
  const { t } = useTranslation();

  const colors = {
    bg: "bg-purple-500/20",
    border: "border-purple-500/50",
    text: "text-purple-400",
    glow: "shadow-purple-500/20",
  };

  return (
    <div
      className={`group relative p-3 rounded-xl border ${colors.border} ${colors.bg} text-white 
        flex flex-col items-center justify-center transition-all duration-300 ease-out 
        hover:scale-110 hover:-translate-y-1 hover:shadow-xl ${colors.glow}
        backdrop-blur-md cursor-default`}
      title={t("usage.reviewsCreated")}
    >
      <FaStar size={20} className={colors.text} />

      <div className={`text-2xl font-bold mt-1 ${colors.text}`}>
        {reviewCount}
      </div>

      <div
        className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 
        bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap
        opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50
        shadow-xl border border-white/10"
      >
        <div className="font-semibold mb-1">{t("usage.reviewsCreated")}</div>
        <div className="text-white/80">
          {t("usage.totalReviews")}: {reviewCount}
        </div>
        <div className="text-purple-300 mt-1 text-xs">
          ✨ {t("usage.unlimitedPlan")}
        </div>
      </div>
    </div>
  );
}

export default UsageIndicatorPremium;
