import { Star } from "lucide-react";
import { useState } from "react";

export default function RatingStars({ value = 0, onChange, size = "sm" }) {
  const [hovered, setHovered] = useState(0);
  const starSize = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const bubbleText = size === "sm" ? "text-sm" : "text-base";
  const bubblePad = size === "sm" ? "px-2.5 py-0.5" : "px-3 py-1";
  const bubbleMl = size === "sm" ? "ml-2" : "ml-3";

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-all p-1 rounded-lg hover:bg-amber-50"
        >
          <Star
            className={`${starSize} transition-all duration-200 ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-500 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]"
                : "text-stone-300 fill-transparent hover:text-stone-400"
            }`}
            strokeWidth={2}
          />
        </button>
      ))}
      {value > 0 && (
        <span
          className={`${bubbleMl} ${bubbleText} font-bold text-stone-700 bg-amber-50 ${bubblePad} rounded-full border border-amber-200/50`}
        >
          {value}/5
        </span>
      )}
    </div>
  );
}
