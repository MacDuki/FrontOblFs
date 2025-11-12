import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animaciones personalizadas */}
      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
        @keyframes float3 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(1.02)} }
        @keyframes float4 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes bounceSlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .animate-float1{ animation: float1 6s ease-in-out infinite; }
        .animate-float2{ animation: float2 7s ease-in-out infinite; }
        .animate-float3{ animation: float3 5.5s ease-in-out infinite; }
        .animate-float4{ animation: float4 8s ease-in-out infinite; }
        .animate-bounce-slow{ animation: bounceSlow 3.5s ease-in-out infinite; }
      `}</style>

      <div className="relative w-full max-w-4xl px-6">
        {/* “Libros” flotantes */}
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-lg bg-violet-500/20 animate-float1" />
        <div className="absolute top-1/4 -right-10 w-32 h-32 rounded-lg bg-pink-500/20 animate-float2" />
        <div className="absolute bottom-20 left-10 w-24 h-24 rounded-lg bg-violet-500/20 animate-float3" />
        <div className="absolute bottom-1/3 -right-5 w-28 h-28 rounded-lg bg-pink-500/20 animate-float4" />

        {/* Contenido principal */}
        <div className="relative z-10 text-center">
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 animate-bounce">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('notFound.title')}
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            {t('notFound.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-violet-500/30 flex items-center justify-center gap-2"
            >
              {/* Icono Home (SVG inline) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l9-7 9 7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 21V9h6v12"
                />
              </svg>
              {t('notFound.returnHome')}
            </button>

            <button
              onClick={() => navigate("/home")}
              className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-pink-500/30 flex items-center justify-center gap-2"
            >
              {/* Icono Search (SVG inline) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35"
                />
                <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" />
              </svg>
              {t('notFound.goToHome')}
            </button>
          </div>
        </div>

        {/* “Personaje” libro animado */}
        <div className="absolute bottom-0 right-10 w-40 h-40">
          <div className="relative w-full h-full animate-bounce-slow">
            <div className="absolute inset-0 bg-yellow-400 rounded-lg rotate-12" />
            <div className="absolute inset-0 bg-yellow-500 rounded-lg -rotate-6" />
            <div className="absolute inset-0 bg-yellow-600 rounded-lg rotate-3" />
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Icono Book-open (SVG inline) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6c-2-1.333-4-2-6-2v14c2 0 4 .667 6 2m0-14c2-1.333 4-2 6-2v14c-2 0-4 .667-6 2m0-14v14"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { NotFound };
