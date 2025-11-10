import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SYNC_CONFIG, shouldMakeCall } from "../config/syncConfig";
import {
  clearLevelError,
  clearProfileError,
  clearUserData,
  getLevel,
  getProfile,
} from "../features/user.slice";

export const useUser = () => {
  const dispatch = useDispatch();
  const {
    profile,
    level,
    isLoadingProfile,
    isLoadingLevel,
    profileError,
    levelError,
    lastProfileUpdate,
    lastLevelUpdate,
  } = useSelector((state) => state.user);

  const { isAuthenticated } = useSelector((state) => state.auth);

  /**
   * Fetch profile del usuario
   */
  const fetchProfile = useCallback(
    (force = false) => {
      if (!isAuthenticated) {
        console.log(
          "⚠️ [useUser] Cannot fetch profile - user not authenticated"
        );
        return Promise.resolve();
      }

      if (!force && !shouldMakeCall("user/profile")) {
        console.log("⏸️ [useUser] Throttling profile fetch");
        return Promise.resolve();
      }

      return dispatch(getProfile());
    },
    [dispatch, isAuthenticated]
  );

  /**
   * Fetch nivel del usuario
   */
  const fetchLevel = useCallback(
    (force = false) => {
      if (!isAuthenticated) {
        console.log("⚠️ [useUser] Cannot fetch level - user not authenticated");
        return Promise.resolve();
      }

      if (!force && !shouldMakeCall("user/level")) {
        console.log("⏸️ [useUser] Throttling level fetch");
        return Promise.resolve();
      }

      return dispatch(getLevel());
    },
    [dispatch, isAuthenticated]
  );

  /**
   * Fetch todos los datos del usuario
   */
  const fetchUserData = useCallback(
    (force = false) => {
      if (!isAuthenticated) {
        console.log(
          "⚠️ [useUser] Cannot fetch user data - user not authenticated"
        );
        return Promise.resolve();
      }

      console.log("🔄 [useUser] Fetching all user data...");
      return Promise.all([fetchProfile(force), fetchLevel(force)]);
    },
    [isAuthenticated, fetchProfile, fetchLevel]
  );

  /**
   * Limpiar datos del usuario
   */
  const clearUser = useCallback(() => {
    dispatch(clearUserData());
  }, [dispatch]);

  /**
   * Limpiar errores
   */
  const clearErrors = useCallback(() => {
    dispatch(clearProfileError());
    dispatch(clearLevelError());
  }, [dispatch]);

  /**
   * Sincronización automática al montar el componente
   */
  useEffect(() => {
    if (
      isAuthenticated &&
      SYNC_CONFIG.user?.syncOnMount &&
      !profile &&
      !isLoadingProfile
    ) {
      console.log("🔄 [useUser] Auto-fetching user data on mount");
      fetchUserData();
    }
  }, [isAuthenticated, profile, isLoadingProfile, fetchUserData]);

  /**
   * Polling en segundo plano (si está habilitado)
   */
  useEffect(() => {
    if (!isAuthenticated || !SYNC_CONFIG.user?.pollMs) return;

    const interval = setInterval(() => {
      if (SYNC_CONFIG.global.enableSyncLogs) {
        console.log("🔄 [useUser] Background polling user data");
      }
      fetchUserData();
    }, SYNC_CONFIG.user.pollMs);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUserData]);

  /**
   * Refetch al volver a la ventana (si está habilitado)
   */
  useEffect(() => {
    if (!isAuthenticated || !SYNC_CONFIG.user?.refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (SYNC_CONFIG.global.enableSyncLogs) {
        console.log("👁️ [useUser] Window focused - refetching user data");
      }
      fetchUserData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isAuthenticated, fetchUserData]);

  /**
   * Refetch al volver a visibilidad (si está habilitado)
   */
  useEffect(() => {
    if (!isAuthenticated || !SYNC_CONFIG.user?.refetchOnVisibility) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (SYNC_CONFIG.global.enableSyncLogs) {
          console.log("👁️ [useUser] Tab visible - refetching user data");
        }
        fetchUserData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isAuthenticated, fetchUserData]);

  /**
   * Limpiar datos cuando el usuario cierra sesión
   */
  useEffect(() => {
    if (!isAuthenticated && profile) {
      console.log("🧹 [useUser] User logged out - clearing user data");
      clearUser();
    }
  }, [isAuthenticated, profile, clearUser]);

  return {
    // Data
    profile,
    level,

    // Loading states
    isLoadingProfile,
    isLoadingLevel,
    isLoading: isLoadingProfile || isLoadingLevel,

    // Errors
    profileError,
    levelError,
    error: profileError || levelError,

    // Timestamps
    lastProfileUpdate,
    lastLevelUpdate,

    // Methods
    fetchProfile,
    fetchLevel,
    fetchUserData,
    clearUser,
    clearErrors,

    // Computed values
    totalPoints: profile?.totalPoints || 0,
    objectivePerDay: profile?.objectivePerDay || 0,
    username: profile?.username || "",
    email: profile?.email || "",
    plan: profile?.plan || null,
    libraryItems: profile?.libraryItems || [],
    pointsPerDate: profile?.pointsPerDate || [],
    unlockedPets: profile?.unlockedPets || [],
    selectedPet: profile?.selectedPet || null,
    selectedPetHunger: profile?.selectedPetHunger || 0,
    selectedPetLastUpdate: profile?.selectedPetLastUpdate || null,
    levelInfo: level || null,
    currentLevel: level?.codeLevel || 0,
    levelName: level?.name || "",
    levelDescription: level?.description || "",
    levelImageUrl: level?.ImageUrl || "",
    totalPointsRequired: level?.totalPointsRequired || 0,
    isLevelUnlocked: level?.isUnlocked || false,
  };
};
