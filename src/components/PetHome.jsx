import backGround from "../assets/imgs/bg1.png";
import { HealthBar } from "./HealthBar";
import { PetBackground } from "./PetBackground";
import { PetViewer } from "./PetViewer";
function PetHome({
  petType = "cat",
  health = 3,
  maxHealth = 3,
  autoActions = true,
  onPetActionComplete = () => {},
}) {
  return (
    <section className=" select-none flex flex-col items-start justify-between h-[300px] w-full relative">
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

export { PetHome };
