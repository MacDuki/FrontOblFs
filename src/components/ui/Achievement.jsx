export const Achievement = ({
  icon,
  title,
  subtitle,
  value,
  total,
  barColor = "from-sky-400 via-indigo-400 to-fuchsia-400",
}) => {
  const pct = Math.round((value / total) * 100);
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/10 grid place-items-center text-sky-300">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-white">{title}</p>
          <p className="text-[11px] text-white/60">{subtitle}</p>
        </div>
        <span className="text-[11px] text-white/70">
          {value}/{total}
        </span>
      </div>
      <div className="mt-3 w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
