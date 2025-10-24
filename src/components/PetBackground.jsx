function PetBackground({
  backgroundImage,
  children,
  className = "",
  gradientOverlay = true,
  backgroundPosition = "0% 80%",
  backgroundSize = "100%",
}) {
  return (
    <div
      className={`rounded-3xl rounded-tl-none mt-14 
                  flex flex-col items-center justify-end h-2/3 w-full  
                  justify-self-center bg-cover bg-center relative ${className}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition,
        backgroundSize,
      }}
    >
      {gradientOverlay && (
        <div
          className="absolute inset-0 bg-gradient-to-t 
                        from-black/50 via-transparent to-transparent 
                        rounded-bl-3xl rounded-br-3xl"
        ></div>
      )}
      {children}
    </div>
  );
}

export { PetBackground };
