import { useEffect, useRef, useState } from "react";
import { FiBook, FiBookOpen, FiCheckCircle } from "react-icons/fi";
import useLibraryItems from "../../hooks/useLibraryItem";

/**
 * EstadoSelector
 * Props:
 * - itemId: string (required)
 * - estado: string ('NONE' | 'LEYENDO' | 'TERMINADO')
 * - onChange: (nuevoEstado) => Promise<void> | void (optional override)
 * - className: optional extra classes for root container
 */
export default function EstadoSelector({
  itemId,
  estado = "NONE",
  onChange,
  className = "",
}) {
  const { changeEstado, ESTADOS_LIBRO } = useLibraryItems({
    pollMs: 0,
    refetchOnWindowFocus: false,
    refetchOnVisibility: false,
  });
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const estadoConfig = {
    NONE: {
      label: "Sin empezar",
      icon: <FiBook className="w-4 h-4" />,
      badgeClasses: "bg-gray-500 text-white border-gray-400/30",
    },
    LEYENDO: {
      label: "Leyendo",
      icon: <FiBookOpen className="w-4 h-4" />,
      badgeClasses: "bg-blue-500/20 text-white border-blue-400/30",
    },
    TERMINADO: {
      label: "Terminado",
      icon: <FiCheckCircle className="w-4 h-4" />,
      badgeClasses: "bg-emerald-500/20 text-white border-emerald-400/30",
    },
  };

  const currentEstado = estadoConfig[estado] || estadoConfig.NONE;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleSelect = async (nuevo) => {
    try {
      if (onChange) {
        await onChange(nuevo);
      } else {
        await changeEstado({ id: itemId, estado: nuevo });
      }
    } finally {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className={` relative inline-block text-left ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-sm border shadow-sm ${currentEstado.badgeClasses} cursor-pointer`}
        title="Cambiar estado"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {currentEstado.icon}
        {currentEstado.label}
        <span className="ml-1 text-white/50">▾</span>
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 min-w-full w-max max-w-sm rounded-xl border border-white/15 bg-black/70 backdrop-blur-xl shadow-xl p-2 z-30"
          role="menu"
          aria-label="Seleccionar estado"
          onClick={(e) => e.stopPropagation()}
        >
          {[
            ESTADOS_LIBRO.NONE,
            ESTADOS_LIBRO.LEYENDO,
            ESTADOS_LIBRO.TERMINADO,
          ].map((st) => (
            <button
              key={st}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(st);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                estado === st
                  ? "bg-white/10 text-white"
                  : "text-white/80 hover:bg-white/5"
              }`}
              role="menuitem"
            >
              <span className="shrink-0">{estadoConfig[st]?.icon}</span>
              <span>
                {estadoConfig[st]?.label || st}
                {estado === st ? " •" : ""}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
