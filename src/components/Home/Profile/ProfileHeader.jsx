import { Crown } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { BiHide } from "react-icons/bi";
import LanguageSwitcher from "../../LanguageSwitcher";

// ✅ OPTIMIZADO: React.memo evita re-renders cuando las props no cambian
export const ProfileHeader = memo(function ProfileHeader({
  onHide,
  onUpgradePlan,
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-5 py-2">
      <div
        className="group flex items-center gap-2 text-white/80 cursor-pointer transition hover:text-white hover:scale-105"
        onClick={onHide}
      >
        <BiHide />
        <span className="text-sm opacity-0 transform translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          {t("profile.hide")}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <div
          className="group flex items-center gap-2 text-amber-400/90 cursor-pointer transition hover:text-amber-300 hover:scale-105"
          onClick={onUpgradePlan}
        >
          <span className="text-sm opacity-0 transform translate-x-[10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            {t("profile.changePlan")}
          </span>
          <Crown size={20} />
        </div>
      </div>
    </div>
  );
});

ProfileHeader.displayName = "ProfileHeader";
