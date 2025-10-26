import { MdPets } from "react-icons/md";

export const PetHeaderHome = ({
  onCollapse,
  title = "My Pet",
  className = "",
}) => {
  return (
    <div
      className={`w-full flex items-center justify-between px-5 py-3 ${className}`}
    >
      <div
        className="group flex items-center gap-2 text-white/80 cursor-pointer transition hover:text-white hover:scale-105"
        onClick={onCollapse}
      >
        <MdPets />
        <span className="text-xs opacity-0 transform translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          Hide
        </span>
      </div>
      <div className="text-white/60 text-sm font-medium">{title}</div>
    </div>
  );
};
