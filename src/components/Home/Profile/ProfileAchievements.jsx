import { Achievement } from "../../ui";

export const ProfileAchievements = () => (
  <div className="px-6 py-6 space-y-3">
    <p className="text-sm cursor-pointer transition hover:scale-105">
      Achievements <span className="pl-2">0/3</span>
    </p>
    <ul className="max-h-56 overflow-y-auto pr-2 scrollbar-hide space-y-3">
      <Achievement
        icon={<span className="text-xl">❄️</span>}
        title="Quest Champion"
        subtitle="Complete all the quests"
        value={3}
        total={8}
        barColor="from-sky-400 via-indigo-400 to-fuchsia-400"
      />
      <Achievement
        icon={<span className="text-xl">🔑</span>}
        title="Keys Collection"
        subtitle="Find hidden keys"
        value={4}
        total={5}
        barColor="from-amber-400 via-orange-400 to-rose-400"
      />
      <Achievement
        icon={<span className="text-xl">✦</span>}
        title="Stars"
        subtitle="Collect stars"
        value={2}
        total={10}
        barColor="from-fuchsia-400 via-pink-400 to-rose-400"
      />
      <li className="text-center text-xs text-white/40 pt-3 select-none mb-54">
        No more achievements available
      </li>
    </ul>
  </div>
);
