import { motion } from "framer-motion";
import SearchBar from "./SearchBar.jsx";

export default function DiscoverBooksHeader() {
  return (
    <motion.div
      className="bg-black/20 backdrop-blur-sm rounded-4xl p-6 mb-8 border border-white/10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.h1
        className="font-['Relieve'] text-center text-3xl md:text-5xl mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        Discover Books
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SearchBar />
      </motion.div>
    </motion.div>
  );
}
