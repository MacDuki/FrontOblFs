import React, { useEffect, useRef, useState } from "react";

export default function OptionsMinimizedBook({
  children,
  options = [],
  onOptionClick = () => {},
  disabled = false,
}) {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const containerRef = useRef(null);

  // Cerrar opciones al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOptionsVisible(false);
      }
    };

    if (isOptionsVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOptionsVisible]);

  const handleCardClick = (originalOnClick) => {
    if (disabled) return;

    if (!isOptionsVisible) {
      setIsOptionsVisible(true);
    } else {
      // Si las opciones están visibles y se hace click en el card, ejecutar la acción original
      if (originalOnClick) {
        originalOnClick();
      }
      setIsOptionsVisible(false);
    }
  };

  const handleOptionClick = (option, event) => {
    event.stopPropagation();
    onOptionClick(option);
    setIsOptionsVisible(false);
  };

  // Opciones por defecto si no se proporcionan
  const defaultOptions = [
    { id: "favorite", icon: "❤️", label: "Favorito", position: "top" },
    { id: "read-later", icon: "📚", label: "Leer después", position: "right" },
    { id: "share", icon: "🔗", label: "Compartir", position: "bottom" },
    { id: "info", icon: "ℹ️", label: "Información", position: "left" },
  ];

  const optionsToShow = options.length > 0 ? options : defaultOptions;

  // Posiciones para las opciones alrededor del card
  const getOptionPosition = (position) => {
    const positions = {
      top: "top-[-40px] left-1/2 transform -translate-x-1/2",
      right: "right-[-40px] top-1/2 transform -translate-y-1/2",
      bottom: "bottom-[-40px] left-1/2 transform -translate-x-1/2",
      left: "left-[-40px] top-1/2 transform -translate-y-1/2",
    };

    return positions[position] || positions.top;
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block transition-all duration-300"
    >
      {/* Wrapper del BookCard */}
      <div
        className={`relative transition-all duration-300 ${
          isOptionsVisible ? "z-20" : "z-10"
        }`}
      >
        {React.cloneElement(children, {
          onClick: () => handleCardClick(children.props.onClick),
        })}
      </div>

      {/* Opciones miniaturizadas */}
      {isOptionsVisible && (
        <>
          {/* Overlay sutil para destacar el elemento activo */}
          <div className="absolute inset-0 bg-blue-500/10 rounded-xl pointer-events-none z-10" />

          {/* Opciones alrededor del card */}
          {optionsToShow.map((option, index) => (
            <button
              key={option.id}
              className={`absolute ${getOptionPosition(option.position)} 
                bg-gray-800 hover:bg-gray-700 text-white rounded-full 
                w-8 h-8 flex items-center justify-center text-sm
                shadow-lg border border-gray-600 hover:border-gray-500
                transition-all hover:scale-110 z-30
                animate-in slide-in-from-top-2`}
              onClick={(e) => handleOptionClick(option, e)}
              title={option.label}
              style={{
                animationDelay: `${index * 50}ms`,
                animationDuration: "200ms",
              }}
            >
              {option.icon}
            </button>
          ))}

          {/* Indicador central opcional */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         w-2 h-2 bg-blue-500 rounded-full z-25 pointer-events-none
                         animate-pulse"
          />
        </>
      )}
    </div>
  );
}
