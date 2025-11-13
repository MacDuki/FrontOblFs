import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdPets } from "react-icons/md";
import backGround from "../../../assets/imgs/bg1.png";
import usePet from "../../../hooks/usePet";
import { Loader } from "../../ui/Loader.jsx";
import { PetBackground } from "./PetBackground";
import { PetHeaderHome } from "./PetHeaderHome";
import PetSelectorModal from "./PetSelectorModal";
import PetStatusPanel from "./PetStatusPanel";
import { PetViewer } from "./PetViewer";

function PetHome({
  petType = "cat",
  autoActions = true,
  onPetActionComplete = () => {},
}) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAnimatingExpand, setIsAnimatingExpand] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const {
    hunger,
    happiness,
    loading,
    error,
    loadSelectedPet,
    loadAllPets,
    recalc,
    selectPet,
    refreshAll,
    clearError,
    pets,
    selectedPet,
  } = usePet();

  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    // Cargar la mascota seleccionada solo en la carga inicial
    if (!hasLoadedOnce && selectedPet) {
      setHasLoadedOnce(true);
    }
  }, [selectedPet, hasLoadedOnce]);

  useEffect(() => {
    // Cargar la mascota seleccionada al montar el componente
    if (!hasLoadedOnce) {
      loadSelectedPet();
    }
  }, [loadSelectedPet, hasLoadedOnce]);

  useEffect(() => {
    // Sincronizar el selector con la mascota seleccionada cuando cambie
    if (selectedPet?._id) setSelectedId(selectedPet._id);
  }, [selectedPet]);

  // Auto-actualización periódica de hambre/felicidad (recalc) sin recargar
  useEffect(() => {
    if (!autoActions) return;
    if (!selectedPet?._id) return;
    const intervalMs = 10000; // cada 10s por defecto
    const id = setInterval(() => {
      recalc();
    }, intervalMs);
    return () => clearInterval(id);
  }, [autoActions, selectedPet?._id, recalc]);

  const toggleCollapse = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setIsAnimatingExpand(true);

      setTimeout(() => {
        setIsAnimatingExpand(false);
      }, 900);
    } else {
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
            <p>{t("pet.myPet")}</p>
            <MdPets size={18} />
          </div>
        </div>
      ) : (
        <div className="relative">
          {loading && !hasLoadedOnce ? (
            <Loader
              icon={<MdPets size={20} />}
              className="h-[300px]"
              size={48}
              iconSize={20}
            />
          ) : (
            <div className="animate-slide-up-fade-in flex flex-col h-[300px] w-full relative">
              <PetHeaderHome
                onCollapse={toggleCollapse}
                title={t("pet.myPet")}
                className="animate-delay-75"
                onOpenModal={() => setIsModalOpen(true)}
              />

              <div className="animate-delay-150 flex-1 flex flex-col items-center justify-center px-5">
                <div className="animate-delay-225 ">
                  <PetStatusPanel
                    hunger={hunger ?? 0}
                    happiness={happiness ?? 0}
                  />
                </div>

                <div className="animate-delay-300 flex-1 flex flex-col items-center justify-center w-full">
                  <PetBackground backgroundImage={backGround}>
                    <PetViewer
                      className={` ${
                        petType !== "main" ? "h-[120px]" : "h-[150px]"
                      } w-auto saturate-[1.2] 
                      drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]
                      transition-transform duration-300 hover:scale-105`}
                    />
                  </PetBackground>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <PetSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onActionComplete={onPetActionComplete}
      />

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
