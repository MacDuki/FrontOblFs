import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllPets, fetchSelectedPet } from "../../features/pet.slice";
import DarkVeil from "../Effects/DarkVeil.effect.jsx";
import MobileNavigation from "../Mobile/MobileNavigation.jsx";
import DesktopLayout from "./layout/DesktopLayout.jsx";

function Home() {
  const [tab, setTab] = useState("home"); // 'home' | 'sections' | 'reviews'
  const dispatch = useDispatch();

  // ✅ SYNC AUTOMÁTICO: La mascota se actualiza automáticamente cuando hay cambios
  // Solo necesitamos cargar una vez al iniciar
  useEffect(() => {
    console.log("🏠 [Home] Carga inicial de datos");
    dispatch(fetchAllPets({ background: true }));
    dispatch(fetchSelectedPet({ background: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sin dependencias - solo ejecuta una vez al montar

  return (
    <>
      <DarkVeil speed={1.2} hueShift={221} />
      <MobileNavigation tab={tab} setTab={setTab} />
      <DesktopLayout tab={tab} setTab={setTab} />
    </>
  );
}

export default Home;
