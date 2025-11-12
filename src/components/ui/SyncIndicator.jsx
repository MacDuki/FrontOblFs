/**
 * SyncIndicator - Indicador visual de sincronización
 *
 * Muestra un indicador discreto cuando se están sincronizando datos
 * Puede usarse en cualquier parte de la aplicación
 */

import { AnimatePresence, motion as Motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { IoRefreshCircleOutline } from "react-icons/io5";
import useAutoSync from "../../hooks/useAutoSync";

export default function SyncIndicator({
  position = "bottom-right", // bottom-right, bottom-left, top-right, top-left
  showOnSync = true, // Mostrar automáticamente cuando hay sincronización
  alwaysVisible = false, // Siempre visible (útil para debug)
}) {
  const { isAnythingLoading } = useAutoSync();
  const [showSuccess, setShowSuccess] = useState(false);
  const [wasLoading, setWasLoading] = useState(false);

  useEffect(() => {
    if (isAnythingLoading) {
      setWasLoading(true);
      setShowSuccess(false);
    } else if (wasLoading && !isAnythingLoading) {
      // Acabó de cargar, mostrar éxito
      setShowSuccess(true);
      setWasLoading(false);

      // Ocultar después de 2 segundos
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAnythingLoading, wasLoading]);

  const shouldShow =
    alwaysVisible || (showOnSync && (isAnythingLoading || showSuccess));

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <Motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className={`fixed ${positionClasses[position]} z-[9999] pointer-events-none`}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl">
            {isAnythingLoading ? (
              <>
                <Motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <IoRefreshCircleOutline className="w-5 h-5 text-emerald-400" />
                </Motion.div>
                <span className="text-sm font-medium text-white/90">
                  Sincronizando...
                </span>
              </>
            ) : showSuccess ? (
              <>
                <Motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <FiCheck className="w-5 h-5 text-emerald-400" />
                </Motion.div>
                <span className="text-sm font-medium text-white/90">
                  Sincronizado
                </span>
              </>
            ) : null}
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
