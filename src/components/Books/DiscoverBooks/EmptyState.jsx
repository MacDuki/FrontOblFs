import { motion } from "framer-motion";

export default function EmptyState({ categoryBooks }) {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.p
        className="text-xl text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {Object.keys(categoryBooks).length === 0
          ? "No books found."
          : "No categories selected. Use the tags above to show categories."}
      </motion.p>
    </motion.div>
  );
}
