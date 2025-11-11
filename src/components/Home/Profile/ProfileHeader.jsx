import { BiHide } from "react-icons/bi";
import { Crown } from "lucide-react";

export const ProfileHeader = ({ onHide, onUpgradePlan }) => (
  <div className="flex items-center justify-between px-5 py-2">
    <div
      className="group flex items-center gap-2 text-white/80 cursor-pointer transition hover:text-white hover:scale-105"
      onClick={onHide}
    >
      <BiHide />
      <span className="text-sm opacity-0 transform translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        Hide
      </span>
    </div>
    <div 
      className="group flex items-center gap-2 text-amber-400/90 cursor-pointer transition hover:text-amber-300 hover:scale-105"
      onClick={onUpgradePlan}
    >
      <span className="text-sm opacity-0 transform translate-x-[10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        Change Plan
      </span>
      <Crown size={20} />
    </div>
  </div>
);
