import { useTranslation } from "react-i18next";
import { Achievement } from "../../ui";

export const ProfileAchievements = () => {
  const { t } = useTranslation();
  
  return (
    <div className="px-6 py-6 space-y-3">
      <p className="text-sm cursor-pointer transition hover:scale-105">
        {t('profile.achievements')} <span className="pl-2">0/3</span>
      </p>
      <ul className="max-h-56 overflow-y-auto pr-2 scrollbar-hide space-y-3">
        <Achievement
          icon={<span className="text-xl">❄️</span>}
          title={t('profile.questChampion')}
          subtitle={t('profile.completeAllQuests')}
          value={3}
          total={8}
          barColor="from-sky-400 via-indigo-400 to-fuchsia-400"
        />
        <Achievement
          icon={<span className="text-xl">🔑</span>}
          title={t('profile.keysCollection')}
          subtitle={t('profile.findHiddenKeys')}
          value={4}
          total={5}
          barColor="from-amber-400 via-orange-400 to-rose-400"
        />
        <Achievement
          icon={<span className="text-xl">✦</span>}
          title={t('profile.stars')}
          subtitle={t('profile.collectStars')}
          value={2}
          total={10}
          barColor="from-fuchsia-400 via-pink-400 to-rose-400"
        />
        <li className="text-center text-xs text-white/40 pt-3 select-none mb-54">
          {t('profile.noMoreAchievements')}
        </li>
      </ul>
    </div>
  );
};
