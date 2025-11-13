import { AnimatePresence, motion } from "framer-motion";
import { MyCollections } from "../Home/MyCollections";
import { PetHome } from "../Home/Pet/PetHome";
import ReviewsList from "../Home/ReviewsList";
import UserHome from "../Home/UserHome";
import TabButton from "./TabButton";

function MobileNavigation({ tab, setTab }) {
  const renderContent = () => {
    const content = {
      home: (
        <div className="flex flex-col gap-4">
          <UserHome />
          <PetHome />
        </div>
      ),
      reviews: <ReviewsList />,
      sections: <MyCollections />,
    };
    return content[tab] || content.home;
  };

  return (
    <div className="lg:hidden min-h-screen w-full flex items-center justify-center p-4 pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            duration: 0.3, 
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          style={{ 
            willChange: 'transform, opacity',
            width: '100%'
          }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navbar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 w-full">
        <div className="mx-4 mb-4 rounded-2xl border border-white/15 bg-black/70 backdrop-blur-md shadow-2xl">
          <ul className="flex items-center justify-around">
            <TabButton
              label="Home"
              icon="👤"
              active={tab === "home"}
              onClick={() => setTab("home")}
            />

            <TabButton
              label="Sections"
              icon="📚"
              active={tab === "sections"}
              onClick={() => setTab("sections")}
            />

            <TabButton
              label="Reviews"
              icon="⭐"
              active={tab === "reviews"}
              onClick={() => setTab("reviews")}
            />
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default MobileNavigation;
