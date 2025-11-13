import { motion } from "framer-motion";

function TabButton({ label, icon, active, onClick }) {
  return (
    <li>
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`w-full h-16 flex flex-col items-center justify-center gap-1 
          text-xs font-medium transition-colors duration-200
          ${active ? "text-white" : "text-white/70 hover:text-white"}`}
        style={{ 
          willChange: active ? 'auto' : 'transform, opacity',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <motion.span
          animate={{ scale: active ? 1.15 : 1 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-xl leading-none"
          style={{ willChange: 'transform' }}
        >
          {icon}
        </motion.span>
        <span>{label}</span>
        <motion.span
          animate={{ 
            width: active ? 24 : 0,
            opacity: active ? 0.9 : 0
          }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-1 block h-0.5 rounded-full bg-white"
          style={{ willChange: 'width, opacity' }}
        />
      </motion.button>
    </li>
  );
}

export default TabButton;
