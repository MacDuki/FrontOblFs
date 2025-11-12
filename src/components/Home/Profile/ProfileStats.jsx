import { memo } from "react";
import { useTranslation } from "react-i18next";
import { CiCoins1, CiStar } from "react-icons/ci";
import { MdOutlineElectricBolt } from "react-icons/md";
import { Chip } from "../../ui";

// ✅ OPTIMIZADO: React.memo evita re-renders cuando las props no cambian
export const ProfileStats = memo(function ProfileStats({
  streakDays,
  currentBadge,
  totalCoins,
}) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-3 px-6 pt-4">
      <Chip
        icon={<MdOutlineElectricBolt />}
        label={t("profile.streakDays")}
        value={streakDays}
      />
      <Chip
        icon={<CiStar />}
        label={t("profile.currentBadge")}
        value={currentBadge}
      />
      <Chip icon={<CiCoins1 />} label="RP" value={totalCoins} />
    </div>
  );
});

ProfileStats.displayName = "ProfileStats";
