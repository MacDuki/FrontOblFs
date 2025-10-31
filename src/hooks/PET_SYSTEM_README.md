# Sistema de Mascotas - Documentación

## Descripción General

El sistema de mascotas ha sido componentizado para ser escalable y fácil de mantener. Permite manejar diferentes tipos de mascotas con sus respectivas animaciones y acciones.

## Estructura de Componentes

### 1. `PetViewer`

Componente principal para mostrar las animaciones de mascotas.

```jsx
import { PetViewer } from "./components/PetViewer";

<PetViewer
  petType="cat" // Tipo de mascota ('cat', 'main')
  className="h-32 w-auto" // Clases CSS personalizadas
  autoActions={true} // Activar acciones automáticas
  actionInterval={8000} // Intervalo entre acciones (ms)
  onActionComplete={(action) => {
    // Callback al completar acción
    console.log(`Acción completada: ${action}`);
  }}
/>;
```

### 2. `HealthBar`

Componente para mostrar la barra de salud con corazones.

```jsx
import { HealthBar } from "./components/HealthBar";

<HealthBar
  health={2} // Salud actual
  maxHealth={3} // Salud máxima
  animated={true} // Animación de corazones
  showBar={true} // Mostrar barra visual
  className="custom-position" // Clases CSS adicionales
/>;
```

### 3. `PetBackground`

Componente para el fondo del área de la mascota.

```jsx
import { PetBackground } from "./components/PetBackground";
import backgroundImg from "./assets/bg.png";

<PetBackground
  backgroundImage={backgroundImg} // Imagen de fondo
  gradientOverlay={true} // Overlay de gradiente
  backgroundPosition="center" // Posición del fondo
  backgroundSize="cover" // Tamaño del fondo
>
  {/* Contenido hijo */}
</PetBackground>;
```

### 4. `PetHome` (Componente Principal)

Componente que combina todos los elementos.

```jsx
import { PetHome } from "./components/PetHome";

<PetHome
  petType="cat" // Tipo de mascota
  health={3} // Salud actual
  maxHealth={3} // Salud máxima
  autoActions={true} // Acciones automáticas
  onPetActionComplete={(action) => {
    // Callback de acciones
    console.log(`Mascota realizó: ${action}`);
  }}
/>;
```

## Hook Personalizado: `usePet`

Para un control más avanzado del estado de la mascota:

```jsx
import { usePet } from "./components/usePet";

function MyPetComponent() {
  const {
    petType,
    health,
    maxHealth,
    isAlive,
    isHealthy,
    availableActions,
    hasActions,
    changePetType,
    heal,
    damage,
    handleActionComplete,
  } = usePet("cat", 3, 3);

  return (
    <div>
      <PetHome
        petType={petType}
        health={health}
        maxHealth={maxHealth}
        onPetActionComplete={handleActionComplete}
      />

      <div>
        <button onClick={() => damage(1)}>Dañar (-1 HP)</button>
        <button onClick={heal}>Curar (Full HP)</button>
        <button onClick={() => changePetType("main")}>Cambiar Mascota</button>
      </div>
    </div>
  );
}
```

## Configuración de Mascotas

Las mascotas se configuran en `petConfig.js`:

```javascript
export const PET_CONFIGS = {
  cat: {
    idle: {
      src: () => import("../assets/pets/cat/IDLE.gif"),
      title: "Descansando",
    },
    actions: [
      {
        src: () => import("../assets/pets/cat/WALK.gif"),
        title: "Caminando",
        duration: 3000, // ms antes de volver a idle
      },
    ],
  },
  // ... más tipos de mascotas
};
```

## Agregar Nueva Mascota

1. Agregar los assets en `src/assets/pets/[nombre-mascota]/`
2. Actualizar `petConfig.js`:

```javascript
export const PET_CONFIGS = {
  // ... mascotas existentes
  nuevaMascota: {
    idle: {
      src: () => import("../assets/pets/nuevaMascota/IDLE.gif"),
      title: "Descansando",
    },
    actions: [
      {
        src: () => import("../assets/pets/nuevaMascota/ACCION1.gif"),
        title: "Acción 1",
        duration: 2500,
      },
      {
        src: () => import("../assets/pets/nuevaMascota/ACCION2.gif"),
        title: "Acción 2",
        duration: 3500,
      },
    ],
  },
};
```

3. Usar la nueva mascota:

```jsx
<PetHome petType="nuevaMascota" />
```

## Funciones Utilitarias

```javascript
import { getPetActions, petHasActions } from "./components/petConfig";

// Obtener acciones disponibles
const actions = getPetActions("cat"); // [{ src: ..., title: 'Caminando', duration: 3000 }]

// Verificar si tiene acciones
const hasActions = petHasActions("cat"); // true

// Obtener tipos disponibles
import { PET_TYPES } from "./components/petConfig";
console.log(PET_TYPES); // ['cat', 'main']
```

## Características

- ✅ **Carga dinámica**: Los GIFs se cargan bajo demanda usando dynamic imports
- ✅ **Acciones automáticas**: Las mascotas pueden realizar acciones automáticamente
- ✅ **Sistema escalable**: Fácil agregar nuevas mascotas y animaciones
- ✅ **Estados de salud**: Sistema de salud con corazones animados
- ✅ **Callbacks**: Notificaciones cuando se completan acciones
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Optimizado**: Componentes memoizados y efectos controlados

## Ejemplos de Uso Avanzado

### Mascota con Control Manual

```jsx
function ControlledPet() {
  const [petType, setPetType] = useState("cat");

  return (
    <div>
      <PetHome
        petType={petType}
        autoActions={false} // Desactivar acciones automáticas
      />
      <button onClick={() => setPetType("main")}>Cambiar a Main Pet</button>
    </div>
  );
}
```

### Sistema de Batalla

```jsx
function BattlePet() {
  const pet = usePet("cat", 3, 3);

  const attack = () => {
    pet.damage(1);
    // Trigger attack animation
  };

  return (
    <div>
      <PetHome
        petType={pet.petType}
        health={pet.health}
        maxHealth={pet.maxHealth}
        autoActions={pet.isAlive}
      />

      {pet.isAlive ? (
        <button onClick={attack}>Atacar</button>
      ) : (
        <button onClick={pet.heal}>Revivir</button>
      )}
    </div>
  );
}
```
