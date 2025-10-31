import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { PetHome } from "../Pet/PetHome";
import { SectionsHome } from "../SectionsHome";
import UserHome from "../UserHome";
import VerticalNavbar from "../VerticalNavbar.jsx";

function DesktopLayout() {
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
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
        <SectionsHome />
      </section>

      {/* Vertical navbar - appears when main panel is hidden */}
      <VerticalNavbar isVisible={!isPanelVisible} onTogglePanel={togglePanel} />
    </main>
  );
}

export default DesktopLayout;
