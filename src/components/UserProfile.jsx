import { useState } from "react";
import { ProfileAchievements } from "./ProfileAchievements";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileBadges } from "./ProfileBadges";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";

/* ---- main card ---- */
export default function UserProfile({
  name = "Mr. Explore",
  level = 12,
  streakDays = 15,
  currentBadge = "Gold",
  totalCoins = "2.6K",
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);

  const toggleCollapse = () => {
    if (isCollapsed) {
      // Expandiendo: mostrar loading primero
      setIsCollapsed(false);
      setIsLoading(true);
      setShowContent(false);

      // Después de que termine la animación de expansión, mostrar contenido
      setTimeout(() => {
        setIsLoading(false);
        setShowContent(true);
      }, 500); // Coincide con la duración de la animación
    } else {
      // Colapsando: ocultar contenido inmediatamente
      setShowContent(false);
      setIsLoading(false);
      setTimeout(() => {
        setIsCollapsed(true);
      }, 50); // Pequeño delay para que la transición sea suave
    }
  };

  return (
    <div
      className={`
        w-[360px] 
        ${isCollapsed ? "h-[50px]" : "h-auto"} 
        rounded-3xl border border-white/10 bg-slate-900/90 text-white 
        shadow-[0_20px_80px_rgba(0,0,0,.6)] backdrop-blur-xl 
        transition-all duration-500 ease-in-out overflow-hidden relative
      `}
    >
      {isCollapsed ? (
        <div
          className="h-full w-full flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors duration-300"
          onClick={toggleCollapse}
        >
          <div className="text-white/80 hover:text-white transition-colors duration-300 text-sm font-medium tracking-wider">
            Profile
          </div>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/80"></div>
            </div>
          ) : showContent ? (
            <>
              <ProfileHeader onHide={toggleCollapse} />
              <ProfileAvatar name={name} level={level} />
              <ProfileStats
                streakDays={streakDays}
                currentBadge={currentBadge}
                totalCoins={totalCoins}
              />
              <ProfileBadges />
              <ProfileAchievements />
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
