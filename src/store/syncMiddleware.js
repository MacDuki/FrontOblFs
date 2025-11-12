/**
 * Middleware de sincronización automática
 *
 * Este middleware escucha acciones específicas que modifican datos
 * y dispara automáticamente actualizaciones de datos relacionados
 * para mantener la UI sincronizada sin recargas manuales.
 *
 * CASOS DE USO:
 * - Usuario registra páginas → actualizar pet, user (puntos/badge), points
 * - Usuario crea review → actualizar reviews del usuario
 * - Usuario elimina review → actualizar reviews del usuario
 * - Usuario completa un libro → actualizar pet, user, points, stats
 */

import { fetchSelectedPet } from "../features/pet.slice";
import { getPointsByDate, getPointsSummary } from "../features/points.slice";
import { fetchMyReviews } from "../features/reviews.slice";
import { getLevel, getProfile } from "../features/user.slice";

// Acciones que disparan sincronización automática
const SYNC_TRIGGERS = {
  // Cuando se agregan páginas a un libro
  ADD_PAGES: "libraryItems/addPages/fulfilled",

  // Cuando se cambia el estado de un libro (ej: TERMINADO)
  CHANGE_ESTADO: "libraryItems/changeEstado/fulfilled",

  // Cuando se crea una review
  CREATE_REVIEW: "reviews/create/fulfilled",

  // Cuando se elimina una review
  DELETE_REVIEW: "reviews/delete/fulfilled",

  // Cuando se actualiza una review
  UPDATE_REVIEW: "reviews/update/fulfilled",

  // Cuando se agrega un libro a la biblioteca
  ADD_LIBRARY_ITEM: "libraryItems/add/fulfilled",
};

// Configuración de qué actualizar en cada caso
const SYNC_CONFIG = {
  [SYNC_TRIGGERS.ADD_PAGES]: {
    updates: ["pet", "user", "points"],
    reason: "Páginas registradas - Actualizando mascota, perfil y puntos",
  },
  [SYNC_TRIGGERS.CHANGE_ESTADO]: {
    updates: ["pet", "user", "points"],
    reason:
      "Estado del libro actualizado - Actualizando mascota, perfil y puntos",
  },
  [SYNC_TRIGGERS.CREATE_REVIEW]: {
    updates: ["reviews", "user", "points"],
    reason: "Review creada - Actualizando lista de reviews, perfil y puntos",
  },
  [SYNC_TRIGGERS.DELETE_REVIEW]: {
    updates: ["reviews", "user", "points"],
    reason: "Review eliminada - Actualizando lista de reviews, perfil y puntos",
  },
  [SYNC_TRIGGERS.UPDATE_REVIEW]: {
    updates: ["reviews"],
    reason: "Review actualizada - Actualizando lista de reviews",
  },
  [SYNC_TRIGGERS.ADD_LIBRARY_ITEM]: {
    updates: ["pet", "user"],
    reason: "Libro agregado - Actualizando mascota y perfil",
  },
};

// Historial de sincronizaciones para evitar llamadas duplicadas
const syncHistory = new Map();
const THROTTLE_TIME = 3000; // 3 segundos entre sincronizaciones del mismo tipo

/**
 * Verifica si debería hacer una sincronización basado en throttling
 */
function shouldSync(key) {
  const now = Date.now();
  const lastSync = syncHistory.get(key) || 0;

  if (now - lastSync < THROTTLE_TIME) {
    console.log(`⏸️ [AutoSync] Throttling sincronización de ${key}`);
    return false;
  }

  syncHistory.set(key, now);
  return true;
}

/**
 * Ejecuta las actualizaciones necesarias
 */
async function executeUpdates(updates, dispatch, reason) {
  console.log(`🔄 [AutoSync] ${reason}`);

  const promises = [];

  if (updates.includes("pet") && shouldSync("pet")) {
    console.log("  → Actualizando mascota...");
    promises.push(dispatch(fetchSelectedPet({ background: true })));
  }

  if (updates.includes("user") && shouldSync("user")) {
    console.log("  → Actualizando perfil de usuario...");
    promises.push(dispatch(getProfile()), dispatch(getLevel()));
  }

  if (updates.includes("points") && shouldSync("points")) {
    console.log("  → Actualizando puntos...");
    // Resumen total
    promises.push(dispatch(getPointsSummary()));

    // También refrescar puntos por fecha para que los gráficos/heatmap vean la actividad reciente
    const today = new Date();
    const from = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const ymd = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${dd}`;
    };
    const fromStr = ymd(from);
    const toStr = ymd(tomorrow);
    promises.push(dispatch(getPointsByDate({ from: fromStr, to: toStr })));
  }

  if (updates.includes("reviews") && shouldSync("reviews")) {
    console.log("  → Actualizando lista de reviews...");
    promises.push(dispatch(fetchMyReviews()));
  }

  try {
    await Promise.all(promises);
    console.log("✅ [AutoSync] Sincronización completada");
  } catch (error) {
    console.error("❌ [AutoSync] Error en sincronización:", error);
  }
}

/**
 * Middleware de sincronización
 */
export const syncMiddleware = (store) => (next) => (action) => {
  // Ejecutar la acción primero
  const result = next(action);

  // Verificar si esta acción dispara sincronización
  const syncConfig = SYNC_CONFIG[action.type];

  if (syncConfig) {
    // Ejecutar actualizaciones de forma asíncrona (no bloquear)
    setTimeout(() => {
      executeUpdates(syncConfig.updates, store.dispatch, syncConfig.reason);
    }, 100); // Pequeño delay para que la UI se actualice primero
  }

  return result;
};

/**
 * Helper para forzar sincronización manual desde componentes
 */
export function triggerManualSync(
  dispatch,
  entities = ["pet", "user", "points", "reviews"]
) {
  console.log("🔄 [ManualSync] Sincronización manual solicitada");
  executeUpdates(entities, dispatch, "Sincronización manual");
}

export default syncMiddleware;
