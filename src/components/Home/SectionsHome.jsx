import BentoSectionsHome from "./BentoSectionsHome.jsx";
function SectionsHome() {
  return (
    <div
      className={`
        w-full h-full max-h-[600px] rounded-3xl border border-white/10 
         text-white shadow-[0_20px_80px_rgba(0,0,0,.6)] 
        backdrop-blur-sm transition-all duration-900 ease-out overflow-hidden 
        relative justify-self-center
      `}
    >
      <BentoSectionsHome />
    </div>
  );
}

export { SectionsHome };
