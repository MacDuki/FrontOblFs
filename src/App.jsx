import { useState } from "react";
import { Provider } from "react-redux";
import DiscoverBooks from "./components/Books/DiscoverBooks/DiscoverBooks.jsx";
import Home from "./components/Home/Home.jsx";
import { store } from "./store/store.js";

function App() {
  const [currentSection, setCurrentSection] = useState("home");

  const sections = {
    home: { component: <Home />, title: "Home" },
    books: { component: <DiscoverBooks />, title: "Discover Books" },
  };

  const toggleSection = () => {
    setCurrentSection((prev) => (prev === "home" ? "books" : "home"));
  };

  return (
    <Provider store={store}>
      <div className="">
        {/* Botón de navegación */}
        <button
          onClick={toggleSection}
          className="section-toggle-btn"
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
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
          Ir a {currentSection === "home" ? "Books" : "Home"}
        </button>

        {/* Renderizar solo la sección actual */}
        <div className="">{sections[currentSection].component}</div>
      </div>
    </Provider>
  );
}

export default App;
