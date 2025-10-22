import { BiHide } from "react-icons/bi";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

export const ProfileHeader = ({ onHide }) => (
  <div className="flex items-center justify-between px-5 py-4">
    <div
      className="group flex items-center gap-2 text-white/80 cursor-pointer transition hover:text-white hover:scale-105"
      onClick={onHide}
    >
      <BiHide />
      <span className="text-sm opacity-0 transform translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        Hide
      </span>
    </div>
    <div className="group flex items-center gap-2 text-white/70 cursor-pointer transition hover:text-white hover:scale-105">
      <span className="text-sm opacity-0 transform translate-x-[10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        Settings
      </span>
      <HiOutlineAdjustmentsHorizontal size={24} />
    </div>
  </div>
);
