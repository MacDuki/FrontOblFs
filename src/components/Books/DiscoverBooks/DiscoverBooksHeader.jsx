// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import SearchBar from "./SearchBar.jsx";

export default function DiscoverBooksHeader({ isDark = false }) {
  return (
    <motion.div
      className={`px-6 md:px-8 py-5 flex flex-col gap-4 rounded-4xl ${
        isDark
          ? "bg-black/30 backdrop-blur-xl border-b border-white/10"
          : "bg-white/70 backdrop-blur-xl border-b border-stone-200/60"
      }`}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col  md:flex-row md:items-center md:justify-between gap-4"
      >
        <h1
          className={`font-['Relieve'] tracking-tight leading-tight text-3xl md:text-4xl select-none ${
            isDark
              ? "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
              : "text-stone-900"
          }`}
        >
          Discover Books
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="w-full md:max-w-lg"
        >
          <SearchBar />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
