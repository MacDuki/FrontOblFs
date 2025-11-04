// Configuración de mascotas y sus animaciones
export const PET_CONFIGS = {
  cat: {
    idle: {
      src: () => import("../../assets/pets/cat/IDLE.gif"),
      title: "Descansando",
    },
    
  },
  main: {
    idle: {
      src: () => import("../../assets/pets/main/IDLE.gif"),
      title: "Descansando",
    },
   
  },
};


export const PET_TYPES = Object.keys(PET_CONFIGS);

