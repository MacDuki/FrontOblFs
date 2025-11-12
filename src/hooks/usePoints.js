import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SYNC_CONFIG, shouldMakeCall } from "../config/syncConfig";
import {
  clearPointsByDateError,
  clearPointsData,
  clearSummaryError,
  getPointsByDate,
  getPointsSummary,
} from "../features/points.slice";

export const usePoints = () => {
  const dispatch = useDispatch();
  const {
    summary,
    pointsByDate,
    isLoadingSummary,
    isLoadingPointsByDate,
    summaryError,
    pointsByDateError,
    lastSummaryUpdate,
    lastPointsByDateUpdate,
  } = useSelector((state) => state.points);

  const { isAuthenticated } = useSelector((state) => state.auth);

  /**
   * Fetch resumen de puntos totales
   */
  const fetchPointsSummary = useCallback(
    (force = false) => {
      if (!isAuthenticated) {
        console.log(
          "⚠️ [usePoints] Cannot fetch summary - user not authenticated"
        );
        return Promise.resolve();
      }

      // Si force=true, siempre hacer la llamada
      if (force) {
        console.log("🔄 [usePoints] Force fetching points summary");
        return dispatch(getPointsSummary());
      }

      if (!shouldMakeCall("points/summary")) {
        console.log("⏸️ [usePoints] Throttling summary fetch");
        return Promise.resolve();
      }

      return dispatch(getPointsSummary());
    },
    [dispatch, isAuthenticated]
  );

  /**
   * Fetch puntos por fecha
   * @param {string} from - Fecha inicio (formato: YYYY-MM-DD)
   * @param {string} to - Fecha fin (formato: YYYY-MM-DD)
   */
  const fetchPointsByDate = useCallback(
    (from, to, force = false) => {
      if (!isAuthenticated) {
        console.log(
          "⚠️ [usePoints] Cannot fetch points by date - user not authenticated"
        );
        return Promise.resolve();
      }

      if (!from || !to) {
        console.error("❌ [usePoints] from and to dates are required");
        return Promise.resolve();
      }

      const cacheKey = `points/byDate/${from}/${to}`;

      // Si force=true, siempre hacer la llamada
      if (force) {
        console.log(
          `🔄 [usePoints] Force fetching points by date: ${from} to ${to}`
        );
        return dispatch(getPointsByDate({ from, to }));
      }

      if (!shouldMakeCall(cacheKey)) {
        console.log("⏸️ [usePoints] Throttling points by date fetch");
        return Promise.resolve();
      }

      return dispatch(getPointsByDate({ from, to }));
    },
    [dispatch, isAuthenticated]
  );

  /**
   * Fetch todos los datos de puntos
   */
  const fetchAllPoints = useCallback(
    (from, to, force = false) => {
      if (!isAuthenticated) {
        console.log(
          "⚠️ [usePoints] Cannot fetch all points - user not authenticated"
        );
        return Promise.resolve();
      }

      console.log("🔄 [usePoints] Fetching all points data...");
      const promises = [fetchPointsSummary(force)];

      if (from && to) {
        promises.push(fetchPointsByDate(from, to, force));
      }

      return Promise.all(promises);
    },
    [isAuthenticated, fetchPointsSummary, fetchPointsByDate]
  );

  /**
   * Limpiar datos de puntos
   */
  const clearPoints = useCallback(() => {
    dispatch(clearPointsData());
  }, [dispatch]);

  /**
   * Limpiar errores
   */
  const clearErrors = useCallback(() => {
    dispatch(clearSummaryError());
    dispatch(clearPointsByDateError());
  }, [dispatch]);

  /**
   * Sincronización automática al montar el componente
   */
  useEffect(() => {
    if (
      isAuthenticated &&
      SYNC_CONFIG.points?.syncOnMount &&
      !summary &&
      !isLoadingSummary
    ) {
      console.log("🔄 [usePoints] Auto-fetching points summary on mount");
      fetchPointsSummary();
    }
  }, [isAuthenticated, summary, isLoadingSummary, fetchPointsSummary]);

  /**
   * Polling en segundo plano (si está habilitado)
   * ⚠️ DESHABILITADO: El middleware de sincronización automática ahora se encarga de esto
   */
  /*
  useEffect(() => {
    if (!isAuthenticated || !SYNC_CONFIG.points?.pollMs) return;

    const interval = setInterval(() => {
      if (SYNC_CONFIG.global.enableSyncLogs) {
        console.log("🔄 [usePoints] Background polling points summary");
      }
      fetchPointsSummary();
    }, SYNC_CONFIG.points.pollMs);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchPointsSummary]);
  */

  /**
   * Refetch al volver a la ventana (si está habilitado)
   * ⚠️ DESHABILITADO: El middleware de sincronización automática ahora se encarga de esto
   */
  /*
  useEffect(() => {
    if (!isAuthenticated || !SYNC_CONFIG.points?.refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (SYNC_CONFIG.global.enableSyncLogs) {
        console.log(
          "👁️ [usePoints] Window focused - refetching points summary"
        );
      }
      fetchPointsSummary();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isAuthenticated, fetchPointsSummary]);
  */

  /**
   * Refetch al volver a visibilidad (si está habilitado)
   * ⚠️ DESHABILITADO: El middleware de sincronización automática ahora se encarga de esto
   */
  /*
  useEffect(() => {
    if (!isAuthenticated || !SYNC_CONFIG.points?.refetchOnVisibility) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (SYNC_CONFIG.global.enableSyncLogs) {
          console.log("👁️ [usePoints] Tab visible - refetching points summary");
        }
        fetchPointsSummary();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isAuthenticated, fetchPointsSummary]);
  */

  /**
   * Limpiar datos cuando el usuario cierra sesión
   */
  useEffect(() => {
    if (!isAuthenticated && summary) {
      console.log("🧹 [usePoints] User logged out - clearing points data");
      clearPoints();
    }
  }, [isAuthenticated, summary, clearPoints]);

  return {
    // Data
    summary,
    pointsByDate,
    totalPoints: summary?.total || 0,

    // Loading states
    isLoadingSummary,
    isLoadingPointsByDate,
    isLoading: isLoadingSummary || isLoadingPointsByDate,

    // Errors
    summaryError,
    pointsByDateError,
    error: summaryError || pointsByDateError,

    // Timestamps
    lastSummaryUpdate,
    lastPointsByDateUpdate,

    // Methods
    fetchPointsSummary,
    fetchPointsByDate,
    fetchAllPoints,
    clearPoints,
    clearErrors,
  };
};
