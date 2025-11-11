import { CiCoins1, CiStar } from "react-icons/ci";
import { MdOutlineElectricBolt } from "react-icons/md";
import { Chip } from "../../ui";

export const ProfileStats = ({ streakDays, currentBadge, totalCoins }) => (
  <div className="grid grid-cols-3 gap-3 px-6 pt-4">
    <Chip
      icon={<MdOutlineElectricBolt />}
      label="Streak Days"
      value={streakDays}
    />
    <Chip icon={<CiStar />} label="Current Badge" value={currentBadge} />
    <Chip icon={<CiCoins1 />} label="RP" value={totalCoins} />
  </div>
);
