import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { CiFolderOn } from "react-icons/ci";

export default function OptionsMinimizedBook({
  children,
  options = [],
  onOptionClick = () => {},
  disabled = false,
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

  const defaultOptions = [
    {
      id: "favorite",
      icon: "❤️",
      label: "Favorito",
      position: "top",
      color: "rose",
    },
    {
      id: "read-later",
      icon: <CiFolderOn />,
      label: "Leer después",
      position: "right",
      color: "blue",
    },
    {
      id: "share",
      icon: "🔗",
      label: "Compartir",
      position: "bottom",
      color: "green",
    },
    {
      id: "info",
      icon: "ℹ️",
      label: "Información",
      position: "left",
      color: "purple",
    },
  ];
  const optionsToShow = options.length > 0 ? options : defaultOptions;

  // Función para obtener colores pastel según el tipo de opción
  const getOptionColors = (option) => {
    const colorMap = {
      favorite: {
        bg: "bg-rose-200",
        hover: "hover:bg-rose-300",
        text: "text-rose-800",
        shadow: "rgba(244, 63, 94, 0.4)",
      },
      "read-later": {
        bg: "bg-blue-200",
        hover: "hover:bg-blue-300",
        text: "text-blue-800",
        shadow: "rgba(59, 130, 246, 0.4)",
      },
      share: {
        bg: "bg-green-200",
        hover: "hover:bg-green-300",
        text: "text-green-800",
        shadow: "rgba(34, 197, 94, 0.4)",
      },
      info: {
        bg: "bg-purple-200",
        hover: "hover:bg-purple-300",
        text: "text-purple-800",
        shadow: "rgba(147, 51, 234, 0.4)",
      },
      // Colores adicionales para opciones personalizadas
      yellow: {
        bg: "bg-yellow-200",
        hover: "hover:bg-yellow-300",
        text: "text-yellow-800",
        shadow: "rgba(245, 158, 11, 0.4)",
      },
      orange: {
        bg: "bg-orange-200",
        hover: "hover:bg-orange-300",
        text: "text-orange-800",
        shadow: "rgba(249, 115, 22, 0.4)",
      },
      pink: {
        bg: "bg-pink-200",
        hover: "hover:bg-pink-300",
        text: "text-pink-800",
        shadow: "rgba(236, 72, 153, 0.4)",
      },
      indigo: {
        bg: "bg-indigo-200",
        hover: "hover:bg-indigo-300",
        text: "text-indigo-800",
        shadow: "rgba(99, 102, 241, 0.4)",
      },
      teal: {
        bg: "bg-teal-200",
        hover: "hover:bg-teal-300",
        text: "text-teal-800",
        shadow: "rgba(20, 184, 166, 0.4)",
      },
    };

    // Usar el color específico de la opción o el ID como fallback, o gris por defecto
    const colorKey = option.color || option.id || "gray";
    return (
      colorMap[colorKey] || {
        bg: "bg-gray-200",
        hover: "hover:bg-gray-300",
        text: "text-gray-800",
        shadow: "rgba(107, 114, 128, 0.4)",
      }
    );
  };

  // offsets radiales en px
  const posToXY = (p) => {
    switch (p) {
      case "top":
        return { x: 0, y: -130 };
      case "right":
        return { x: 90, y: 0 };
      case "bottom":
        return { x: 0, y: 80 };
      case "left":
        return { x: -90, y: 0 };
      default:
        return { x: 0, y: -48 };
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
              className="absolute inset-0 rounded-xl bg-blue-500"
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
              <motion.span
                className="absolute left-1/2 top-1/2 -ml-1 -mt-1 w-2 h-2 rounded-full bg-black"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.16 }}
                style={{ pointerEvents: "none" }}
              />

              {/* contenedor relativo al centro */}
              <div className="absolute left-1/2 top-1/2">
                {optionsToShow.map((option) => {
                  const { x, y } = posToXY(option.position);
                  const colors = getOptionColors(option);
                  return (
                    <div key={option.id} className="relative">
                      <motion.button
                        variants={itemVar(x, y)}
                        onClick={(e) => handleOptionClick(option, e)}
                        onMouseEnter={() =>
                          animationsComplete && setHoveredOption(option.id)
                        }
                        onMouseLeave={() => setHoveredOption(null)}
                        className={`cursor-pointer
                          absolute -left-4 -top-4 w-8 h-8
                          flex items-center justify-center
                          rounded-full text-sm
                          ${colors.bg} ${
                          animationsComplete ? colors.hover : ""
                        } ${colors.text}
                          border border-white/20
                          shadow-lg backdrop-blur-sm
                          transition-[box-shadow,transform,background-color] will-change-transform
                          focus:outline-none focus:ring-2 focus:ring-white/40
                          `}
                        whileHover={
                          animationsComplete
                            ? {
                                scale: 1.1,
                                boxShadow: `0 0 12px ${colors.shadow}`,
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
                            <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-4xl shadow-lg whitespace-nowrap">
                              {option.label}
                              {/* Tooltip arrow */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
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
