import { Badge } from "./ui";

export const ProfileBadges = () => (
  <div className="px-6 pt-6">
    <div className="flex items-center justify-between">
      <p className="text-sm cursor-pointer transition hover:scale-105">
        Badges
      </p>
      <button className="text-[11px] text-white/60 cursor-pointer transition hover:scale-105">
        See All
      </button>
    </div>
    <div className="mt-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
      <Badge />
      <Badge gradient="from-yellow-200 via-amber-300 to-orange-400" />
      <Badge gradient="from-sky-300 via-indigo-400 to-violet-500" />
      <Badge gradient="from-fuchsia-300 via-pink-400 to-rose-400" />
      <Badge gradient="from-emerald-300 via-teal-400 to-cyan-400" />
    </div>
  </div>
);
