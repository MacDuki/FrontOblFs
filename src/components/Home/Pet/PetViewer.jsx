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

  // Construir la ruta correcta usando import.meta.url para que funcione en producción
  const getPetImageUrl = (petId) => {
    try {
      return new URL(`../../../assets/pets/${petId}-idle.gif`, import.meta.url)
        .href;
    } catch (error) {
      console.error(`Error loading pet image for ${petId}:`, error);
      return "";
    }
  };

  return (
    <div className="relative group">
      <img
        src={getPetImageUrl(id)}
        alt="Pet"
        className={`object-contain transition-all duration-300 ${className}`}
        onError={(e) => {
          console.error(`Failed to load pet image: ${id}`);
          e.target.style.display = "none";
        }}
      />
    </div>
  );
}

export { PetViewer };
