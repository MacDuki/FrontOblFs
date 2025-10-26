import lifeBar from "../../../assets/pets/general/Health Bar.png";
import heart from "../../../assets/pets/general/Heart.png";

function HealthBar({
  health = 3,
  maxHealth = 3,
  className = "",
  showBar = true,
  animated = true,
}) {
  const hearts = Array.from({ length: maxHealth }, (_, index) => {
    const isActive = index < health;
    return (
      <img
        key={index}
        src={heart}
        alt="Heart"
        className={`w-full h-3 object-contain 
          ${
            isActive
              ? "opacity-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]"
              : "opacity-30 grayscale"
          }
          ${animated && isActive ? "animate-heartbeat" : ""}
        `}
        style={
          animated && isActive ? { animationDelay: `${index * 0.05}s` } : {}
        }
      />
    );
  });

  return (
    <div
      className={`flex items-end w-1/3 h-1/3 z-40 absolute 
                     top-[-40px] left-[-20px] 
                     drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)] ${className}`}
    >
      {showBar && (
        <img
          src={lifeBar}
          alt="Life Bar"
          className="w-full h-14 object-contain"
        />
      )}
      <div
        className="flex flex-row gap-1 items-center justify-center 
                      absolute top-7 left-10 w-6 h-6"
      >
        {hearts}
      </div>
    </div>
  );
}

export { HealthBar };
