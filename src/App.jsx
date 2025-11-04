import { useState } from "react";
import { Provider } from "react-redux";
import { useTranslation } from "react-i18next";
import DiscoverBooks from "./components/Books/DiscoverBooks/DiscoverBooks.jsx";
import Home from "./components/Home/Home.jsx";
import LanguageSwitcher from "./components/LanguageSwitcher.jsx";
import { store } from "./store/store.js";

function AppContent() {
  const { t } = useTranslation();
  const [currentSection, setCurrentSection] = useState("home");

  const sections = {
    home: { component: <Home />, title: t('common.home') },
    books: { component: <DiscoverBooks />, title: t('books.discover') },
  };

  const toggleSection = () => {
    setCurrentSection((prev) => (prev === "home" ? "books" : "home"));
  };

  return (
    <div className="">
      <LanguageSwitcher />
        <button
          onClick={toggleSection}
          className="section-toggle-btn"
          style={{
            position: "fixed",
            top: "20px",
            right: "100px",
            zIndex: 1000,
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          {t('common.goTo')} {currentSection === "home" ? t('books.title') : t('common.home')}
        </button>

      <div className="">{sections[currentSection].component}</div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
