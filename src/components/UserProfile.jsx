import { motion } from "framer-motion";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
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
      initial={{ opacity: 0, height: isCollapsed ? 0 : "550px" }}
      animate={{ opacity: 1, height: isCollapsed ? 75 : "550px" }}
      transition={{
        duration: 0.9,
        type: "spring",
      }}
      className={`
        w-[360px] 
        max-h-[550px]
        rounded-3xl border border-white/10 bg-slate-900/90 text-white 
        shadow-[0_20px_80px_rgba(0,0,0,.6)] backdrop-blur-xl 
        transition-all duration-900 ease-out overflow-hidden relative
     
      `}
    >
      {isCollapsed ? (
        <div
          className="h-full w-full flex items-center justify-center cursor-pointer "
          onClick={toggleCollapse}
        >
          <div className="text-white  text-sm font-medium flex flex-row items-center justify-center space-x-2 ">
            <p>{name}</p>
            <CiUser size={18} />
          </div>
        </div>
      ) : (
        <div className="relative">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 animate-fade-in min-h-screen">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20"></div>
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white/80 absolute top-0 left-0"></div>
                <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse"></div>
              </div>
            </div>
          ) : showContent ? (
            <div className="animate-slide-up-fade-in">
              <div className="animate-delay-75">
                <ProfileHeader onHide={toggleCollapse} />
              </div>
              <div className="animate-delay-150">
                <ProfileAvatar name={name} level={level} />
              </div>
              <div className="animate-delay-225">
                <ProfileStats
                  streakDays={streakDays}
                  currentBadge={currentBadge}
                  totalCoins={totalCoins}
                />
              </div>
              <div className="animate-delay-300">
                <ProfileBadges />
              </div>
              <div className="animate-delay-375">
                <ProfileAchievements />
              </div>
            </div>
          ) : (
            <div className="animate-fade-out">
              <ProfileHeader onHide={toggleCollapse} />
              <ProfileAvatar name={name} level={level} />
              <ProfileStats
                streakDays={streakDays}
                currentBadge={currentBadge}
                totalCoins={totalCoins}
              />
              <ProfileBadges />
              <ProfileAchievements />
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

        .animate-fade-in {
          animation: fade-in 0.4s ease-in;
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
