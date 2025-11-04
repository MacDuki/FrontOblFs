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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition"
              >
                <IoClose className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <BiCollection className="w-8 h-8 text-white" />
                <div>
                  <h2 className="text-white text-xl font-bold">
                    Guardar en colección
                  </h2>
                  <p className="text-white/80 text-sm">
                    {book.volumeInfo?.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {loadingCollections ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : collections.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    No tienes colecciones creadas aún
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Crea una colección primero para guardar libros
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                  {collections.map((collection) => {
                    const itemCount = getItemCount(collection._id);
                    const isSelected = selectedCollectionId === collection._id;

                    return (
                      <motion.button
                        key={collection._id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCollectionId(collection._id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isSelected
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <BiCollection className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p
                              className={`font-medium ${
                                isSelected ? "text-blue-900" : "text-gray-900"
                              }`}
                            >
                              {collection.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {itemCount} {itemCount === 1 ? "libro" : "libros"}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
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
                  className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {collections.length > 0 && (
              <div className="border-t border-gray-200 p-4 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!selectedCollectionId || savingBook}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
