import { useState } from "react";
import DarkVeil from "./components/effects/DarkVeil.effect.jsx";
import DesktopLayout from "./components/Home/layout/DesktopLayout.jsx";
import MobileNavigation from "./components/navigation/MobileNavigation";

function App() {
  const [tab, setTab] = useState("home"); // 'home' | 'sections'

  return (
    <>
      <DarkVeil />
      <MobileNavigation tab={tab} setTab={setTab} />
      <DesktopLayout />
    </>
  );
}

export default App;
