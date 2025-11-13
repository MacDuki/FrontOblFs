import { memo } from "react";

export const Chip = memo(({ icon, label, value }) => (
  <div className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/5  p-1 shadow-inner ">
    <span className="text-amber-400">{icon}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-[11px] text-white/70">{label}</span>
    </div>
    <span className="text-sm font-semibold text-white">{value}</span>
  </div>
));

Chip.displayName = "Chip";
