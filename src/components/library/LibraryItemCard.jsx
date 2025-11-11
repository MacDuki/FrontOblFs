import { useMemo } from "react";
// import useLibraryItems from "../../hooks/useLibraryItem";
// Modal movido a nivel de Collections; este card solo emite eventos.
import OptionsMinimizedBook from "../Books/DiscoverBooks/OptionsMinimizedBook";
import EstadoSelector from "./EstadoSelector";

export default function LibraryItemCard({
  item,
  onRemove,
  onRequestAddPages,
  onRequestViewReviews,
  onRequestMakeReview,
}) {
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

  // Manejar clic en opciones
  const handleOptionClick = (option) => {
    switch (option.id) {
      case "delete":
        onRemove?.(item._id);
        break;
      case "add-pages":
        onRequestAddPages?.(item);
        break;
      case "make-review":
        onRequestMakeReview?.(item);
        break;
      case "view-review":
        onRequestViewReviews?.(item);
        break;
      default:
        break;
    }
  };

  return (
    <OptionsMinimizedBook
      options={[]}
      onOptionClick={handleOptionClick}
      variant="collections"
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,.3)] cursor-pointer">
        {/* Imagen de portada */}
        <div className="relative h-48 bg-white/5 overflow-hidden">
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-contain"
          />

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
    </OptionsMinimizedBook>
  );
}
