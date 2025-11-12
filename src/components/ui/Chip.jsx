import { memo } from "react";

// ✅ OPTIMIZADO: React.memo evita re-renders cuando las props no cambian
export const Chip = memo(({ icon, label, value }) => (
  <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 shadow-inner cursor-pointer transition hover:scale-105">
    <span className="text-amber-400">{icon}</span>
    <div className="flex items-baseline gap-2">
      <span className="text-[11px] text-white/70">{label}</span>
    </div>
    <span className="text-sm font-semibold text-white">{value}</span>
  </div>
));

Chip.displayName = "Chip";
