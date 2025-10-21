import { motion } from "framer-motion";

export default function RevealBannerButton({ banner }) {
  return (
    <motion.button
      initial={{
        backgroundImage: `url(${banner})`,
        backgroundSize: "150%",
        backgroundPosition: "50% 80%",
        filter: "grayscale(100%)",
        scale: 0.9,
      }}
      whileHover={{
        backgroundSize: "80%",
        filter: "grayscale(0%)",
        boxShadow: "0px 0px 40px 8px rgba(107,47,74,0.6)", // tono #6B2F4A de tu paleta
        scale: 1.06,
      }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-72 h-32 md:w-76 md:h-30 rounded-2xl overflow-hidden 
                  border-white/20 shadow-2xl bg-center bg-cover 
                 flex items-center justify-center  cursor-pointer select-none "
    >
      {/* Texto con color del banner “debajo” usando background-clip:text */}
      <div className="relative flex items-center gap-3">
        <motion.span
          initial={{ x: 0, opacity: 1 }}
          whileHover={{ x: -80, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl md:text-4xl font-extrabold tracking-wide"
          style={{
            backgroundImage: `url(${banner})`,
            backgroundSize: "150%",
            backgroundPosition: "center",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextStroke: "0.6px rgba(255,255,255,0.6)",
          }}
        >
          Start
        </motion.span>

        <motion.span
          initial={{ x: 0, opacity: 1 }}
          whileHover={{ x: 80, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl md:text-4xl font-extrabold tracking-wide"
          style={{
            backgroundImage: `url(${banner})`,
            backgroundSize: "150%",
            backgroundPosition: "center",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextStroke: "0.6px rgba(255,255,255,0.6)",
          }}
        >
          Journey
        </motion.span>
      </div>

      {/* Velo para contraste, se desvanece al hover */}
      <motion.div
        initial={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        whileHover={{ backgroundColor: "rgba(0,0,0,0)" }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Halo animado sutil al hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-white/10 via-white/5 to-transparent blur"
      />
    </motion.button>
  );
}

/*
Uso:
<RevealBannerButton banner={banner} />

Efectos:
- El botón inicia pequeño, en B&N y con el banner recortado (backgroundSize 150%).
- Al hover: se expande (scale 1.06), muestra color, y el banner se ajusta a 100%.
- El texto “Continue” se desliza a la izquierda y “Journey” a la derecha mientras desaparecen.
- El color del banner aparece “detrás” del texto con background-clip:text, sincronizado con la imagen de fondo.
*/
