import { IconBolt, IconCoin, IconStar } from "./icons";
import { Chip } from "./ui";

export const ProfileStats = ({ streakDays, currentBadge, totalCoins }) => (
  <div className="grid grid-cols-3 gap-3 px-6 pt-4">
    <Chip icon={<IconBolt />} label="Streak Days" value={streakDays} />
    <Chip icon={<IconStar />} label="Current Badge" value={currentBadge} />
    <Chip icon={<IconCoin />} label="RP" value={totalCoins} />
  </div>
);
