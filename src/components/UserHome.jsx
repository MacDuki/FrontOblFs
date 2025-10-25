import { motion } from "framer-motion";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { Loader } from "./Loader";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";

/* ---- main card ---- */
export default function UserHome({
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
      relative justify-self-center 
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
        <div className="relative ">
          {isLoading ? (
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
                <ProfileAvatar name={name} level={level} />
              </div>
              <div className="animate-delay-225">
                <ProfileStats
                  streakDays={streakDays}
                  currentBadge={currentBadge}
                  totalCoins={totalCoins}
                />
              </div>
            </div>
          ) : (
            <div className="animate-fade-out ">
              <ProfileHeader onHide={toggleCollapse} />
              <ProfileAvatar name={name} level={level} />
              <ProfileStats
                streakDays={streakDays}
                currentBadge={currentBadge}
                totalCoins={totalCoins}
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
