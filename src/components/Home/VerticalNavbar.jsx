import { CiSearch } from "react-icons/ci";
import { FaBookOpenReader, FaStar } from "react-icons/fa6";
import { GiTrophiesShelf } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { TfiStatsUp } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

function VerticalNavbar({ isVisible, onTogglePanel, currentTab, setTab }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    {
      icon: FaBookOpenReader,
      label: "Start Reading",
      color: "pink",
      key: "sections",
    },
    {
      icon: FaStar,
      label: "My Reviews",
      color: "pink",
      key: "reviews",
      onClick: () => {
        setTab("reviews");
        onTogglePanel(); // Mostrar el panel
      },
    },
    { icon: TfiStatsUp, label: "Stats", color: "blue", key: "stats" },
    {
      icon: GiTrophiesShelf,
      label: "Trophies",
      color: "yellow",
      key: "trophies",
    },
    {
      icon: CiSearch,
      label: "Search Books",
      color: "cyan",
      key: "discover",
      onClick: () => {
        setTab("discover");
        onTogglePanel(); // Abrir panel principal con DiscoverBooks
      },
    },
  ];

  return (
    <aside
      className={`fixed right-4 h-fit max-h-[600px] w-16 transition-all duration-500 ease-in-out z-20 ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-full pointer-events-none"
      }`}
    >
      <nav className="flex flex-col gap-3 p-3 rounded-2xl border border-white/10 backdrop-blur-md bg-white/5">
        {/* Toggle button to show SectionsHome */}
        <button
          onClick={() => {
            setTab("sections");
            onTogglePanel();
          }}
          className="group relative p-3 rounded-xl border border-white/10 text-white      flex items-center justify-center  overflow-hidden 
            transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-1 
            hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/30 
            backdrop-blur-md bg-white/5 border-b-2 border-b-purple-500/30"
          title="Show Sections"
        >
          <IoIosArrowBack size={24} />

          {/* Tooltip */}
          <div
            className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 
            bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          >
            Show Sections
          </div>
        </button>

        {/* Separator line */}
        <div className="h-px bg-white/10 mx-2"></div>

        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`group relative p-3 rounded-xl border border-white/10 text-white overflow-hidden 
               flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-1 
                hover:shadow-xl hover:shadow-${
                  item.color
                }-500/20 hover:border-${item.color}-500/30 
                backdrop-blur-md bg-white/5 ${
                  item.label == "Search Books" ? "cursor-pointer" : ""
                }`}
              aria-current={currentTab === item.key ? "page" : undefined}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isVisible
                  ? `slideInRight 0.5s ease-out forwards`
                  : "none",
              }}
              title={item.label}
            >
              <IconComponent size={24} />

              {/* Tooltip */}
              <div
                className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 
                bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap
                opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              >
                {item.label}
              </div>
            </button>
          );
        })}

        {/* Separator line */}
        <div className="h-px bg-white/10 mx-2"></div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="group relative p-3 rounded-xl border border-white/10 text-white overflow-hidden 
           flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-1 
            hover:shadow-xl hover:shadow-red-500/20 hover:border-red-500/30 
            backdrop-blur-md bg-white/5 cursor-pointer"
          title="Logout"
        >
          <IoLogOut size={24} />

          {/* Tooltip */}
          <div
            className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 
            bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          >
            Logout
          </div>
        </button>
      </nav>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
}

export default VerticalNavbar;
