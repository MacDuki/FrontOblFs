# Sistema de Sincronización Automática

## 📋 Resumen

Este documento describe el sistema de sincronización automática implementado para mantener los datos de la aplicación actualizados en tiempo real sin necesidad de recargas manuales.

## 🎯 Casos de Uso Cubiertos

### 1. **Usuario Registra Páginas Leídas**

- ✅ Se actualiza automáticamente:
  - Estado de la mascota (hunger, happiness)
  - Información del usuario (puntos, badge, nivel)
  - Resumen de puntos
- 📍 Localización: `AddPagesModal` → `addPagesToLibraryItem` action

### 2. **Usuario Crea una Review**

- ✅ Se actualiza automáticamente:
  - Lista de reviews del usuario
  - Información del usuario (puntos, badge, nivel)
  - Resumen de puntos
- 📍 Localización: `ReviewModal` → `createReview` action

### 3. **Usuario Elimina una Review**

- ✅ Se actualiza automáticamente:
  - Lista de reviews del usuario
  - Información del usuario (puntos, badge, nivel)
  - Resumen de puntos
- 📍 Localización: Panel de reviews → `deleteReview` action

### 4. **Usuario Actualiza una Review**

- ✅ Se actualiza automáticamente:
  - Lista de reviews del usuario
- 📍 Localización: `EditReviewModal` → `updateReview` action

### 5. **Usuario Completa un Libro (Estado: TERMINADO)**

- ✅ Se actualiza automáticamente:
  - Estado de la mascota
  - Información del usuario (puntos, badge, nivel)
  - Resumen de puntos
- 📍 Localización: `LibraryItemCard` → `changeEstadoLibraryItem` action

### 6. **Usuario Agrega un Libro a su Biblioteca**

- ✅ Se actualiza automáticamente:
  - Estado de la mascota
  - Información del usuario
- 📍 Localización: `DiscoverBooks` → `addLibraryItem` action

## 🏗️ Arquitectura

### Componentes del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     Usuario realiza acción                   │
│           (agregar páginas, crear review, etc.)              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               Component (ej: AddPagesModal)                  │
│      dispatch(addPagesToLibraryItem({ id, pages }))         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Redux Store                               │
│         Action: libraryItems/addPages/fulfilled              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  syncMiddleware                              │
│     Detecta acción y dispara sincronizaciones                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Actualizaciones Automáticas                     │
│  • dispatch(fetchSelectedPet())                              │
│  • dispatch(getProfile())                                    │
│  • dispatch(getLevel())                                      │
│  • dispatch(getPointsSummary())                              │
└─────────────────────────────────────────────────────────────┘
```

### Archivos Clave

#### 1. **`src/store/syncMiddleware.js`** (NUEVO)

Middleware de Redux que intercepta acciones específicas y dispara actualizaciones automáticas.

**Características:**

- ⚡ Throttling para evitar llamadas duplicadas (3 segundos)
- 🎯 Configuración específica por tipo de acción
- 📝 Logs detallados para debugging
- ⏱️ Delay de 100ms para permitir que la UI se actualice primero

**Acciones monitoreadas:**

```javascript
- libraryItems/addPages/fulfilled
- libraryItems/changeEstado/fulfilled
- reviews/create/fulfilled
- reviews/delete/fulfilled
- reviews/update/fulfilled
- libraryItems/add/fulfilled
```

#### 2. **`src/hooks/useAutoSync.js`** (NUEVO)

Hook personalizado para sincronización manual cuando sea necesario.

**Métodos disponibles:**

```javascript
const {
  syncAll, // Sincroniza todo
  syncPet, // Solo mascota
  syncUser, // Solo usuario (perfil + nivel)
  syncPoints, // Solo puntos
  syncReviews, // Solo reviews
  syncAfterAddPages, // Optimizado para después de agregar páginas
  syncAfterReview, // Optimizado para después de review

  // Estados de carga
  isPetLoading,
  isUserLoading,
  isPointsLoading,
  isReviewsLoading,
  isAnythingLoading,
} = useAutoSync();
```

#### 3. **`src/config/syncConfig.js`** (ACTUALIZADO)

Configuración centralizada con nuevas opciones:

```javascript
global: {
  minTimeBetweenCalls: 5000,   // Throttling general
  enableSyncLogs: true,         // Logs de sincronización
  autoSyncEnabled: true,        // Habilitar middleware
  autoSyncDelay: 100,           // Delay antes de sync
}
```

#### 4. **`src/store/store.js`** (ACTUALIZADO)

Store de Redux con middleware integrado:

```javascript
export const store = configureStore({
  reducer: { ... },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(syncMiddleware),
});
```

## 🚀 Uso

### Automático (Recomendado)

**No requiere cambios en componentes**. El middleware se encarga automáticamente:

```jsx
// En cualquier componente
const { addPages } = useLibraryItems();

// Esto disparará automáticamente todas las sincronizaciones necesarias
await addPages({ id: bookId, pages: 20 });
// ✅ Mascota, usuario y puntos se actualizan solos
```

### Manual (Opcional)

Para casos especiales donde necesites forzar sincronización:

```jsx
import useAutoSync from "../hooks/useAutoSync";

