# 🔄 Guía Rápida: Sistema de Sincronización Automática

## ¿Qué hace?

El sistema mantiene automáticamente sincronizados:

- 🐾 Estado de la mascota (hunger, happiness)
- 👤 Perfil del usuario (puntos, badge, nivel)
- 💰 Resumen de puntos
- ⭐ Lista de reviews

## ¿Cuándo se sincroniza?

✅ **Automáticamente** cuando:

- Registras páginas leídas
- Creas una review
- Editas una review
- Eliminas una review
- Cambias el estado de un libro (ej: TERMINADO)
- Agregas un libro a tu biblioteca

## Uso

### 1. Uso Normal (Automático) ✨

**No necesitas hacer nada especial.** Solo usa las acciones normales:

```jsx
import useLibraryItems from '../hooks/useLibraryItem';

function MyComponent() {
  const { addPages } = useLibraryItems();

  // Esto sincroniza todo automáticamente
  await addPages({ id: bookId, pages: 20 });
  // ✅ Mascota, usuario y puntos ya están actualizados
}
```

### 2. Sincronización Manual (Opcional) 🔧

Si necesitas forzar una sincronización:

```jsx
import useAutoSync from "../hooks/useAutoSync";

function MyComponent() {
  const { syncAll, syncPet, syncUser } = useAutoSync();

  // Sincronizar todo
  const handleRefresh = () => syncAll();

  // O sincronizar partes específicas
  const handleRefreshPet = () => syncPet();
  const handleRefreshUser = () => syncUser();

  return <button onClick={handleRefresh}>Actualizar</button>;
}
```

### 3. Indicador Visual 👁️

El indicador de sincronización ya está incluido globalmente en `App.jsx`.

Aparece automáticamente en la esquina inferior derecha cuando hay sincronización.

Para usarlo en otro componente:

```jsx
import { SyncIndicator } from "../components/ui";

function MyComponent() {
  return (
    <div>
      {/* ... tu contenido */}
      <SyncIndicator
        position="bottom-right" // bottom-right, bottom-left, top-right, top-left
        showOnSync={true} // Mostrar durante sincronización
      />
    </div>
  );
}
```

## Configuración

En `src/config/syncConfig.js`:

```javascript
global: {
  autoSyncEnabled: true,    // Habilitar/deshabilitar sincronización automática
  enableSyncLogs: true,     // Ver logs en consola
  autoSyncDelay: 100,       // Delay antes de sincronizar (ms)
}
```

## Verificar que Funciona

1. Abre la consola del navegador (F12)
2. Realiza una acción (ej: agregar páginas)
3. Verás logs como:

```
🔄 [AutoSync] Páginas registradas - Actualizando mascota, perfil y puntos
  → Actualizando mascota...
  → Actualizando perfil de usuario...
  → Actualizando puntos...
✅ [AutoSync] Sincronización completada
```

4. Verás el indicador visual en la esquina inferior derecha

## Casos de Uso Reales

### ✅ Usuario registra 20 páginas

```
Usuario hace click en "+20 páginas"
  ↓
Se actualiza la librería (optimista)
  ↓
Se sincronizan automáticamente:
  - Mascota (puede haber ganado felicidad)
  - Usuario (puede haber ganado puntos/nivel)
  - Puntos (resumen actualizado)
  ↓
UI refleja todos los cambios sin recargar
```

### ✅ Usuario crea una review

```
Usuario publica review
  ↓
Se agrega la review (optimista)
  ↓
Se sincronizan automáticamente:
  - Lista de reviews del usuario
  - Usuario (puede haber ganado puntos/nivel)
  - Puntos (resumen actualizado)
  ↓
Puede ver su review inmediatamente en "Mis Reviews"
```

## Troubleshooting

### ❌ No veo sincronización automática

1. Verifica que `autoSyncEnabled: true` en `syncConfig.js`
2. Revisa la consola para ver logs
3. Verifica que estás usando las acciones de Redux (no llamadas directas a API)

### ❌ Muchas llamadas duplicadas

El sistema tiene throttling de 3 segundos. Si necesitas ajustarlo:

En `src/store/syncMiddleware.js`:

```javascript
const THROTTLE_TIME = 5000; // Aumentar a 5 segundos
```

### ❌ No veo el indicador visual

Verifica que `SyncIndicator` esté en `App.jsx`:

```jsx
<SyncIndicator position="bottom-right" showOnSync={true} />
```

## 📚 Documentación Completa

Ver `SYNC_SYSTEM.md` para documentación detallada.

---

**¡Eso es todo!** El sistema funciona automáticamente. 🎉
