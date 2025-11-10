import { useMemo } from "react";
import { CiTrash } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
// import useLibraryItems from "../../hooks/useLibraryItem";
// Modal movido a nivel de Collections; este card solo emite eventos.
import EstadoSelector from "./EstadoSelector";

export default function LibraryItemCard({ item, onRemove, onRequestAddPages }) {
  // Extraer información del libro - Adaptado para la estructura de la API
  const title = item?.titulo || "Sin título";
  const authors = item?.authors?.join(", ") || "Autor desconocido";
  const pageCount = item?.pageCount || 0;
  const progreso = item?.progreso || 0;
  const estado = item?.estado || "NONE";
  const coverUrl = item?.coverUrl;

  // No necesita mutaciones aquí; las maneja EstadoSelector/Collections

  // Ya no maneja el modal internamente ni el menú manualmente
  // quick/custom moved into AddPagesModal

  // Calcular progreso en porcentaje
  const progressPercent = useMemo(() => {
    if (!pageCount || pageCount === 0) return 0;
    return Math.min(Math.round((progreso / pageCount) * 100), 100);
  }, [progreso, pageCount]);

  // Estado visual lo maneja EstadoSelector

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,.3)] group">
      {/* Imagen de portada */}
      <div className="relative h-48 bg-white/5 overflow-hidden">
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full object-contain"
        />
        {/* Badge de estado removido: reemplazado por EstadoSelector */}

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

        {/* Selector de estado componetizado */}
        <div className="absolute top-2 right-2">
          <EstadoSelector itemId={item._id} estado={estado} className="" />
        </div>
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