function MyComponent() {
  const { syncAll, syncAfterAddPages } = useAutoSync();

  // Sincronizar todo manualmente
  const handleRefresh = async () => {
    await syncAll();
  };

  // Sincronización específica
  const handleCustomAction = async () => {
    // ... hacer algo
    await syncAfterAddPages();
  };

  return <button onClick={handleRefresh}>Actualizar Todo</button>;
}
```

## 🔧 Configuración

### Habilitar/Deshabilitar Sincronización Automática

En `src/config/syncConfig.js`:

```javascript
global: {
  autoSyncEnabled: true,  // Cambiar a false para deshabilitar
  enableSyncLogs: true,   // Cambiar a false para silenciar logs
}
```

### Ajustar Throttling

Para cambiar el tiempo mínimo entre sincronizaciones del mismo tipo:

En `src/store/syncMiddleware.js`:

```javascript
const THROTTLE_TIME = 3000; // Cambiar a tu preferencia (ms)
```

### Agregar Nuevas Acciones a Sincronizar

1. Agregar a `SYNC_TRIGGERS` en `syncMiddleware.js`:

```javascript
const SYNC_TRIGGERS = {
  // ... existentes
  MY_NEW_ACTION: "mySlice/myAction/fulfilled",
};
```

2. Configurar qué actualizar:

```javascript
const SYNC_CONFIG = {
  // ... existentes
  [SYNC_TRIGGERS.MY_NEW_ACTION]: {
    updates: ["pet", "user", "points", "reviews"],
    reason: "Descripción de la acción",
  },
};
```

## 📊 Monitoreo

### Logs en Consola

El sistema genera logs detallados (si `enableSyncLogs: true`):

```
🔄 [AutoSync] Páginas registradas - Actualizando mascota, perfil y puntos
  → Actualizando mascota...
  → Actualizando perfil de usuario...
  → Actualizando puntos...
✅ [AutoSync] Sincronización completada
```

### Throttling

```
⏸️ [AutoSync] Throttling sincronización de pet
```

Indica que se bloqueó una llamada duplicada reciente.

## ⚠️ Consideraciones

### Performance

- ✅ **Throttling**: Evita llamadas duplicadas en 3 segundos
- ✅ **Delay**: 100ms antes de sincronizar para que la UI se actualice primero
- ✅ **Background**: Algunas llamadas se marcan como `background: true` para no mostrar loaders

### Orden de Ejecución

1. Acción principal se ejecuta (ej: agregar páginas)
2. UI se actualiza con datos optimistas
3. Delay de 100ms
4. Sincronizaciones automáticas se ejecutan en paralelo
5. UI se actualiza con datos frescos del servidor

### Errores

- Los errores en sincronización automática se loguean pero **NO bloquean** la acción principal
- El usuario ve su acción completada aunque la sincronización falle

## 🎨 Mejoras Futuras

- [ ] Indicador visual de sincronización en progreso
- [ ] Sistema de caché inteligente con TTL (Time To Live)
- [ ] Sincronización selectiva basada en permisos del plan
- [ ] WebSocket para sincronización en tiempo real
- [ ] Retry automático en caso de error
- [ ] Queue de sincronización para modo offline

## 📝 Ejemplos Completos

### Ejemplo 1: Componente con AddPages

```jsx
import useLibraryItems from "../hooks/useLibraryItem";

function BookCard({ book }) {
  const { addPages } = useLibraryItems();

  const handleAddPages = async () => {
    try {
      await addPages({ id: book._id, pages: 10 });
      // ✅ Mascota, usuario y puntos ya están actualizados
      alert("Páginas agregadas y datos sincronizados");
    } catch (error) {
      alert("Error al agregar páginas");
    }
  };

  return <button onClick={handleAddPages}>+10 páginas</button>;
}
```

### Ejemplo 2: Componente con Sincronización Manual

```jsx
import useAutoSync from "../hooks/useAutoSync";

function RefreshButton() {
  const { syncAll, isAnythingLoading } = useAutoSync();

  return (
    <button onClick={syncAll} disabled={isAnythingLoading}>
      {isAnythingLoading ? "Sincronizando..." : "Actualizar"}
    </button>
  );
}
```

## 🐛 Debugging

### Ver qué se está sincronizando

1. Abrir DevTools (F12)
2. Ir a Console
3. Realizar una acción (agregar páginas, crear review)
4. Ver logs de sincronización:

```
🔄 [AutoSync] Páginas registradas - Actualizando mascota, perfil y puntos
  → Actualizando mascota...
  → Actualizando perfil de usuario...
  → Actualizando puntos...
✅ [AutoSync] Sincronización completada
```

### Deshabilitar temporalmente

En `syncConfig.js`:

```javascript
global: {
  autoSyncEnabled: false, // Deshabilitar
}
```

## 📞 Soporte

Para problemas o preguntas sobre el sistema de sincronización:

- Revisar logs en consola
- Verificar configuración en `syncConfig.js`
- Revisar middleware en `syncMiddleware.js`

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0.0
