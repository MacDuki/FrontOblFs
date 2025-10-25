export const Loader = ({ icon, className = "", size = 48, iconSize = 20 }) => {
  const loaderSize = `${size}px`;
  return (
    <div
      className={`flex items-center justify-center animate-fade-in ${className}`}
    >
      <div className="relative">
        {/* Círculo de fondo */}
        <div
          className="animate-spin rounded-full border-2 border-white/20"
          style={{ width: loaderSize, height: loaderSize }}
        ></div>

        {/* Círculo de progreso */}
        <div
          className="animate-spin rounded-full border-t-2 border-white/80 absolute top-0 left-0"
          style={{ width: loaderSize, height: loaderSize }}
        ></div>

        {/* Fondo con pulse */}
        <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse"></div>

        {/* Icono centrado */}
        {icon && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/60"
            style={{ fontSize: `${iconSize}px` }}
          >
            {icon}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-in;
        }
      `}</style>
    </div>
  );
};
