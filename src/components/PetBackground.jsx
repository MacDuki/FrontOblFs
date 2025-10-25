import { useState } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
function PetBackground({
  backgroundImage,
  children,
  className = "",
  backgroundPosition = "0% 80%",
  backgroundSize = "100%",
}) {
  const [isBackgroundImageVisible, setIsBackgroundImageVisible] =
    useState(true);

  return (
    <div
      className={`rounded-3xl rounded-tl-none mt-5 
                  flex flex-col items-center justify-end h-2/3 w-full  
                  justify-self-center relative gap-3 ${className}`}
    >
      <button
        className="cursor-pointer absolute top-[-25px] left-[-10px] z-20 px-2 py-1 "
        onClick={() => {
          setIsBackgroundImageVisible(!isBackgroundImageVisible);
        }}
      >
        {isBackgroundImageVisible ? (
          <FaEyeSlash className="text-white/70 hover:text-white" size={20} />
        ) : (
          <FaRegEye className="text-white/70 hover:text-white" size={20} />
        )}
      </button>
      <div
        className="absolute inset-0 rounded-3xl rounded-tl-none bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition,
          backgroundSize,
          transition: "opacity 0.5s ease-in-out",
          opacity: isBackgroundImageVisible ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
}

export { PetBackground };
