import { useMemo, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { FiBook, FiBookOpen, FiCheckCircle, FiPlus } from "react-icons/fi";
import useLibraryItems from "../../hooks/useLibraryItem";
// Modal movido a nivel de Collections; este card solo emite eventos.

export default function LibraryItemCard({ item, onRemove, onRequestAddPages }) {
  // Extraer información del libro - Adaptado para la estructura de la API
  const title = item?.titulo || "Sin título";
  const authors = item?.authors?.join(", ") || "Autor desconocido";
  const pageCount = item?.pageCount || 0;
  const progreso = item?.progreso || 0;
  const estado = item?.estado || "NONE";
  const coverUrl = item?.coverUrl;

  // Hook para mutaciones
  const { changeEstado, ESTADOS_LIBRO } = useLibraryItems();

  // Ya no maneja el modal internamente
  const [showEstadoMenu, setShowEstadoMenu] = useState(false);
  // quick/custom moved into AddPagesModal

  // Calcular progreso en porcentaje
  const progressPercent = useMemo(() => {
    if (!pageCount || pageCount === 0) return 0;
    return Math.min(Math.round((progreso / pageCount) * 100), 100);
  }, [progreso, pageCount]);

  // Mapeo de estados a UI
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

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,.3)] group">
      {/* Imagen de portada */}
      <div className="relative h-48 bg-white/5 overflow-hidden">
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Badge de estado */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold 
            flex items-center gap-1 backdrop-blur-sm border shadow-sm ${currentEstado.badgeClasses}`}
        >
          {currentEstado.icon}
          {currentEstado.label}
        </div>

        {/* Botones de acción (aparecen al hover) */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          {/* Botón: Agregar páginas */}
          <button
            onClick={() => onRequestAddPages?.(item)}
            className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors border border-white/20"
            title="Agregar páginas"
          >
            <FiPlus className="w-5 h-5 text-white" />
          </button>
          {onRemove && (
            <button
              onClick={() => onRemove(item._id)}
              className="p-2 bg-red-600/80 backdrop-blur-sm rounded-full hover:bg-red-600 transition-colors border border-red-500/30"
              title="Eliminar"
            >
              <CiTrash className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Badge de estado con menú */}
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowEstadoMenu((v) => !v)}
            className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-sm border shadow-sm ${currentEstado.badgeClasses} cursor-pointer`}
            title="Cambiar estado"
          >
            {currentEstado.icon}
            {currentEstado.label}
          </button>
          {showEstadoMenu && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/15 bg-black/70 backdrop-blur-xl shadow-xl p-2 z-30">
              {[
                ESTADOS_LIBRO.NONE,
                ESTADOS_LIBRO.LEYENDO,
                ESTADOS_LIBRO.TERMINADO,
              ].map((st) => (
                <button
                  key={st}
                  onClick={async () => {
                    try {
                      await changeEstado({ id: item._id, estado: st });
                    } finally {
                      setShowEstadoMenu(false);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    estado === st
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/5"
                  }`}
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

        {/* Modal removido: ahora se renderiza en Collections */}
      </div>

      {/* Información del libro */}
      <div className="p-3 space-y-2">
        <h3
          className="font-semibold text-sm text-white line-clamp-2 min-h-[2.5rem]"
          title={title}
        >
          {title}
        </h3>
        <p className="text-xs text-white/70 truncate" title={authors}>
          {authors}
        </p>

        {/* Barra de progreso */}
        {pageCount > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>
                {progreso} / {pageCount} páginas
              </span>
              <span className="font-semibold text-white/90">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  estado === "TERMINADO"
                    ? "bg-emerald-500"
                    : estado === "LEYENDO"
                    ? "bg-blue-500"
                    : "bg-white/40"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
