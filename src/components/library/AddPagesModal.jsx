import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";

/**
 * AddPagesModal
 *
 * Props:
 * - open: boolean -> whether the modal is visible
 * - progreso: number -> current pages read
 * - pageCount: number -> total pages of the book
 * - onClose: () => void -> close handler
 * - onConfirm: (pagesToAdd: number) => Promise<void> | void -> confirm handler
 */
export default function AddPagesModal({
  open,
  progreso = 0,
  pageCount = 0,
  onClose,
  onConfirm,
}) {
  const { t } = useTranslation();
  const [quickPages, setQuickPages] = useState(10);
  const [customPages, setCustomPages] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [portalEl, setPortalEl] = useState(null);

  // Create (or reuse) a portal root for modals
  useEffect(() => {
    let el = document.getElementById("app-modal-root");
    if (!el) {
      el = document.createElement("div");
      el.setAttribute("id", "app-modal-root");
      document.body.appendChild(el);
    }
    setPortalEl(el);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  if (!open || !portalEl) return null;

  const remaining = Math.max((pageCount || 0) - (progreso || 0), 0);

  const handleConfirm = async () => {
    if (remaining <= 0) return;

    const custom = parseInt(customPages, 10);
    const desired = Number.isFinite(custom) && custom > 0 ? custom : quickPages;
    if (!desired || desired <= 0) return;

    const pagesToAdd = Math.min(desired, remaining);

    try {
      setSubmitting(true);
      await onConfirm?.(pagesToAdd);
      onClose?.();
    } catch (e) {
      console.error("No se pudieron agregar páginas", e);
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-xs rounded-xl border border-white/15 bg-black/60 backdrop-blur-xl shadow-2xl p-4 text-white">
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 rounded-full hover:bg-white/10 text-white/80"
          aria-label="Cerrar"
          title="Cerrar"
        >
          <FiX className="w-4 h-4" />
        </button>

        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm">{t('addPagesModal.title')}</h4>
            <p className="text-xs text-white/70">
              {t('addPagesModal.currentProgress')}: {progreso} / {pageCount}
            </p>
            {remaining <= 0 && (
              <p className="mt-1 text-xs text-emerald-300/80">
                {t('addPagesModal.maxReached')}
              </p>
            )}
          </div>

          {/* Opciones rápidas */}
          <div className="grid grid-cols-3 gap-2">
            {[10, 20, 30].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setQuickPages(n);
                  setCustomPages("");
                }}
                disabled={submitting || remaining <= 0}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                  quickPages === n && customPages === ""
                    ? "bg-emerald-500/30 border-emerald-400/40"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                } ${remaining <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                +{n}
              </button>
            ))}
          </div>

          {/* Input personalizado */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              step={1}
              placeholder={t('addPagesModal.custom')}
              value={customPages}
              onChange={(e) => {
                const v = e.target.value;
                setCustomPages(v);
                if (v) setQuickPages(0);
              }}
              disabled={submitting || remaining <= 0}
              className="w-32 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
            />
            <span className="text-xs text-white/60">{t('books.pages')}</span>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-3 py-2 rounded-lg text-sm border border-white/10 text-white/80 hover:bg-white/10 disabled:opacity-60"
            >
              {t('addPagesModal.cancel')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting || remaining <= 0}
              className="px-3 py-2 rounded-lg text-sm bg-emerald-500/80 hover:bg-emerald-500 text-black font-semibold disabled:opacity-60"
            >
              {submitting ? t('addPagesModal.saving') : t('addPagesModal.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, portalEl);
}
