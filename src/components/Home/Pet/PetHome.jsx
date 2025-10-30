/* eslint-disable no-unused-vars */

import { motion } from "framer-motion";
import { useState } from "react";
import { MdPets } from "react-icons/md";
import backGround from "../../../assets/imgs/bg1.png";
import { Loader } from "../../ui/Loader.jsx";
import { PetBackground } from "./PetBackground";
import { PetHeaderHome } from "./PetHeaderHome";
import PetStatusPanel from "./PetStatusPanel";
import { PetViewer } from "./PetViewer";
function PetHome({
  petType = "cat",
  autoActions = true,
  onPetActionComplete = () => {},
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);

  const toggleCollapse = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setIsLoading(true);
      setShowContent(false);

      setTimeout(() => {
        setIsLoading(true);
      }, 100);

      setTimeout(() => {
        setIsLoading(false);
        setShowContent(true);
      }, 900);
    } else {
      setIsLoading(false);
      setShowContent(false);
      setIsCollapsed(true);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, height: isCollapsed ? 0 : "300px" }}
      animate={{ opacity: 1, height: isCollapsed ? 75 : "300px" }}
      transition={{
        duration: 0.9,
        type: "spring",
      }}
      className={`
        select-none w-[360px] h-[300px] rounded-3xl border border-white/10 
        text-white shadow-[0_20px_80px_rgba(0,0,0,.6)] 
        backdrop-blur-sm transition-all duration-900 ease-out overflow-hidden 
        relative
      `}
    >
      {isCollapsed ? (
        <div
          className="h-full w-full flex items-center justify-center cursor-pointer"
          onClick={toggleCollapse}
        >
          <div className="text-white text-sm font-medium flex flex-row items-center justify-center space-x-2">
            <p>My Pet</p>
            <MdPets size={18} />
          </div>
        </div>
      ) : (
        <div className="relative">
          {isLoading ? (
            <Loader
              icon={<MdPets size={20} />}
              className="h-[300px]"
              size={48}
              iconSize={20}
            />
          ) : (
            showContent && (
              <div className="animate-slide-up-fade-in flex flex-col h-[300px] w-full relative">
                {/* Header con botón de colapso */}
                <PetHeaderHome
                  onCollapse={toggleCollapse}
                  title="My Pet"
                  className="animate-delay-75"
                />

                {/* Contenido principal centrado */}
                <div className="animate-delay-150 flex-1 flex flex-col items-center justify-center px-5">
                  {/* Panel de estado centrado arriba */}
                  <div className="animate-delay-225 ">
                    <PetStatusPanel hunger={35} happiness={90} />
                  </div>

                  {/* Mascota centrada con título */}
                  <div className="animate-delay-300 flex-1 flex flex-col items-center justify-center w-full">
                    <PetBackground backgroundImage={backGround}>
                      <PetViewer
                        petType={petType}
                        className={` ${
                          petType !== "main" ? "h-[120px]" : "h-[150px]"
                        } w-auto saturate-[1.2] 
                        drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]
                        transition-transform duration-300 hover:scale-105`}
                        autoActions={autoActions}
                        onActionComplete={onPetActionComplete}
                        actionInterval={8000}
                      />
                    </PetBackground>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up-fade-in {
          animation: slide-up-fade-in 0.6s ease-out;
        }

        .animate-delay-75 {
          animation-delay: 75ms;
        }

        .animate-delay-150 {
          animation-delay: 150ms;
        }

        .animate-delay-225 {
          animation-delay: 225ms;
        }

        .animate-delay-300 {
          animation-delay: 300ms;
        }

        .animate-delay-375 {
          animation-delay: 375ms;
        }

        .animate-delay-450 {
          animation-delay: 450ms;
        }
      `}</style>
    </motion.section>
  );
}

export { PetHome };
