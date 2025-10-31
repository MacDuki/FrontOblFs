// Configuración de mascotas y sus animaciones
export const PET_CONFIGS = {
  cat: {
    idle: {
      src: () => import("../../assets/pets/cat/IDLE.gif"),
      title: "Descansando",
    },
    actions: [
      {
        src: () => import("../../assets/pets/cat/WALK.gif"),
        title: "Caminando",
        duration: 3000, // duración en ms antes de volver a idle
      },
    ],
  },
  main: {
    idle: {
      src: () => import("../../assets/pets/main/IDLE.gif"),
      title: "Descansando",
    },
    actions: [], // Sin acciones adicionales
  },
};

// Tipos de mascotas disponibles
export const PET_TYPES = Object.keys(PET_CONFIGS);

// Función para obtener acciones disponibles de una mascota
export const getPetActions = (petType) => {
  return PET_CONFIGS[petType]?.actions || [];
};

// Función para verificar si una mascota tiene acciones
export const petHasActions = (petType) => {
  return getPetActions(petType).length > 0;
};
