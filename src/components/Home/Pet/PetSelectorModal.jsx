/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { MdCheckCircle, MdLock, MdPets } from "react-icons/md";
import { useDispatch } from "react-redux";
import { fetchAllPets, fetchSelectedPet } from "../../../features/pet.slice";
import usePet from "../../../hooks/usePet";
import { Loader } from "../../ui/Loader.jsx";

export default function PetSelectorModal({
  isOpen,
  onClose,
  onActionComplete,
}) {
  const {
    pets,
    selectedPet,
    hunger,
    happiness,
    loading,
    error,
    selectPet,
    clearError,
  } = usePet();
  const dispatch = useDispatch();
  const [focusedId, setFocusedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ SYNC OPTIMIZADO: Solo recargamos cuando el modal se abre
  // No necesitamos recargar en cada apertura si ya tenemos datos recientes
  useEffect(() => {
    if (!isOpen) return;
    // Solo refetch si no tenemos pets o si hace más de 30 segundos
    const needsRefetch = !pets || pets.length === 0;
    if (needsRefetch) {
      console.log("🐾 [PetSelectorModal] Recargando lista de mascotas");
      dispatch(fetchAllPets({ background: true }));
      dispatch(fetchSelectedPet({ background: true }));
    }
  }, [isOpen, dispatch, pets]);

  // Keep focus on selected or first pet
  useEffect(() => {
    if (!isOpen) return;
    if (focusedId) return;
    if (selectedPet?._id) setFocusedId(selectedPet._id);
    else if (pets?.length) setFocusedId(pets[0]._id);
  }, [isOpen, focusedId, selectedPet, pets]);

  const focusedPet = useMemo(
    () => pets?.find((p) => p._id === focusedId) || selectedPet || null,
    [pets, focusedId, selectedPet]
  );

  const idleImage = (pet) =>
    pet?._id
      ? `/src/assets/pets/${pet._id}-idle.gif`
      : "/src/assets/pets/placeholder-idle.gif";

  const handleSelect = async (petId) => {
    if (!petId) return;
    setSubmitting(true);
    // Cerrar el modal inmediatamente para evitar mostrar loaders durante la selección
    onClose?.();
    try {
      await selectPet(petId);
      if (onActionComplete) onActionComplete("select", petId);
    } finally {
      setSubmitting(false);
    }
  };

  const closeAndClear = () => {
    if (error) clearError();
    onClose?.();
  };

  const portalTarget = typeof document !== "undefined" ? document.body : null;

  // Utilidad para convertir valores a porcentaje (acepta 0-1 o 0-100)
  const valueToPercent = (v) => {
    if (v == null) return 0;
    const n = Number(v);
    if (Number.isNaN(n)) return 0;
    const p = n <= 1 ? n * 100 : n;
    return Math.max(0, Math.min(100, p));
  };

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAndClear}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
          />
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="rounded-2xl w-full max-w-4xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl text-white shadow-[0_20px_80px_rgba(0,0,0,.6)] relative"
            >
              {/* Header */}
              <div className="px-6 py-4 relative border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/80">
                  <MdPets size={18} />
                  <h2 className="font-semibold tracking-tight">
                    Gestionar Mascota
                  </h2>
                </div>
                <button
                  onClick={closeAndClear}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all active:scale-95"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-0 md:gap-6 p-6">
                {/* Pets list */}
                <div className="md:col-span-3">
                  {loading && (
                    <Loader className="h-36" icon={<MdPets size={20} />} />
                  )}
                  {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(pets || []).map((pet) => {
                        const isSel = pet._id === selectedPet?._id;
                        const isFocused = pet._id === focusedId;
                        return (
                          <button
                            key={pet._id}
                            onClick={() => setFocusedId(pet._id)}
                            className={`group text-left rounded-xl border p-3 bg-white/5 hover:bg-white/10 transition-all active:scale-[0.99] ${
                              isFocused
                                ? "border-emerald-400/60"
                                : "border-white/10"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={idleImage(pet)}
                                alt={pet.name}
                                className="w-14 h-14 object-contain rounded-lg border border-white/10 bg-white/5"
                                onError={(e) =>
                                  (e.currentTarget.style.visibility = "hidden")
                                }
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-white truncate">
                                    {pet.name}
                                  </p>
                                  {isSel && (
                                    <span className="inline-flex items-center gap-1 text-emerald-300 text-[11px] font-semibold bg-emerald-900/30 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                      <MdCheckCircle /> Seleccionada
                                    </span>
                                  )}
                                </div>
                                <p className="text-white/70 text-xs line-clamp-2">
                                  {pet.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  {pet.isUnlocked ? (
                                    <span className="text-emerald-300 bg-emerald-900/30 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[11px] font-medium">
                                      Desbloqueada
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-white/70 bg-white/10 border border-white/20 px-2 py-0.5 rounded-full text-[11px] font-medium">
                                      <MdLock /> {pet.totalPointsRequired} pts
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {!loading && (!pets || pets.length === 0) && (
                    <div className="text-center text-white/70 text-sm py-10">
                      No hay mascotas para mostrar.
                    </div>
                  )}
                  {error && (
                    <div className="mt-3 text-xs text-red-300">
                      {String(error)}
                    </div>
                  )}
                </div>

                {/* Details & actions */}
                <div className="md:col-span-2 mt-6 md:mt-0">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    {focusedPet ? (
                      <>
                        <div className="flex items-center gap-3">
                          <img
                            src={idleImage(focusedPet)}
                            alt={focusedPet.name}
                            className="w-16 h-16 object-contain rounded-lg border border-white/10 bg-white/5"
                            onError={(e) =>
                              (e.currentTarget.style.visibility = "hidden")
                            }
                          />
                          <div className="min-w-0">
                            <h3 className="font-semibold text-white leading-tight">
                              {focusedPet.name}
                            </h3>
                            <p className="text-xs text-white/70">
                              Requiere {focusedPet.totalPointsRequired} puntos
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-white/80 mt-3">
                          {focusedPet.description}
                        </p>

                        {selectedPet?._id === focusedPet._id && (
                          <div className="mt-4 space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-[11px] text-white/75 mb-1">
                                <span>Hambre</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-white/10 border border-white/10 overflow-hidden">
                                <div
                                  className="h-full bg-emerald-400/80"
                                  style={{
                                    width: `${100 - valueToPercent(hunger)}%`,
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-[11px] text-white/75 mb-1">
                                <span>Felicidad</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-white/10 border border-white/10 overflow-hidden">
                                <div
                                  className="h-full bg-amber-400/80"
                                  style={{
                                    width: `${valueToPercent(happiness)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-5 flex gap-2">
                          <motion.button
                            type="button"
                            whileHover={{
                              scale: focusedPet.isUnlocked ? 1.02 : 1,
                            }}
                            whileTap={{
                              scale: focusedPet.isUnlocked ? 0.98 : 1,
                            }}
                            disabled={!focusedPet.isUnlocked || submitting}
                            onClick={() => handleSelect(focusedPet._id)}
                            className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition shadow ${
                              focusedPet.isUnlocked
                                ? "bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900/40"
                                : "bg-white/10 cursor-not-allowed"
                            }`}
                          >
                            {submitting ? "Guardando..." : "Seleccionar"}
                          </motion.button>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-white/70 py-6 text-center">
                        Selecciona una mascota para ver detalles
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  if (!portalTarget) return content;
  return createPortal(content, portalTarget);
}
