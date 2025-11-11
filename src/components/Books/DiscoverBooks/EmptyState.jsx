// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function EmptyState({ categoryBooks }) {
  const msg =
    Object.keys(categoryBooks).length === 0
      ? "No books found."
      : "No categories selected. Use the tags above to show categories.";

  return (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="inline-flex flex-col items-center gap-4 px-8 py-10 rounded-2xl border border-stone-200/70 bg-white/70 backdrop-blur-xl shadow-sm"
      >
        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shadow-inner">
          <span className="text-2xl">📚</span>
        </div>
        <p className="text-sm md:text-base text-stone-600 font-medium max-w-md leading-relaxed">
          {msg}
        </p>
      </motion.div>
    </motion.div>
  );
}
