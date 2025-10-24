import backGround from "../assets/imgs/bg1.png";
import { HealthBar } from "./HealthBar";
import { PetBackground } from "./PetBackground";
import { PetViewer } from "./PetViewer";
import { usePet } from "./usePet";

// Componente PetHome con hook personalizado (versión avanzada)
function PetHomeWithHook({
  initialPetType = "cat",
  initialHealth = 3,
  maxHealth = 3,
  autoActions = true,
  showControls = false, // Para mostrar controles de debug/testing
}) {
  const {
    petType,
    health,
    isAlive,
    availableActions,
    hasActions,
    changePetType,
    heal,
    damage,
    handleActionComplete,
  } = usePet(initialPetType, initialHealth, maxHealth);

  return (
    <section className="flex flex-col items-start justify-between h-[300px] w-full relative">
      <PetBackground backgroundImage={backGround}>
        <HealthBar health={health} maxHealth={maxHealth} animated={isAlive} />

        <PetViewer
          petType={petType}
          className={`h-[130px] w-auto saturate-[1.2] 
                     drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]
                     ${!isAlive ? "grayscale opacity-50" : ""}`}
          autoActions={autoActions && isAlive}
          onActionComplete={handleActionComplete}
          actionInterval={8000}
        />
      </PetBackground>

      {/* Controles de debug/testing (opcional) */}
      {showControls && (
        <div className="absolute bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => changePetType("cat")}
              className="px-2 py-1 bg-blue-500 rounded"
            >
              Cat
            </button>
            <button
              onClick={() => changePetType("main")}
              className="px-2 py-1 bg-green-500 rounded"
            >
              Main
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => damage(1)}
              className="px-2 py-1 bg-red-500 rounded"
            >
              -1 HP
            </button>
            <button onClick={heal} className="px-2 py-1 bg-green-500 rounded">
              Heal
            </button>
          </div>
          <div className="text-xs">
            <div>Pet: {petType}</div>
            <div>
              Health: {health}/{maxHealth}
            </div>
            <div>Actions: {hasActions ? availableActions.length : 0}</div>
            <div>Status: {isAlive ? "Alive" : "KO"}</div>
          </div>
        </div>
      )}
    </section>
  );
}

// Versión simple sin hook (mantiene compatibilidad)
function PetHome({
  petType = "cat",
  health = 3,
  maxHealth = 3,
  autoActions = true,
  onPetActionComplete = () => {},
}) {
  return (
    <section className="flex flex-col items-start justify-between h-[300px] w-full relative">
      <PetBackground backgroundImage={backGround}>
        <HealthBar health={health} maxHealth={maxHealth} animated={true} />

        <PetViewer
          petType={petType}
          className="h-[130px] w-auto saturate-[1.2] 
                     drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]"
          autoActions={autoActions}
          onActionComplete={onPetActionComplete}
          actionInterval={8000}
        />
      </PetBackground>
    </section>
  );
}

export { PetHome, PetHomeWithHook };
