/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BiCollection } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import useCollections from "../../../hooks/useCollections";
import useLibraryItems from "../../../hooks/useLibraryItem";

export default function CollectionSelectorModal({ book, isOpen, onClose }) {
  const { collections, loading: loadingCollections } = useCollections();
  const { items, add, loading: savingBook } = useLibraryItems();
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [error, setError] = useState(null);

  // Calcular el número de items por colección
  const getItemCount = (collectionId) => {
    return items.filter((item) => item.collectionId === collectionId).length;
  };

  const handleSave = async () => {
    if (!selectedCollectionId) {
      setError("Por favor selecciona una colección");
      return;
    }

    const info = book.volumeInfo || {};

    console.log("📚 Datos del libro completo:", book);
    console.log("📚 volumeInfo:", info);

    // Preparar el payload según la estructura requerida
    // El backend no acepta strings vacíos, así que solo incluimos campos con valores
    const payload = {
      titulo: info.title || "Sin título",
      pageCount: Number(info.pageCount) || 0,
      coverUrl: getCoverImage(info),
      categories: Array.isArray(info.categories) ? info.categories : [],
      authors: Array.isArray(info.authors) ? info.authors : [],
      estado: "NONE",
      collectionId: selectedCollectionId,
      progreso: 0,
      originalBookId: book.id,
    };

    // Solo agregar campos opcionales si tienen valor
    if (info.subtitle && info.subtitle.trim() !== "") {
      payload.subtitle = info.subtitle;
    }

    if (info.publishedDate && info.publishedDate.trim() !== "") {
      payload.publishedDate = info.publishedDate;
    }

    if (info.description && info.description.trim() !== "") {
      payload.desc = info.description;
    }

    console.log("📤 Payload a enviar:", payload);
    console.log("📤 Payload JSON:", JSON.stringify(payload, null, 2));

    try {
      await add(payload);
      onClose();
      setError(null);
      setSelectedCollectionId(null);
    } catch (err) {
      console.error("❌ Error completo:", err);
      console.error("❌ Response data:", err.response?.data);
      console.error("❌ Response status:", err.response?.status);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Error al guardar el libro";

      setError(errorMessage);
    }
  };

  const getCoverImage = (info) => {
    const img = info?.imageLinks;
    if (!img) return "https://via.placeholder.com/300x450?text=No+Cover";
    return (
      img.extraLarge ||
      img.large ||
      img.medium ||
      img.thumbnail ||
      img.smallThumbnail ||
      "https://via.placeholder.com/300x450?text=No+Cover"
    );
  };

  if (!book) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
          />
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl text-white shadow-[0_20px_80px_rgba(0,0,0,.6)] relative"
            >
              {/* Header */}
              <div className="px-6 py-4 relative border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/80">
                  <BiCollection size={18} />
                  <div>
                    <h2 className="font-semibold tracking-tight text-white">
                      Guardar en colección
                    </h2>
                    <p className="text-white/70 text-xs mt-0.5">
                      {book.volumeInfo?.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all active:scale-95"
                  aria-label="Cerrar"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-x-hidden">
                {loadingCollections ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
                  </div>
                ) : collections.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/70">
                      No tienes colecciones creadas aún
                    </p>
                    <p className="text-white/50 text-sm mt-2">
                      Crea una colección primero para guardar libros
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 items-center max-h-[40vh] overflow-y-auto overflow-x-hidden">
                    {collections.map((collection) => {
                      const itemCount = getItemCount(collection._id);
                      const isSelected =
                        selectedCollectionId === collection._id;

                      return (
                        <motion.button
                          key={collection._id}
                          whileTap={{ scale: 0.98 }}
                          whileHover={{
                            boxShadow: "0 8px 24px rgba(16,185,129,.18)",
                            filter: "saturate(1.05)",
                          }}
                          onClick={() =>
                            setSelectedCollectionId(collection._id)
                          }
                          className={`w-3/4 flex items-center justify-between p-4 rounded-xl border transition-all ${
                            isSelected
                              ? "border-emerald-400/60 bg-white/10"
                              : "border-white/10 hover:bg-white/10 hover:border-emerald-400/60 hover:shadow-[0_8px_24px_rgba(16,185,129,.15)] hover:ring-1 hover:ring-emerald-400/30"
                          } `}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isSelected
                                  ? "bg-emerald-600 text-white"
                                  : "bg-white/10 text-white/70"
                              }`}
                            >
                              <BiCollection className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <p
                                className={`font-medium ${
                                  isSelected ? "text-white" : "text-white/90"
                                }`}
                              >
                                {collection.name}
                              </p>
                              <p className="text-sm text-white/60">
                                {itemCount}{" "}
                                {itemCount === 1 ? "libro" : "libros"}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center"
                            >
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg"
                  >
                    <p className="text-red-300 text-sm">{error}</p>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              {collections.length > 0 && (
                <div className="border-t border-white/10 p-4 flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-white/10 rounded-lg text-white/80 hover:bg-white/5 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!selectedCollectionId || savingBook}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {savingBook ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Guardando...
                      </>
                    ) : (
                      "Guardar"
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
