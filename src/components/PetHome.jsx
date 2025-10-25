/* eslint-disable no-unused-vars */

import backGround from "../assets/imgs/bg1.png";
import { PetBackground } from "./PetBackground";
import PetStatusPanel from "./PetStatusPanel";
import { PetViewer } from "./PetViewer";
function PetHome({
  petType = "cat",
  autoActions = true,
  onPetActionComplete = () => {},
}) {
  return (
    <section className="select-none flex flex-col items-end justify-between h-[300px] w-full relative">
      <PetStatusPanel hunger={60} happiness={80} />
      <PetBackground backgroundImage={backGround}>
        <PetViewer
          petType={petType}
          className={` ${
            petType !== "main" ? "h-[120px]" : "h-[150px]"
          } w-auto saturate-[1.2] 
            drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]`}
          autoActions={autoActions}
          onActionComplete={onPetActionComplete}
          actionInterval={8000}
        />
      </PetBackground>
    </section>
  );
}

export { PetHome };
