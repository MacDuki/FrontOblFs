import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useTranslation } from "react-i18next";
import DiscoverBooks from "../../Books/DiscoverBooks/DiscoverBooks.jsx";
import Stats from "../../Stats/Stats.jsx";
import { MyCollections } from "../MyCollections.jsx";
import { PetHome } from "../Pet/PetHome";
import ReviewsList from "../ReviewsList";
import UserHome from "../UserHome";
import VerticalNavbar from "../VerticalNavbar.jsx";

function DesktopLayout({ tab, setTab }) {
  const { t } = useTranslation();
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };
 const renderMainContent = () => {
    switch (tab) {
      case "reviews":
        return (
          <div className="h-full max-h-[600px] bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 flex flex-col overflow-hidden">
            <h2 className="text-2xl font-bold text-white mb-4 flex-shrink-0">
              {t('nav.myReviews')}
            </h2>
            <div className="flex-1 overflow-hidden">
              <ReviewsList />
            </div>
          </div>
        );
      case "stats":
        return (
          <div className="h-full max-h-[600px] bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 flex flex-col overflow-hidden">
            <Stats />
          </div>
        );
      case "discover":
        // Embedded DiscoverBooks (no full-screen wrapper)
        return (
          <div className="h-full max-h-[600px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            <DiscoverBooks embedded />
          </div>
        );
      case "sections":
      default:
        return <MyCollections />;
    }
  };

  return (
    <main className="hidden lg:flex flex-col h-screen gap-10 overflow-hidden items-center justify-center p-4 lg:flex-row">
      <section className="flex-1 gap-4 flex flex-col h-fit max-h-[600px] ">
        <UserHome />
        <PetHome />
      </section>

      {/* Main panel */}
      <section
        className={`flex-3 h-fit max-h-[600px] relative transition-all duration-500 ease-in-out ${
          isPanelVisible
            ? "transform translate-x-0 opacity-100"
            : "transform translate-x-full opacity-0"
        }`}
      >
        <button
          onClick={togglePanel}
          className={`absolute z-10 top-70 w-5 h-5 rounded-full cursor-pointer bg-white transition-all duration-500 ease-in-out ${
            isPanelVisible ? "left-[-12px]" : "left-[-40px]"
          }`}
        >
          {isPanelVisible ? (
            <IoIosArrowForward size={20} />
          ) : (
            <IoIosArrowBack size={20} />
          )}
        </button>
        {renderMainContent()}
      </section>

      <VerticalNavbar
        isVisible={!isPanelVisible}
        onTogglePanel={togglePanel}
        currentTab={tab}
        setTab={setTab}
      />
    </main>
  );
}

export default DesktopLayout;
