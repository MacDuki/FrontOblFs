import { useForm } from "react-hook-form";
import { CiLogin } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { useTranslation } from "react-i18next";
import readingImg from "../../assets/imgs/undraw_reading-time.svg";
import { useAuth } from "../../hooks/useAuth.js";
import MechanicalText from "../Effects/MechanicalText.effect.jsx";
import "../styles/login.css";

function LoginScreen({ onBack }) {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    }
  });
  
  const { login, isLoading, error, clearError } = useAuth();

  const onSubmit = async (data) => {
    if (error) clearError();
    await login(data);
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

          <MechanicalText text={t('auth.welcomeBack')} />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border-2 border-red-400 rounded-xl text-red-100 text-sm shadow-lg backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <span className="text-red-400 text-xl flex-shrink-0">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold mb-1">Error de autenticación</p>
              <p className="text-red-200">{error}</p>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="ml-2 p-1 text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-lg transition-all flex-shrink-0"
              title={t('auth.dismissError')}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* INPUTS */}
        <div className="rounded-xl  space-y-4">
          <div className="form-control">
            <input
              type="text"
              {...register("username", { required: true })}
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
                {...register("password", { required: true })}
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
                {...register("rememberMe")}
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
              {t('auth.rememberMe')}
            </label>
          </div>

          <a href="#" className="text-sm mt-2  transition  hover:scale-105">
            {t('auth.forgotPassword')}
          </a>
        </div>
        {/* BUTTON */}
        <div>
          <button
            type="submit"
            disabled={isLoading || !isValid}
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
            {isLoading ? t('common.loading') : t('auth.login')}
            {!isLoading && <CiLogin className="ml-2" size={20} />}
          </button>
        </div>
      </form>
    </section>
  );
}

export { LoginScreen };
