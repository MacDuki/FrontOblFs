import { motion as Motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CiUser } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { Loader } from "../ui/Loader";
import PlanUpgradeModal from "./PlanUpgradeModal";
import { ProfileAvatar } from "./Profile/ProfileAvatar";
import { ProfileHeader } from "./Profile/ProfileHeader";
import { ProfileStats } from "./Profile/ProfileStats";

export default function UserHome() {
  const {
    username,
    currentLevel,
    totalPoints,
    levelName,
    plan,
    isLoading: isLoadingUser,
    fetchUserData,
  } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  // ✅ OPTIMIZACIÓN: Solo mostrar loader en la carga inicial, no en sincronizaciones
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("openPlanModal") === "true") {
      setShowPlanModal(true);
      navigate("/home", { replace: true });
    }
  }, [location.search, navigate]);

  // ✅ Detectar cuando ya cargó por primera vez
  useEffect(() => {
    if (!hasLoadedOnce && username && !isLoadingUser) {
      setHasLoadedOnce(true);
    }
  }, [username, isLoadingUser, hasLoadedOnce]);

  // Formatear totalPoints para mostrar (ej: 2600 -> "2.6K")
  const formatPoints = useCallback((points) => {
    if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`;
    }
    return points.toString();
  }, []);

  // ✅ OPTIMIZACIÓN: Memorizamos los datos para evitar re-renders innecesarios
  // Solo se recalculan cuando cambian los valores reales
  const displayData = useMemo(
    () => ({
      name: username || "Usuario",
      level: currentLevel || 1,
      streakDays: 0, // TODO: Implementar streak cuando esté disponible en el backend
      badge: levelName || "Principiante",
      coins: formatPoints(totalPoints || 0),
    }),
    [username, currentLevel, levelName, totalPoints, formatPoints]
  );

  // ✅ OPTIMIZACIÓN: Memorizamos la función para evitar re-creaciones
  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // ✅ OPTIMIZACIÓN: Memorizamos el handler
  const handlePlanChanged = useCallback(
    (newPlan) => {
      console.log("✅ Plan cambiado a:", newPlan);
      if (fetchUserData) {
        fetchUserData(true);
      }
    },
    [fetchUserData]
  );

  return (
    <Motion.div
      initial={{ opacity: 0, height: isCollapsed ? 0 : "300px" }}
      animate={{ opacity: 1, height: isCollapsed ? 75 : "300px" }}
      transition={{
        duration: 0.6,
        type: "spring",
        stiffness: 150,
        damping: 20,
      }}
      className={`
        w-[360px] h-[300px] rounded-3xl border border-white/10 
        text-white shadow-[0_20px_80px_rgba(0,0,0,.6)] 
        backdrop-blur-sm transition-all duration-600 ease-out overflow-hidden 
        relative
      `}
    >
      {isCollapsed ? (
        <div
          className="h-full w-full flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
          onClick={toggleCollapse}
        >
          <div className="text-white text-sm font-medium flex flex-row items-center justify-center space-x-2">
            <p>{displayData.name}</p>
            <CiUser size={18} />
          </div>
        </div>
      ) : (
        <div className="relative h-full">
          {/* ✅ OPTIMIZACIÓN: Solo mostrar loader en carga inicial, no en sincronizaciones */}
          {isLoadingUser && !hasLoadedOnce ? (
            <Loader
              icon={<CiUser size={20} />}
              className="h-[300px]"
              size={48}
              iconSize={20}
            />
          ) : (
            <Motion.div
              key={`${displayData.name}-${displayData.level}-${displayData.coins}`}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              <ProfileHeader
                onHide={toggleCollapse}
                onUpgradePlan={() => setShowPlanModal(true)}
              />
              <ProfileAvatar
                name={displayData.name}
                level={displayData.level}
              />
              <ProfileStats
                streakDays={displayData.streakDays}
                currentBadge={displayData.badge}
                totalCoins={displayData.coins}
              />
            </Motion.div>
          )}
        </div>
      )}

      <PlanUpgradeModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        currentPlan={plan}
        onPlanChanged={handlePlanChanged}
      />
    </Motion.div>
  );
}
