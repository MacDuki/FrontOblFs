# 🔧 Configuración de Sincronización - Cambios Aplicados

## ⚠️ Problema Identificado

Se estaban realizando **demasiadas llamadas automáticas a la API** en segundo plano debido a:

- Polling cada 15 segundos en `libraryItems` y `collections`
- Revalidación automática al cambiar foco de ventana
- Revalidación automática al cambiar visibilidad de pestaña
- Múltiples hooks haciendo las mismas llamadas

---

## ✅ Solución Implementada

### 1. **Archivo de Configuración Centralizado**

**Ubicación:** `src/config/syncConfig.js`

Este archivo contiene toda la configuración de sincronización en un solo lugar:

```javascript
export const SYNC_CONFIG = {
  libraryItems: {
    pollMs: 0, // ❌ DESHABILITADO (era 15000)
    refetchOnWindowFocus: false, // ❌ DESHABILITADO (era true)
    refetchOnVisibility: false, // ❌ DESHABILITADO (era true)
    syncOnMount: true, // ✅ Solo sincroniza al montar el componente
  },
  collections: {
    pollMs: 0, // ❌ DESHABILITADO (era 15000)
    refetchOnWindowFocus: false, // ❌ DESHABILITADO (era true)
    refetchOnVisibility: false, // ❌ DESHABILITADO (era true)
    syncOnMount: true, // ✅ Solo sincroniza al montar el componente
  },
  // ... otras configuraciones
};
```

### 2. **Sistema de Throttling**

Se agregó una función `shouldMakeCall()` que previene llamadas duplicadas en menos de 5 segundos.

### 3. **Logging de Sincronización**

Todos los logs de sincronización ahora tienen emojis para fácil identificación:

- 🔄 = Sincronización activa
- ⏸️ = Función deshabilitada
- 📚 = Respuesta de API (libraryItems)
- ❌ = Error

---

## 📁 Archivos Modificados

### ✏️ Creados

- `src/config/syncConfig.js` - Configuración centralizada

### ✏️ Modificados

1. **`src/hooks/useLibraryItem.js`**

   - Importa configuración desde `syncConfig.js`
   - Valores por defecto ahora vienen de `SYNC_CONFIG`
   - Agregado throttling para prevenir llamadas duplicadas
   - Agregado logging condicional

2. **`src/hooks/useCollections.js`**

   - Importa configuración desde `syncConfig.js`
   - Valores por defecto ahora vienen de `SYNC_CONFIG`
   - Agregado throttling para prevenir llamadas duplicadas
   - Agregado logging condicional

3. **`src/features/libraryItem.slice.js`**
   - Agregado console.log para todas las respuestas de API
   - Logs con contexto (id, páginas, estado, etc.)

---

## 🎯 Resultado Esperado

### Antes (Comportamiento Anterior)

```
Cada 15 segundos: ❌ API call a libraryItems
Cada 15 segundos: ❌ API call a collections
Al cambiar ventana: ❌ API call a libraryItems
Al cambiar ventana: ❌ API call a collections
Al cambiar pestaña: ❌ API call a libraryItems
Al cambiar pestaña: ❌ API call a collections
```

**Resultado:** ~24 llamadas innecesarias por minuto 😱

### Ahora (Nuevo Comportamiento)

```
Al montar componente: ✅ API call inicial a libraryItems
Al montar componente: ✅ API call inicial a collections
Al hacer acción (add/delete/update): ✅ API call específica
Refetch manual: ✅ Disponible via refetch()
```

**Resultado:** Solo llamadas necesarias 🎉

---

## 🔧 Cómo Ajustar la Configuración

### Para Reactivar Polling (Si es necesario)

Edita `src/config/syncConfig.js`:

```javascript
libraryItems: {
  pollMs: 60000,  // 1 minuto (en lugar de 0)
  // ...
}
```

### Para Reactivar Revalidación por Foco

```javascript
libraryItems: {
  refetchOnWindowFocus: true,  // Solo en pantallas críticas
  // ...
}
```

### Para Deshabilitar Logs

```javascript
global: {
  enableSyncLogs: false,  // Sin logs en consola
}
```

---

## 📊 Monitoreo

Para ver la actividad de sincronización en la consola:

1. Abre DevTools (F12)
2. Ve a la pestaña Console
3. Busca logs con estos emojis:
   - 🔄 = Sincronización
   - ⏸️ = Deshabilitado
   - 📚 = API response
   - ❌ = Errores

---

## 🚀 Próximos Pasos Recomendados

1. **Implementar Pull-to-Refresh en móvil**

   - Permite al usuario refrescar manualmente

2. **Cache de datos**

   - Guardar en localStorage/sessionStorage para menor dependencia de API

3. **WebSockets (futuro)**

   - Para actualizaciones en tiempo real sin polling

4. **Service Worker**
   - Para sincronización en background cuando la app esté cerrada

---

## ⚙️ Configuración Recomendada por Pantalla

```javascript
// Pantalla de Library (uso frecuente)
useLibraryItems(); // Usa config por defecto

// Pantalla de estadísticas (raramente cambia)
useLibraryItems({
  pollMs: 0,
  refetchOnWindowFocus: false,
});

// Modal de edición (necesita datos frescos)
useLibraryItems({
  syncOnMount: true, // Refetch al abrir modal
});
```

---

## 🐛 Troubleshooting

### "Los datos no se actualizan"

✅ Usa el método `refetchUser()` del hook manualmente:

```javascript
const { refetchUser } = useLibraryItems();
// Después de una acción importante
await refetchUser();
```

### "Veo muchos logs en consola"

✅ Deshabilita logs en `syncConfig.js`:

```javascript
global: {
  enableSyncLogs: false;
}
```

### "Necesito polling en una pantalla específica"

✅ Pasa config personalizada:

```javascript
useLibraryItems({ pollMs: 30000 }); // 30 segundos
```

---

**Fecha:** 4 de Noviembre, 2025
**Estado:** ✅ Implementado y funcionando
