import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload as UploadIcon, Image as ImageIcon, Check, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getProfile } from "../features/user.slice";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";
import api from "../api/api";

const UploadModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [portalEl, setPortalEl] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const schema = Joi.object({
    image: Joi.any()
      .required()
      .custom((value, helpers) => {
        if (!value || value.length === 0) {
          return helpers.error("any.required");
        }
        const file = value[0];
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
          return helpers.error("any.invalid");
        }
        if (file.size > 2 * 1024 * 1024) {
          return helpers.error("any.max");
        }
        return value;
      })
      .messages({
        "any.required": t("uploadModal.required"),
        "any.invalid": t("uploadModal.invalidType"),
        "any.max": t("uploadModal.maxSize"),
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: joiResolver(schema),
  });

  useEffect(() => {
    let el = document.getElementById("app-modal-root");
    if (!el) {
      el = document.createElement("div");
      el.setAttribute("id", "app-modal-root");
      document.body.appendChild(el);
    }
    setPortalEl(el);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    setLoading(true);
    setUrl("");
    setUploadProgress(0);

    const file = data.image[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "obligatorio");
    formData.append("cloud_name", "dirhxotoy");

    try {
      setUploadProgress(20);
      
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dirhxotoy/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      
      setUploadProgress(100);
      const imageUrl = res.data.secure_url;
      setUrl(imageUrl);

      await api.patch("/user/profile-picture", {
        profilePictureUrl: imageUrl
      });

      dispatch(getProfile());
      window.dispatchEvent(new Event("profilePictureUpdated"));
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error("Error al subir imagen:", err);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setUrl("");
    setUploadProgress(0);
    setSelectedFileName("");
    onClose();
  };

  if (!isOpen || !portalEl) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
              className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-700/50 relative"
            >
              
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

              
              <div className="px-6 py-5 relative border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-[2px]">
                    <div className="w-full h-full rounded-[10px] bg-slate-900 grid place-items-center">
                      <ImageIcon className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {t("uploadModal.title")}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {t("uploadModal.subtitle")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-slate-800 transition-all group active:scale-95"
                >
                  <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </button>
              </div>

              
              <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-5">  
                <div className="relative">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border-2 border-dashed border-slate-700 hover:border-amber-500/50 transition-all group">
                    <label className="flex flex-col items-center gap-4 cursor-pointer">
                      <motion.div 
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-[3px]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="w-full h-full rounded-full bg-slate-900 grid place-items-center">
                          <UploadIcon className="w-8 h-8 text-amber-400 group-hover:text-amber-300 transition-colors" />
                        </div>
                      </motion.div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-white">
                          {selectedFileName || t("uploadModal.selectImage")}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {t("uploadModal.dragAndDrop")}
                        </p>
                      </div>
                      <input
                        type="file"
                        {...register("image", {
                          onChange: (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedFileName(file.name);
                            }
                          }
                        })}
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp"
                      />
                    </label>
                  </div>
                </div>

                {/* Barra de progreso */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300 font-medium">{t("uploadModal.uploading")}</span>
                      <span className="text-amber-400 font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Error */}
                {errors.image && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium flex items-start gap-2"
                  >
                    <span className="text-red-400 text-lg">⚠</span>
                    <span>{errors.image.message}</span>
                  </motion.div>
                )}

                {/* Preview exitoso */}
                {url && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 p-6"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <img
                          src={url.replace(
                            "/upload/",
                            "/upload/c_scale,w_300/f_auto/q_auto/"
                          )}
                          alt="upload"
                          className="w-32 h-32 rounded-full object-cover border-4 border-green-500/30 shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-500 grid place-items-center shadow-lg">
                          <Check className="w-6 h-6 text-white" strokeWidth={3} />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-base font-bold text-green-400 flex items-center gap-2 justify-center">
                          <Check className="w-5 h-5" />
                          {t("uploadModal.uploadSuccess")}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {t("uploadModal.savingChanges")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 px-5 py-3 border border-slate-700 rounded-xl text-slate-300 font-semibold hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("uploadModal.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("uploadModal.uploadingAction")}
                      </>
                    ) : (
                      <>
                        <UploadIcon className="w-4 h-4" />
                        {t("uploadModal.uploadImage")}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    portalEl
  );
};

export default UploadModal;
