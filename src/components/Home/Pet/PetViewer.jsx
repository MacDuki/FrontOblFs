import { useSelector } from "react-redux";
import {
  selectPetLoading,
  selectSelectedPet,
} from "../../../features/pet.slice";

function PetViewer({ className = "" }) {
  const loading = useSelector(selectPetLoading);
  const selectedPet = useSelector(selectSelectedPet);
  const id = selectedPet?._id || "";

  if (loading || !id) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-pulse bg-gray-300/40 rounded-lg w-full h-full" />
      </div>
    );
  }

  return (
    <div className="relative group">
      <img
        src={`/src/assets/pets/${id}-idle.gif`}
        alt="Pet"
        className={`object-contain transition-all duration-300 ${className}`}
      />
    </div>
  );
}

export { PetViewer };
