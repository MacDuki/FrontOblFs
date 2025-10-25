import { useCallback, useEffect, useState } from "react";
import { PET_CONFIGS } from "./petConfig.js";

function PetViewer({
  petType = "cat",
  className = "",
  onActionComplete = () => {},
  autoActions = false,
  actionInterval = 10000, // intervalo entre acciones automáticas
}) {
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const [animationSrc, setAnimationSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const petConfig = PET_CONFIGS[petType];

  // Cargar animación
  const loadAnimation = useCallback(
    async (animationType) => {
      setIsLoading(true);
      try {
        let animationData;

        if (animationType === "idle") {
          animationData = petConfig.idle;
        } else {
          animationData = petConfig.actions.find(
            (action) => action.title === animationType
          );
        }

        if (animationData) {
          const module = await animationData.src();
          setAnimationSrc(module.default);
        }
      } catch (error) {
        console.error("Error loading animation:", error);
        // Fallback a idle si hay error
        if (animationType !== "idle") {
          loadAnimation("idle");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    },
    [petConfig]
  );

  // Ejecutar acción específica
  const performAction = useCallback(
    (actionTitle) => {
      const action = petConfig.actions.find((a) => a.title === actionTitle);
      if (!action) return;

      setCurrentAnimation(actionTitle);
      loadAnimation(actionTitle);

      // Volver a idle después de la duración de la acción
      setTimeout(() => {
        setCurrentAnimation("idle");
        loadAnimation("idle");
        onActionComplete(actionTitle);
      }, action.duration || 3000);
    },
    [petConfig.actions, loadAnimation, onActionComplete]
  );

  // Ejecutar acción aleatoria
  const performRandomAction = useCallback(() => {
    if (petConfig.actions.length === 0) return;

    const randomAction =
      petConfig.actions[Math.floor(Math.random() * petConfig.actions.length)];
    performAction(randomAction.title);
  }, [petConfig.actions, performAction]);

  // Efecto para cargar animación inicial
  useEffect(() => {
    loadAnimation("idle");
  }, [petType, loadAnimation]);

  // Efecto para acciones automáticas
  useEffect(() => {
    if (!autoActions || petConfig.actions.length === 0) return;

    const interval = setInterval(() => {
      if (currentAnimation === "idle") {
        // Solo realizar acción si la mascota está en idle
        const shouldPerformAction = Math.random() > 0.7; // 30% de probabilidad
        if (shouldPerformAction) {
          performRandomAction();
        }
      }
    }, actionInterval);

    return () => clearInterval(interval);
  }, [
    autoActions,
    actionInterval,
    currentAnimation,
    petConfig.actions,
    performRandomAction,
  ]);

  // Obtener título actual
  const getCurrentTitle = () => {
    if (currentAnimation === "idle") {
      return petConfig.idle.title;
    }
    const action = petConfig.actions.find((a) => a.title === currentAnimation);
    return action?.title || petConfig.idle.title;
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-pulse bg-gray-300 rounded-lg w-full h-full"></div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <img
        src={animationSrc}
        alt={`Pet - ${getCurrentTitle()}`}
        className={`object-contain transition-all duration-300  ${className}`}
      />

      <div
        className="absolute -top-0 left-1/2 transform -translate-x-1/2 
                      bg-black/70 text-white text-xs px-2 py-1 rounded 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      pointer-events-none whitespace-nowrap"
      >
        {getCurrentTitle()}
      </div>
    </div>
  );
}

export { PetViewer };
