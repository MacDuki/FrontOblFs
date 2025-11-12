/**
 * Hook personalizado para sincronización automática de datos
 *
 * Provee métodos para forzar sincronización manual cuando sea necesario
 * y verifica el estado de sincronización de diferentes entidades
 */

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSelectedPet } from "../features/pet.slice";
import { getPointsSummary } from "../features/points.slice";
import { fetchMyReviews } from "../features/reviews.slice";
import { getLevel, getProfile } from "../features/user.slice";

/**
 * Hook para sincronización automática
 *
 * @returns {Object} Métodos de sincronización
 */
export function useAutoSync() {
  const dispatch = useDispatch();

  // Selectores para verificar estado de carga
  const isPetLoading = useSelector((s) => s.pets.loading);
  const isUserLoading = useSelector(
    (s) => s.user.isLoadingProfile || s.user.isLoadingLevel
  );
  const isPointsLoading = useSelector((s) => s.points.isLoadingSummary);
  const isReviewsLoading = useSelector((s) => s.reviews.loading);

  /**
   * Sincroniza todos los datos del usuario
   */
  const syncAll = useCallback(async () => {
    console.log("🔄 [useAutoSync] Sincronizando todos los datos...");

    try {
      await Promise.all([
        dispatch(fetchSelectedPet({ background: true })),
        dispatch(getProfile()),
        dispatch(getLevel()),
        dispatch(getPointsSummary()),
        dispatch(fetchMyReviews()),
      ]);

      console.log("✅ [useAutoSync] Sincronización completa exitosa");
    } catch (error) {
      console.error(
        "❌ [useAutoSync] Error en sincronización completa:",
        error
      );
      throw error;
    }
  }, [dispatch]);

  /**
   * Sincroniza solo la mascota
   */
  const syncPet = useCallback(async () => {
    console.log("🐾 [useAutoSync] Sincronizando mascota...");

    try {
      await dispatch(fetchSelectedPet({ background: true }));
      console.log("✅ [useAutoSync] Mascota sincronizada");
    } catch (error) {
      console.error("❌ [useAutoSync] Error sincronizando mascota:", error);
      throw error;
    }
  }, [dispatch]);

  /**
   * Sincroniza perfil y nivel del usuario
   */
  const syncUser = useCallback(async () => {
    console.log("👤 [useAutoSync] Sincronizando usuario...");

    try {
      await Promise.all([dispatch(getProfile()), dispatch(getLevel())]);
      console.log("✅ [useAutoSync] Usuario sincronizado");
    } catch (error) {
      console.error("❌ [useAutoSync] Error sincronizando usuario:", error);
      throw error;
    }
  }, [dispatch]);

  /**
   * Sincroniza puntos del usuario
   */
  const syncPoints = useCallback(async () => {
    console.log("💰 [useAutoSync] Sincronizando puntos...");

    try {
      await dispatch(getPointsSummary());
      console.log("✅ [useAutoSync] Puntos sincronizados");
    } catch (error) {
      console.error("❌ [useAutoSync] Error sincronizando puntos:", error);
      throw error;
    }
  }, [dispatch]);

  /**
   * Sincroniza reviews del usuario
   */
  const syncReviews = useCallback(async () => {
    console.log("📝 [useAutoSync] Sincronizando reviews...");

    try {
      await dispatch(fetchMyReviews());
      console.log("✅ [useAutoSync] Reviews sincronizadas");
    } catch (error) {
      console.error("❌ [useAutoSync] Error sincronizando reviews:", error);
      throw error;
    }
  }, [dispatch]);

  /**
   * Sincroniza datos después de registrar páginas
   */
  const syncAfterAddPages = useCallback(async () => {
    console.log("📚 [useAutoSync] Sincronizando después de agregar páginas...");

    try {
      await Promise.all([
        dispatch(fetchSelectedPet({ background: true })),
        dispatch(getProfile()),
        dispatch(getLevel()),
        dispatch(getPointsSummary()),
      ]);
      console.log("✅ [useAutoSync] Sincronización post-páginas exitosa");
    } catch (error) {
      console.error(
        "❌ [useAutoSync] Error en sincronización post-páginas:",
        error
      );
      throw error;
    }
  }, [dispatch]);

  /**
   * Sincroniza datos después de crear/editar review
   */
  const syncAfterReview = useCallback(async () => {
    console.log("⭐ [useAutoSync] Sincronizando después de review...");

    try {
      await Promise.all([
        dispatch(fetchMyReviews()),
        dispatch(getProfile()),
        dispatch(getLevel()),
        dispatch(getPointsSummary()),
      ]);
      console.log("✅ [useAutoSync] Sincronización post-review exitosa");
    } catch (error) {
      console.error(
        "❌ [useAutoSync] Error en sincronización post-review:",
        error
      );
      throw error;
    }
  }, [dispatch]);

  /**
   * Verifica si alguna entidad está cargando
   */
  const isAnythingLoading =
    isPetLoading || isUserLoading || isPointsLoading || isReviewsLoading;

  return {
    // Métodos de sincronización
    syncAll,
    syncPet,
    syncUser,
    syncPoints,
    syncReviews,
    syncAfterAddPages,
    syncAfterReview,

    // Estados de carga
    isPetLoading,
    isUserLoading,
    isPointsLoading,
    isReviewsLoading,
    isAnythingLoading,
  };
}

export default useAutoSync;
