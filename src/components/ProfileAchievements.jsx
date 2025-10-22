import { Achievement } from "./ui";

export const ProfileAchievements = () => (
  <div className="px-6 pt-6 pb-6 space-y-3">
    <p className="text-sm">Achievements</p>

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
  </div>
);
