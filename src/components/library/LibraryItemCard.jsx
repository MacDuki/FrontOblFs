import { useMemo } from "react";
import { CgDetailsMore } from "react-icons/cg";
import { CiTrash } from "react-icons/ci";
import { FiBook, FiBookOpen, FiCheckCircle } from "react-icons/fi";

export default function LibraryItemCard({ item, onRemove, onViewDetails }) {
  // Extraer información del libro - Adaptado para la estructura de la API
  const title = item?.titulo || "Sin título";
  const authors = item?.authors?.join(", ") || "Autor desconocido";
  const pageCount = item?.pageCount || 0;
  const progreso = item?.progreso || 0;
  const estado = item?.estado || "NONE";
  const coverUrl = item?.coverUrl;

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
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      borderColor: "border-gray-300",
    },
    LEYENDO: {
      label: "Leyendo",
      icon: <FiBookOpen className="w-4 h-4" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-300",
    },
    TERMINADO: {
      label: "Terminado",
      icon: <FiCheckCircle className="w-4 h-4" />,
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-300",
    },
  };

  const currentEstado = estadoConfig[estado] || estadoConfig.NONE;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group">
      {/* Imagen de portada */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Badge de estado */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold 
            flex items-center gap-1 ${currentEstado.bgColor} ${currentEstado.textColor} 
            border ${currentEstado.borderColor} shadow-sm`}
        >
          {currentEstado.icon}
          {currentEstado.label}
        </div>

        {/* Botones de acción (aparecen al hover) */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(item)}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="Ver detalles"
            >
              <CgDetailsMore className="w-5 h-5 text-gray-700" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={() => onRemove(item._id)}
              className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              title="Eliminar"
            >
              <CiTrash className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Información del libro */}
      <div className="p-3 space-y-2">
        <h3
          className="font-semibold text-sm text-gray-900 line-clamp-2 min-h-[2.5rem]"
          title={title}
        >
          {title}
        </h3>
        <p className="text-xs text-gray-600 truncate" title={authors}>
          {authors}
        </p>

        {/* Barra de progreso */}
        {pageCount > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>
                {progreso} / {pageCount} páginas
              </span>
              <span className="font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  estado === "TERMINADO"
                    ? "bg-green-500"
                    : estado === "LEYENDO"
                    ? "bg-blue-500"
                    : "bg-gray-400"
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
