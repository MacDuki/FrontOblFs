/**
 * Configuración centralizada para sincronización y polling de datos
 *
 * IMPORTANTE: Ajustar estos valores con cuidado para evitar exceso de llamadas a la API
 */

export const SYNC_CONFIG = {
  // ========== LIBRARY ITEMS ==========
  libraryItems: {
    // Polling en segundo plano (0 = deshabilitado)
    pollMs: 0, // Cambiado de 15000 a 0 (DESHABILITADO)

    // Revalidar al volver a la ventana
    refetchOnWindowFocus: false, // Cambiado de true a false

    // Revalidar al volver a la pestaña visible
    refetchOnVisibility: false, // Cambiado de true a false

    // Sincronización inicial al montar
    syncOnMount: true,
  },

  // ========== COLLECTIONS ==========
  collections: {
    pollMs: 0,
    refetchOnWindowFocus: false,
    refetchOnVisibility: false,
    syncOnMount: true,
  },

  // ========== BOOKS ==========
  books: {
    pollMs: 0,
    refetchOnWindowFocus: false,
    refetchOnVisibility: false,
    syncOnMount: true, // Cargar categorías al montar cuando está integrado al Home
  },

  // ========== PET ==========
  pet: {
    pollMs: 0,
    refetchOnWindowFocus: false,
    refetchOnVisibility: false,
    syncOnMount: true,
  },

  // ========== USER ==========
  user: {
    pollMs: 0, // Polling deshabilitado por defecto
    refetchOnWindowFocus: false,
    refetchOnVisibility: false,
    syncOnMount: true, // Sincronizar perfil y nivel al montar
  },

  // ========== POINTS ==========
  points: {
    pollMs: 0, // Polling deshabilitado por defecto
    refetchOnWindowFocus: false,
    refetchOnVisibility: false,
    syncOnMount: true, // Sincronizar resumen de puntos al montar
  },

  // ========== CONFIGURACIÓN GLOBAL ==========
  global: {
    // Tiempo mínimo entre llamadas a la misma API (throttling)
    minTimeBetweenCalls: 5000, // 5 segundos

    // Habilitar logs de sincronización en consola
    enableSyncLogs: true,
  },
};

/**
 * Helper para verificar si debe hacer una llamada (throttling)
 */
const lastCallTimes = new Map();

export function shouldMakeCall(
  key,
  minTime = SYNC_CONFIG.global.minTimeBetweenCalls
) {
  const now = Date.now();
  const lastCall = lastCallTimes.get(key) || 0;

  if (now - lastCall < minTime) {
    if (SYNC_CONFIG.global.enableSyncLogs) {
      console.log(
        `⏸️ [Sync Throttle] Bloqueando llamada a ${key} (muy reciente)`
      );
    }
    return false;
  }

  lastCallTimes.set(key, now);
  return true;
}

/**
 * Helper para limpiar el historial de throttling
 */
export function clearThrottleHistory() {
  lastCallTimes.clear();
}

// ========== NOTAS DE USO ==========
/*
Para reactivar sincronización en segundo plano más adelante:
- libraryItems.pollMs: 60000 (1 minuto)
- refetchOnWindowFocus: true solo en pantallas críticas
- refetchOnVisibility: true solo en pantallas críticas

RECOMENDACIONES:
1. Usar refetch manual cuando el usuario haga una acción
2. Implementar pull-to-refresh en mobile
3. Usar optimistic updates para mejor UX
4. Solo habilitar polling en pantallas donde los datos cambien frecuentemente
*/
