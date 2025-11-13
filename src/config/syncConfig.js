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
    pollMs: 20000,
    refetchOnWindowFocus: false,
    refetchOnVisibility: true,
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

    // Sincronización automática habilitada (middleware)
    autoSyncEnabled: true,

    // Delay antes de ejecutar sincronización automática (ms)
    autoSyncDelay: 100,
  },
};

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

export function clearThrottleHistory() {
  lastCallTimes.clear();
}
