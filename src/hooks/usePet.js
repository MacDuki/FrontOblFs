import { useCallback, useState } from "react";
import {
  PET_CONFIGS,
  getPetActions,
  petHasActions,
} from "../components/Utils/petConfig.js";

/**
 * Hook personalizado para gestionar el estado y acciones de una mascota
 * @param {string} initialPetType - Tipo inicial de mascota
 * @param {number} initialHealth - Salud inicial
 * @param {number} maxHealth - Salud máxima
 */
function usePet(initialPetType = "cat", initialHealth = 3, maxHealth = 3) {
  const [petType, setPetType] = useState(initialPetType);
  const [health, setHealth] = useState(initialHealth);
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  // Cambiar tipo de mascota
  const changePetType = useCallback((newPetType) => {
    if (PET_CONFIGS[newPetType]) {
      setPetType(newPetType);
      setIsPerformingAction(false);
      setLastAction(null);
    } else {
      console.warn(`Pet type "${newPetType}" not found`);
    }
  }, []);

  // Modificar salud
  const modifyHealth = useCallback(
    (amount) => {
      setHealth((prevHealth) => {
        const newHealth = Math.max(0, Math.min(maxHealth, prevHealth + amount));
        return newHealth;
      });
    },
    [maxHealth]
  );

  // Curar completamente
  const heal = useCallback(() => {
    setHealth(maxHealth);
  }, [maxHealth]);

  // Reducir salud
  const damage = useCallback(
    (amount = 1) => {
      modifyHealth(-amount);
    },
    [modifyHealth]
  );

  // Callback cuando la mascota completa una acción
  const handleActionComplete = useCallback((actionTitle) => {
    setIsPerformingAction(false);
    setLastAction(actionTitle);
  }, []);

  // Obtener acciones disponibles para la mascota actual
  const availableActions = getPetActions(petType);
  const hasActions = petHasActions(petType);

  // Estado calculado
  const isAlive = health > 0;
  const isHealthy = health === maxHealth;
  const isInjured = health < maxHealth && health > 0;
  const healthPercentage = (health / maxHealth) * 100;

  return {
    // Estado de la mascota
    petType,
    health,
    maxHealth,
    isAlive,
    isHealthy,
    isInjured,
    healthPercentage,

    // Estado de acciones
    isPerformingAction,
    lastAction,
    availableActions,
    hasActions,

    // Métodos para modificar estado
    changePetType,
    modifyHealth,
    heal,
    damage,

    // Callbacks
    handleActionComplete,
  };
}

export { usePet };
