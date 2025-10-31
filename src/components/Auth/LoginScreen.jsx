import { useState } from "react";
import { CiLogin } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import readingImg from "../../assets/imgs/undraw_reading-time.svg";
import { useAuth } from "../../hooks/useAuth.js";
import MechanicalText from "../Effects/MechanicalText.effect.jsx";
import "../styles/login.css";
function LoginScreen({ onBack }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Solo limpiar error si el usuario ha cambiado significativamente los datos
    // No limpiar inmediatamente para que pueda leer el mensaje
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;

    // Limpiar error anterior antes de intentar login
    if (error) clearError();

    await login({ ...formData, rememberMe });
  };

  return (
    <section className="h-auto">
      <div className="flex flex-col items-start space-y-3 justify-center ">
        <div className="">
          <IoIosArrowBack
            className="cursor-pointer text-3xl  transition hover:scale-110"
            onClick={onBack}
          />
        </div>
        <div className=" min-w-[236px] w-full flex flex-col items-center justify-center text-nowrap">
          <img src={readingImg} alt="Reading" className="w-auto h-30" />

          <MechanicalText text="We are glad to see you again!" />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-300 text-sm flex justify-between items-center">
          <span>{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="ml-2 text-red-300 hover:text-red-100 transition-colors"
            title="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* INPUTS */}
        <div className="rounded-xl  space-y-4">
          <div className="form-control">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <label>
              <span style={{ transitionDelay: "0ms" }}>U</span>
              <span style={{ transitionDelay: "50ms" }}>s</span>
              <span style={{ transitionDelay: "100ms" }}>e</span>
              <span style={{ transitionDelay: "150ms" }}>r</span>
              <span style={{ transitionDelay: "200ms" }}>n</span>
              <span style={{ transitionDelay: "250ms" }}>a</span>
              <span style={{ transitionDelay: "300ms" }}>m</span>
              <span style={{ transitionDelay: "350ms" }}>e</span>
            </label>
          </div>
          <div>
            <div className="form-control">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label>
                <span style={{ transitionDelay: "0ms" }}>P</span>
                <span style={{ transitionDelay: "50ms" }}>a</span>
                <span style={{ transitionDelay: "100ms" }}>s</span>
                <span style={{ transitionDelay: "150ms" }}>s</span>
                <span style={{ transitionDelay: "200ms" }}>w</span>
                <span style={{ transitionDelay: "250ms" }}>o</span>
                <span style={{ transitionDelay: "300ms" }}>r</span>
                <span style={{ transitionDelay: "350ms" }}>d</span>
              </label>
            </div>
          </div>
        </div>
        {/* OPTIONS */}
        <div className="flex flex-col items-start space-y-2 justify-between">
          <div className="flex items-center">
            <div className="container">
              <input
                type="checkbox"
                id="cbx"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ display: "none" }}
              />
              <label htmlFor="cbx" className="check">
                <svg width="18px" height="18px" viewBox="0 0 18 18">
                  <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                  <polyline points="1 9 7 14 15 4"></polyline>
                </svg>
              </label>
            </div>

            <label
              htmlFor="cbx"
              className="text-nowrap cursor-pointer ml-2 text-sm text-gray-100 transition hover:scale-105"
            >
              Remember me
            </label>
          </div>

          <a href="#" className="text-sm mt-2  transition  hover:scale-105">
            Forgot your password?
          </a>
        </div>
        {/* BUTTON */}
        <div>
          <button
            type="submit"
            disabled={isLoading || !formData.username || !formData.password}
            className="
                cursor-pointer
                 w-full flex justify-center 
                 py-3 px-4 border border-pink-200 
                 text-sm font-medium 
                 rounded-xl text-white 
                 bg-transparent 
                 transition
                  duration-100
                  ease-in-out
                 hover:scale-105
                 mb-1
                 
                 items-center 
                 
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                 
                "
          >
            {isLoading ? "Logging in..." : "Log in"}
            {!isLoading && <CiLogin className="ml-2" size={20} />}
          </button>
        </div>
      </form>
    </section>
  );
}

export { LoginScreen };
