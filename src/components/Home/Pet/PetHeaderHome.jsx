import { BiHide } from "react-icons/bi";
import { MdPets } from "react-icons/md";

export const PetHeaderHome = ({
  onCollapse,
  title = "My Pet",
  className = "",
  onOpenModal,
}) => {
  return (
    <div className={`w-full relative px-5 py-3 ${className}`}>
      {/* Left: collapse */}
      <div
        className="absolute left-5 top-1/2 -translate-y-1/2 group flex items-center gap-2 text-white/80 cursor-pointer transition hover:text-white hover:scale-105"
        onClick={onCollapse}
      >
        <BiHide />
        <span className="text-xs opacity-0 transform translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          Hide
        </span>
      </div>

      {/* Center: title */}
      <div className="pointer-events-none text-white/70 text-sm font-medium text-center">
        {title}
      </div>

      {/* Right: manage button */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={onOpenModal}
          className="flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-lg border border-white/10 text-white/80 hover:text-white hover:bg-white/5 transition active:scale-95"
        >
          <MdPets size={14} />
          Manage
        </button>
      </div>
    </div>
  );
};
