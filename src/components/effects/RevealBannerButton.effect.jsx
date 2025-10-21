import { motion } from "framer-motion";

export default function RevealBannerButton({
  banner,
  label = "Continue journey",
  className = "",
}) {
  return (
    <motion.button
      className={
        "group relative inline-flex h-14 items-center justify-center rounded-2xl px-6 " +
        "bg-[#0b0b0b] text-white font-semibold overflow-hidden transition " +
        "hover:scale-[1.02] cursor-pointer border-none" +
        className
      }
      whileHover={{ scale: 1.02 }}
    >
      <span className="relative z-10 transition-opacity duration-300 group-hover:opacity-0">
        {label}
      </span>

      {/* Revelado por hover del botón */}
      <img
        src={banner}
        alt=""
        className="
          pointer-events-none absolute inset-0 h-full w-full object-cover
          opacity-0 [clip-path:inset(0_50%_0_50%)]
          transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:opacity-100 group-hover:[clip-path:inset(0_0%_0_0%)]
        "
      />

      <span className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent pointer-events-none" />
      <span className="absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] pointer-events-none" />
    </motion.button>
  );
}
