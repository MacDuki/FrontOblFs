import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { useUser } from "../../../hooks/useUser";
import UploadModal from "../../UploadModal";

export const ProfileAvatar = ({ name, level }) => {
  const { t } = useTranslation();
  const { profile } = useUser();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (profile?.profilePictureUrl) {
      setAvatarUrl(profile.profilePictureUrl);
    }
  }, [profile]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      if (profile?.profilePictureUrl) {
        setAvatarUrl(profile.profilePictureUrl);
      }
    };

    window.addEventListener("profilePictureUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profilePictureUpdated", handleProfileUpdate);
    };
  }, [profile]);
  
  return (
    <>
      <div className="flex flex-col items-center gap-2 px-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-fuchsia-400 p-[3px]">
          <div 
            onClick={() => setIsUploadOpen(true)}
            className="relative w-full h-full rounded-full bg-slate-900 cursor-pointer transition hover:scale-105 overflow-hidden group"
            title="Cambiar foto de perfil"
          >
            {avatarUrl ? (
              <>
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-colors">
                <Plus className="w-8 h-8 text-amber-400 group-hover:text-amber-300 transition-colors" strokeWidth={2.5} />
              </div>
            )}
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
