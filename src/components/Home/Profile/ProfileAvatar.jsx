export const ProfileAvatar = ({ name, level }) => (
  <div className="flex flex-col items-center gap-2 px-6">
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-fuchsia-400 p-[3px]">
      <div className="w-full h-full rounded-full bg-slate-900 grid place-items-center">
        {/* avatar placeholder */}
        <div className="w-14 h-14 rounded-full bg-white/10 cursor-pointer transition hover:scale-105" />
      </div>
    </div>
    <h2 className="text-lg font-semibold">{name}</h2>
    <p className="text-[11px] tracking-widest text-white/60">LEVEL {level}</p>
  </div>
);
