function TabButton({ label, icon, active, onClick }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`w-full h-16 flex flex-col items-center justify-center gap-1 
          text-xs font-medium transition
          ${active ? "text-white" : "text-white/70 hover:text-white"}`}
      >
        <span
          className={`text-xl leading-none ${
            active ? "scale-110" : "scale-100"
          } transition-transform`}
        >
          {icon}
        </span>
        <span>{label}</span>
        <span
          className={`mt-1 block h-0.5 w-6 rounded-full transition 
          ${active ? "bg-white/90" : "bg-transparent"}`}
        />
      </button>
    </li>
  );
}

export default TabButton;
