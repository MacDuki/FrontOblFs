import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllPets, fetchSelectedPet } from "../../features/pet.slice";
import DarkVeil from "../Effects/DarkVeil.effect.jsx";
import MobileNavigation from "../Mobile/MobileNavigation.jsx";
import DesktopLayout from "./layout/DesktopLayout.jsx";

function Home() {
  const [tab, setTab] = useState("home"); // 'home' | 'sections' | 'reviews'
  const dispatch = useDispatch();

  // Pre-carga silenciosa en segundo plano al iniciar el Home
  useEffect(() => {
    dispatch(fetchAllPets({ background: true }));
    dispatch(fetchSelectedPet({ background: true }));
  }, [dispatch]);

  return (
    <>
      <DarkVeil speed={1.2} hueShift={221} />
      <MobileNavigation tab={tab} setTab={setTab} />
      <DesktopLayout tab={tab} setTab={setTab} />
    </>
  );
}

export default Home;
