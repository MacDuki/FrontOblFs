import { motion } from "framer-motion";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { useUser } from "../../hooks/useUser";
import { Loader } from "../ui/Loader";
import { ProfileAvatar } from "./Profile/ProfileAvatar";
import { ProfileHeader } from "./Profile/ProfileHeader";
import { ProfileStats } from "./Profile/ProfileStats";

/* ---- main card ---- */
export default function UserHome() {
  const {
    username,
    currentLevel,
    totalPoints,
    levelName,
    isLoading: isLoadingUser,
  } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);

  // Formatear totalPoints para mostrar (ej: 2600 -> "2.6K")
  const formatPoints = (points) => {
    if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`;
    }
    return points.toString();
  };

  // Datos para mostrar
  const displayName = username || "Usuario";
  const displayLevel = currentLevel || 1;
  const displayStreakDays = 0; // TODO: Implementar streak cuando esté disponible en el backend
  const displayBadge = levelName || "Principiante";
  const displayCoins = formatPoints(totalPoints || 0);

  const toggleCollapse = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setIsLoading(true);
      setShowContent(false);

      setTimeout(() => {
        setIsLoading(true);
      }, 100);

      setTimeout(() => {
        setIsLoading(false);
        setShowContent(true);
      }, 900);
    } else {
      setIsLoading(false);
      setShowContent(false);

      setIsCollapsed(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: isCollapsed ? 0 : "300px" }}
      animate={{ opacity: 1, height: isCollapsed ? 75 : "300px" }}
      transition={{
        duration: 0.9,
        type: "spring",
      }}
      className={`
        w-[360px] h-[300px] rounded-3xl border border-white/10 
        text-white shadow-[0_20px_80px_rgba(0,0,0,.6)] 
        backdrop-blur-sm transition-all duration-900 ease-out overflow-hidden 
      relative
      `}
    >
      {isCollapsed ? (
        <div
          className="h-full w-full flex items-center justify-center cursor-pointer "
          onClick={toggleCollapse}
        >
          <div className="text-white  text-sm font-medium flex flex-row items-center justify-center space-x-2 ">
            <p>{displayName}</p>
            <CiUser size={18} />
          </div>
        </div>
      ) : (
        <div className="relative ">
          {isLoading || isLoadingUser ? (
            <Loader
              icon={<CiUser size={20} />}
              className="h-[300px]"
              size={48}
              iconSize={20}
            />
          ) : showContent ? (
            <div className="animate-slide-up-fade-in">
              <div className="animate-delay-75">
                <ProfileHeader onHide={toggleCollapse} />
              </div>
              <div className="animate-delay-150">
                <ProfileAvatar name={displayName} level={displayLevel} />
              </div>
              <div className="animate-delay-225">
                <ProfileStats
                  streakDays={displayStreakDays}
                  currentBadge={displayBadge}
                  totalCoins={displayCoins}
                />
              </div>
            </div>
          ) : (
            <div className="animate-fade-out ">
              <ProfileHeader onHide={toggleCollapse} />
              <ProfileAvatar name={displayName} level={displayLevel} />
              <ProfileStats
                streakDays={displayStreakDays}
                currentBadge={displayBadge}
                totalCoins={displayCoins}
              />
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .animate-slide-up-fade-in {
          animation: slide-up-fade-in 0.6s ease-out;
        }

        .animate-fade-out {
          animation: fade-out 0.2s ease-out;
        }

        .animate-delay-75 {
          animation-delay: 75ms;
        }

        .animate-delay-150 {
          animation-delay: 150ms;
        }

        .animate-delay-225 {
          animation-delay: 225ms;
        }

        .animate-delay-300 {
          animation-delay: 300ms;
        }

        .animate-delay-375 {
          animation-delay: 375ms;
        }
      `}</style>
    </motion.div>
  );
}
