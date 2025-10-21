import { CiLogin } from "react-icons/ci";
import BlurText from "./effects/BlurText.effect.jsx";

function AuthScreen({ onLogin, onRegister, logoW, catIdle }) {
  return (
    <section className="flex flex-col items-center justify-center w-full h-[500px]">
      {/* Header */}
      <div className="flex flex-col items-center justify-center w-full text-center mb-0">
        <div className="relative w-38">
          <img src={logoW} className="w-38 h-auto" />
          <img
            src={catIdle}
            className="w-30 h-auto absolute -bottom-[-5px] -right-[-11px]"
          />
        </div>
        <h1 className="text-[80px] font-Relieve">weRead</h1>
      </div>

      {/* Quote */}
      <div className="flex ml-14 h-36 justify-center items-center">
        <div className="flex flex-col justify-center w-[325px]">
          <div className="pb-6">
            <BlurText
              text={[
                "Education is the premise of progress.... in every society, in every family.",
              ]}
              className="h-12"
              delay={60}
            />
          </div>
          <p className="py-2 font-extrabold">Kofi Annan</p>
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col items-center w-full space-y-4">
        <button
          onClick={onLogin}
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
           
           
          "
        >
          Log in
          <CiLogin className="ml-2" size={20} />
        </button>
        <span className="m-0">Or</span>
        <button
          onClick={onRegister}
          className="
          mt-1
          cursor-pointer
          group relative w-2/3 flex 
          justify-center py-3 px-4 
          border border-pink-200 
          text-sm font-medium 
          rounded-xl text-white 
          bg-transparent 
           transition
            duration-100
            ease-in-out
           hover:scale-105
          "
        >
          Register
        </button>
        {/* <button
          class="group relative inline-flex items-center justify-center px-8 py-3 font-general font-semibold text-white bg-[#040400] rounded-xl cursor-pointer overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 shadow-2xl shadow-[#2f485c]/50"
          onClick={onLogin}
        >
          <span class="absolute inset-0 rounded-xl bg-gradient-to-b from-[#040400]/60 via-[#2f485c]/50 to-[#b5412a]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          <span class="relative z-10 flex items-center space-x-2">
            <span class=" transition-colors duration-300">Login</span>
            <svg
              class="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-[#b5412a]"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
              ></path>
            </svg>
          </span>
        </button>

        <button
          onClick={onRegister}
          class="group relative inline-flex items-center justify-center px-8 py-3 font-general font-semibold text-white bg-[#040400] rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 shadow-2xl shadow-[#b5412a]/50"
        >
          <span class="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#b5412a]/40 via-[#2f485c]/50 to-[#040400]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          <span class="relative z-10 flex items-center space-x-2">
            <span class="group-hover:text-[#b5412a] transition-colors duration-300">
              Register
            </span>
            <svg
              class="w-6 h-6 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:text-[#b5412a]"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z"
              ></path>
            </svg>
          </span>
        </button> */}
      </div>
    </section>
  );
}

export { AuthScreen };
