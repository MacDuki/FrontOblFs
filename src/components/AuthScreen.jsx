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
           py-3 px-4 border border-gray-200 
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
          border border-gray-200 
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
      </div>
    </section>
  );
}

export { AuthScreen };
