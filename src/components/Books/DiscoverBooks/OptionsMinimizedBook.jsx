// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { CgDetailsMore } from "react-icons/cg";
import { CiFolderOn, CiStar, CiTrash } from "react-icons/ci";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { IoAdd } from "react-icons/io5";

export default function OptionsMinimizedBook({
  children,
  options = [],
  onOptionClick = () => {},
  disabled = false,
  variant = "discover", // "discover" | "collections"
}) {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [animationsComplete, setAnimationsComplete] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const containerRef = useRef(null);

  // cerrar con click fuera + Esc
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOptionsVisible(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOptionsVisible(false);
    };

    if (isOptionsVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOptionsVisible]);

  const handleCardClick = (originalOnClick) => {
    if (disabled) return;
    if (!isOptionsVisible) {
      setIsOptionsVisible(true);
      setAnimationsComplete(false);
      // Habilitar hover después de que termine la animación
      setTimeout(() => {
        setAnimationsComplete(true);
      }, 200); // Duración ligeramente mayor que la animación
    } else {
      originalOnClick?.();
      setIsOptionsVisible(false);
      setAnimationsComplete(false);
    }
  };

  const handleOptionClick = (option, event) => {
    event.stopPropagation();
    onOptionClick(option);
    setIsOptionsVisible(false);
  };

  // Variant-based default option sets
  const discoverOptions = [
    {
      id: "details",
      icon: <CgDetailsMore />,
      label: "Ver detalles",
      position: "left",
    },
    {
      id: "add-to-collection",
      icon: <CiFolderOn />,
      label: "Añadir a colección",
      position: "right",
    },
    {
      id: "view-reviews",
      icon: <CiStar />,
      label: "Ver reviews",
      position: "bottom",
    },
  ];

  const collectionsOptions = [
    { id: "delete", icon: <CiTrash />, label: "Eliminar", position: "left" },
    {
      id: "make-review",
      icon: <HiOutlinePencilSquare />,
      label: "Hacer review",
      position: "bottom",
    },
    {
      id: "view-review",
      icon: <CiStar />,
      label: "Ver reviews",
      position: "right",
    },
    {
      id: "add-pages",
      icon: <IoAdd />,
      label: "Agregar páginas leídas",
      position: "top",
    },
  ];

  const variantDefaults =
    variant === "collections" ? collectionsOptions : discoverOptions;
  const optionsToShow = options.length > 0 ? options : variantDefaults;

  // Función para obtener colores pastel según el tipo de opción
  // Removed per visual alignment: all option chips use a neutral glass style

  // offsets radiales en px
  const posToXY = (p) => {
    switch (p) {
      case "top":
        return { x: 0, y: -70 };
      case "right":
        return { x: 40, y: 0 };
      case "bottom":
        return { x: 0, y: 40 };
      case "left":
        return { x: -40, y: 0 };
      default:
        return { x: 0, y: -40 };
    }
  };

  // variants
  const overlayVar = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.12, transition: { duration: 0.12 } },
    exit: { opacity: 0, transition: { duration: 0.12 } },
  };

  const ringVar = {
    hidden: { scale: 0.85, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
      },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.12 },
    },
  };

  const itemVar = (x, y) => ({
    hidden: { x: 0, y: 0, scale: 0.3, opacity: 0, filter: "blur(4px)" },
    visible: {
      x,
      y,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: { type: "linear", duration: 0.1 },
    },
    exit: {
      x: 0,
      y: 0,
      scale: 0.2,
      opacity: 0,
      transition: { duration: 0.12 },
    },
  });

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Card con leve lift al abrir */}
      <motion.div
        animate={isOptionsVisible ? { scale: 1.015 } : { scale: 1 }}
        transition={{ type: "spring" }}
        className={isOptionsVisible ? "relative z-20" : "relative z-10"}
      >
        {React.cloneElement(children, {
          onClick: () => handleCardClick(children.props.onClick),
        })}
      </motion.div>

      {/* Capa + opciones */}
      <AnimatePresence>
        {isOptionsVisible && (
          <>
            {/* overlay sutil */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-green-300"
              variants={overlayVar}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ pointerEvents: "none" }}
            />

            {/* ring centrado que expande items */}
            <motion.div
              className="absolute inset-0 z-30"
              variants={ringVar}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* punto central */}

              {/* contenedor relativo al centro */}
              <div className="absolute left-1/2 top-1/2">
                {optionsToShow.map((option) => {
                  const { x, y } = posToXY(option.position);
                  return (
                    <div key={option.id} className="relative">
                      <motion.button
                        variants={itemVar(x, y)}
                        onClick={(e) => handleOptionClick(option, e)}
                        onMouseEnter={() =>
                          animationsComplete && setHoveredOption(option.id)
                        }
                        onMouseLeave={() => setHoveredOption(null)}
                        className={`cursor-pointer absolute -left-4 -top-4 w-8 h-8
                          flex items-center justify-center rounded-full text-sm
                          bg-white text-stone-700 border border-stone-200/70 shadow-md backdrop-blur-xl
                          
                          transition-[box-shadow,transform,background-color] will-change-transform focus:outline-none focus:ring-2 focus:ring-amber-400/30`}
                        whileHover={
                          animationsComplete
                            ? {
                                scale: 1.08,
                                boxShadow: `0 6px 16px rgba(0,0,0,0.12)`,
                              }
                            : {}
                        }
                        whileTap={{ scale: 0.95 }}
                      >
                        {option.icon}
                      </motion.button>

                      {/* Custom Tooltip */}
                      <AnimatePresence>
                        {hoveredOption === option.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
                          >
                            <div className="bg-stone-900 text-white text-xs px-3 py-1.5 rounded-4xl shadow-lg whitespace-nowrap">
                              {option.label}
                              {/* Tooltip arrow */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-stone-900 rotate-45 -mt-1"></div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
