import { motion } from "framer-motion";
import BooksGrid from "./BooksGrid";

export default function CategorySection({
  category,
  books,
  index,
  onOpenCollection,
  onOpenReviews,
}) {
  return (
    <motion.div
      key={category}
      layout
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.3,
          delay: index * 0.1,
          ease: "easeOut",
        },
      }}
      exit={{
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: {
          duration: 0.3,
          ease: "easeIn",
        },
      }}
      className="bg-transparent backdrop-blur-sm rounded-4xl p-6 mb-12"
    >
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <motion.h2
          className="text-2xl font-semibold text-black/80"
          initial={{ opacity: 0, x: -20 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { delay: index * 0.1 + 0.1 },
          }}
        >
          {category}
        </motion.h2>
        <motion.button
          className="cursor-pointer text-sm text-black/90"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          See More
        </motion.button>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: index * 0.1 + 0.2 },
        }}
      >
        <BooksGrid
          books={books}
          onOpenCollection={onOpenCollection}
          onOpenReviews={onOpenReviews}
        />
      </motion.div>
    </motion.div>
  );
}
