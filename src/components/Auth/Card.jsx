// Card.jsx (JS, export default)
import { AnimatePresence, motion } from "framer-motion";

export default function Card({
  show = true,
  children,
  className = "",
  contentKey,
}) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.section
          layout
          initial={{ opacity: 0, x: 400, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -400, scale: 0.85 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.25, 0.46, 0.45, 0.94],
            layout: { duration: 0.3 }
          }}
          style={{ 
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
          className={`pt-4 rounded-3xl p-3
            bg-gradient-to-br from-white/10 via-white/5 to-transparent 
            backdrop-blur-xl border border-white/20 
            shadow-2xl shadow-black/50 
            relative overflow-hidden
            before:absolute before:inset-0 before:rounded-3xl 
            before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-black/10 
            before:p-[1px] before:-z-10
            after:absolute after:inset-[1px] after:rounded-3xl 
            after:bg-gradient-to-br after:from-[#040400]/90 after:via-[#2f485c]/20 after:to-[#b5412a]/10 
            after:-z-20 ${className}`}
        >
          <motion.div
            key={contentKey}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ 
              willChange: 'transform, opacity'
            }}
          >
            {children}
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
