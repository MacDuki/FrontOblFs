import { useState } from "react";
import DarkVeil from "../Effects/DarkVeil.effect.jsx";
import MobileNavigation from "../Mobile/MobileNavigation.jsx";
import DesktopLayout from "./layout/DesktopLayout.jsx";

function Home() {
  const [tab, setTab] = useState("home"); // 'home' | 'sections'

  return (
    <>
      <DarkVeil speed={1.2} hueShift={221} />
      <MobileNavigation tab={tab} setTab={setTab} />
      <DesktopLayout />
    </>
  );
}

export default Home;
