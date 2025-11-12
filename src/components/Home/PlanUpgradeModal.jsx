import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Zap, Check } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import api from "../../api/api";

export default function PlanUpgradeModal({ isOpen, onClose, currentPlan, onPlanChanged }) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const normalizedCurrentPlan = typeof currentPlan === 'object' && currentPlan?.name 
    ? currentPlan.name.toLowerCase() 
    : typeof currentPlan === 'string' 
    ? currentPlan.toLowerCase() 
    : null;

  const plans = [
    {
      id: "plus",
      name: "Plus",
      icon: Zap,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      bgGlow: "shadow-blue-500/25",
      features: [
        t('planModal.plusFeatures.reviews'),
        t('planModal.plusFeatures.access'),
        t('planModal.plusFeatures.support')
      ]
    },
    {
      id: "premium",
      name: "Premium",
      icon: Crown,
      color: "from-amber-500 to-orange-500",
      hoverColor: "hover:from-amber-600 hover:to-orange-600",
      bgGlow: "shadow-amber-500/25",
      features: [
        t('planModal.premiumFeatures.reviews'),
        t('planModal.premiumFeatures.access'),
        t('planModal.premiumFeatures.support'),
        t('planModal.premiumFeatures.exclusive')
      ]
    }
  ];

  const handleSelectPlan = async (planId) => {
    setSelectedPlan(planId);
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {

      const { data } = await api.patch("/user", { plan: planId });
      
      
      setSuccess(t('planModal.success'));
      
      if (onPlanChanged) {
        onPlanChanged(planId);
      }

      setTimeout(() => {
        setSuccess(null);
        handleClose();
      }, 2000);
    } catch (err) {
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          "Error al cambiar el plan";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setSelectedPlan(null);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setError(null);
    setSuccess(null);
    setSelectedPlan(null);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-gradient-to-br from-stone-900/40 via-stone-900/60 to-black/70 backdrop-blur-md z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-gradient-to-br from-stone-50 to-stone-100/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-stone-200/60 relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-600" />
              
              <div className="px-8 py-6 relative backdrop-blur-sm bg-white/40 border-b border-stone-200/50">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="absolute right-4 top-5 p-2 rounded-lg hover:bg-stone-900/5 transition-all group active:scale-95 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-stone-600 group-hover:text-stone-900 transition-colors" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                    <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                      {t('planModal.title')}
                    </h2>
                  </div>
                </div>
                {normalizedCurrentPlan && (
                  <p className="text-stone-600 text-sm mt-2 font-medium">
                    {t('planModal.currentPlan')} <span className="font-bold capitalize">{normalizedCurrentPlan}</span>
                  </p>
                )}
              </div>

              <div className="px-8 py-7 space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                  >
                    <svg 
                      className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
                  >
                    <Check className="w-5 h-5 text-emerald-500" />
                    <p className="text-sm text-emerald-700 font-medium">{success}</p>
                  </motion.div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {plans.map((plan) => {
                    const Icon = plan.icon;
                    const isSelected = selectedPlan === plan.id;
                    const isCurrent = normalizedCurrentPlan === plan.id;
                    
                    return (
                      <motion.button
                        key={plan.id}
                        onClick={() => !isSubmitting && !isCurrent && handleSelectPlan(plan.id)}
                        disabled={isSubmitting || isCurrent}
                        whileHover={{ scale: isCurrent ? 1 : 1.02 }}
                        whileTap={{ scale: isCurrent ? 1 : 0.98 }}
                        className={`
                          relative p-6 rounded-2xl border-2 transition-all text-left
                          ${isCurrent 
                            ? 'border-emerald-500 bg-emerald-50/50 cursor-default' 
                            : 'border-stone-200 hover:border-stone-300 bg-white/60'
                          }
                          ${isSubmitting && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                          disabled:cursor-not-allowed
                        `}
                      >
                        {isCurrent && (
                          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {t('planModal.current')}
                          </div>
                        )}
                        
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg ${plan.bgGlow}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-stone-900 mb-2">{plan.name}</h3>
                        
                        <ul className="space-y-2">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-stone-600">
                              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        {isSelected && (
                          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-stone-600">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-stone-300 border-t-stone-600 rounded-full"
                            />
                            {t('planModal.activating')}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <p className="text-xs text-center text-stone-500 mt-4">
                    {t('planModal.demoNote')}
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
