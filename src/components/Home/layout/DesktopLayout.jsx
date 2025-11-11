import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ReviewsList from "../ReviewsList";
import { PetHome } from "../Pet/PetHome";
import { SectionsHome } from "../SectionsHome";
import UserHome from "../UserHome";
import VerticalNavbar from "../VerticalNavbar.jsx";

function DesktopLayout({ tab, setTab }) {
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  // Renderizar contenido según el tab activo
  const renderMainContent = () => {
    switch (tab) {
      case "reviews":
        return (
          <div className="h-full max-h-[600px] bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 flex flex-col overflow-hidden">
            <h2 className="text-2xl font-bold text-white mb-4 flex-shrink-0">My Reviews</h2>
            <div className="flex-1 overflow-hidden">
              <ReviewsList />
            </div>
          </div>
        );
      case "sections":
        return <SectionsHome />;
      default:
        return <SectionsHome />;
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

      {/* Vertical navbar - appears when main panel is hidden */}
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
