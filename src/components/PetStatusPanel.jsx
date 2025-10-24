import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * PetStatusPanel
 * Muestra dos barras de estado: Hambre y Felicidad.
 * Props:
 *  - hunger: number (0-100)
 *  - happiness: number (0-100)
 */
export default function PetStatusPanel({
  hunger = 95.0035,
  happiness = 4.9965,
}) {
  const values = useMemo(
    () => ({
      hunger: clampPct(hunger),
      happiness: clampPct(happiness),
    }),
    [hunger, happiness]
  );

  return (
    <section
      className="w-full max-w-xl mx-auto p-5 md:p-6 rounded-3xl relative overflow-hidden
                 bg-gradient-to-br from-[#040400] via-[#0f172a] to-black border border-white/10 
                 shadow-2xl shadow-black/50"
    >
      {/* Halo de marca */}
      <div
        className="pointer-events-none absolute -inset-24 opacity-20 blur-3xl"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, #040400, #2f485c, #b5412a, #040400)",
        }}
      />

      <header className="relative z-10 mb-4 flex items-center justify-between">
        <h2 className="text-base md:text-lg font-semibold tracking-tight text-white/90">
          Estado de Mascota
        </h2>
        <div className="text-[10px] md:text-xs text-white/50 select-none">
          Dark • Gradient Brand
        </div>
      </header>

      <div className="relative z-10 space-y-4">
        <StatusBar
          label="Hambre"
          value={values.hunger}
          barGradient="from-[#b5412a] via-[#2f485c] to-[#040400]"
          trackGradient="from-white/10 via-white/5 to-transparent"
        />
        <StatusBar
          label="Felicidad"
          value={values.happiness}
          barGradient="from-[#2f485c] via-[#b5412a] to-[#2f485c]"
          trackGradient="from-white/10 via-white/5 to-transparent"
        />
      </div>
    </section>
  );
}

function StatusBar({ label, value, barGradient, trackGradient }) {
  const pct = Math.round(value * 100) / 100; // dos decimales

  return (
    <div className="grid grid-cols-[90px_1fr_56px] items-center gap-3">
      {/* Etiqueta */}
      <div className="text-xs md:text-sm text-white/70 uppercase tracking-wide">
        {label}
      </div>

      {/* Track */}
      <div className="relative h-4 md:h-5 rounded-full overflow-hidden border border-white/10 bg-black/40">
        {/* Textura animada del track para mostrar recorrido */}
        <motion.div
          aria-hidden
          initial={{ backgroundPositionX: 0 }}
          animate={{ backgroundPositionX: 48 }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0 8px, transparent 8px 16px)",
            backgroundSize: "48px 100%",
          }}
        />

        {/* Relleno animado */}
        <motion.div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} shadow-[0_0_24px_rgba(181,65,42,0.35)]`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glow de frente que recorre todo el trayecto */}
          <motion.span
            aria-hidden
            className="block h-full w-10 md:w-12 rounded-full bg-white/25 mix-blend-overlay"
            initial={{ x: 0, opacity: 0.0 }}
            animate={{ x: `calc(${pct}% - 2.5rem)`, opacity: 0.9 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        {/* Borde de marca sutil */}
        <div
          className={`absolute inset-0 rounded-full pointer-events-none ring-1 ring-white/10`}
        />
      </div>

      {/* Porcentaje */}
      <div className="text-right tabular-nums text-xs md:text-sm text-white/80">
        {pct.toFixed(1)}%
      </div>
    </div>
  );
}

function clampPct(n) {
  const v = Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(100, v));
}
