import { useTranslation } from "react-i18next";
import { IconBolt, IconCoin, IconStar } from "../../icons";
import { Chip } from "../../ui";

export const ProfileStats = ({ streakDays, currentBadge, totalCoins }) => {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-3 gap-3 px-6 pt-4">
      <Chip icon={<IconBolt />} label={t('profile.streak')} value={streakDays} />
      <Chip icon={<IconStar />} label={t('profile.badge')} value={currentBadge} />
      <Chip icon={<IconCoin />} label={t('profile.coins')} value={totalCoins} />
    </div>
  );
};
