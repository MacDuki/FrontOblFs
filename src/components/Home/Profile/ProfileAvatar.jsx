import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import UploadModal from "../../UploadModal";

export const ProfileAvatar = ({ name, level }) => {
  const { t } = useTranslation();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Cargar imagen desde localStorage
  useEffect(() => {
    const loadAvatar = () => {
      const savedUrl = localStorage.getItem("profilePicture");
      setAvatarUrl(savedUrl);
    };

    loadAvatar();

    // Escuchar actualizaciones de la foto de perfil
    const handleProfileUpdate = () => {
      loadAvatar();
    };

    window.addEventListener("profilePictureUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profilePictureUpdated", handleProfileUpdate);
    };
  }, []);
  
  return (
    <>
      <div className="flex flex-col items-center gap-2 px-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-fuchsia-400 p-[3px]">
          <div className="w-full h-full rounded-full bg-slate-900 grid place-items-center">
            <div 
              onClick={() => setIsUploadOpen(true)}
              className="w-14 h-14 rounded-full bg-white/10 cursor-pointer transition hover:scale-105 hover:bg-white/20 overflow-hidden" 
              title="Cambiar foto de perfil"
            >
              {avatarUrl && (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-[11px] tracking-widest text-white/60">{t('profile.level').toUpperCase()} {level}</p>
      </div>

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
      />
    </>
  );
};
