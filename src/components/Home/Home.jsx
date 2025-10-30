import { useState } from "react";
import DarkVeil from "../effects/DarkVeil.effect.jsx";
import MobileNavigation from "../navigation/MobileNavigation";
import DesktopLayout from "./layout/DesktopLayout.jsx";

function Home() {
  const [tab, setTab] = useState("home"); // 'home' | 'sections'

  return (
    <>
      <DarkVeil speed={1.8} hueShift={221} />
      <MobileNavigation tab={tab} setTab={setTab} />
      <DesktopLayout />
    </>
  );
}

export default Home;
