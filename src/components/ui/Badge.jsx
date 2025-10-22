export const Badge = ({
  gradient = "from-amber-300 via-yellow-400 to-orange-500",
}) => (
  <div
    className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} p-[2px] `}
  >
    <div className="w-full h-full rounded-full bg-slate-900 grid place-items-center  ">
      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradient}`} />
    </div>
  </div>
);
