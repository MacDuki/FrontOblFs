/**
 * Conjunto de gradientes predeterminados hermosos y con buen contraste
 */
const GRADIENT_PRESETS = [
  {
    name: "sunset",
    gradient:
      "linear-gradient(135deg, #ff6b6b 0%, #ff8e53 35%, #ff6b9d 70%, #c44569 100%)",
    textColor: "white",
  },
  {
    name: "ocean",
    gradient:
      "linear-gradient(135deg, #667eea 0%, #764ba2 35%, #667eea 70%, #5a67d8 100%)",
    textColor: "white",
  },
  {
    name: "forest",
    gradient:
      "linear-gradient(135deg, #11998e 0%, #38ef7d 35%, #2dd4bf 70%, #059669 100%)",
    textColor: "white",
  },
  {
    name: "royal",
    gradient:
      "linear-gradient(135deg, #8b5cf6 0%, #a855f7 35%, #c084fc 70%, #7c3aed 100%)",
    textColor: "white",
  },
  {
    name: "warm",
    gradient:
      "linear-gradient(135deg, #f59e0b 0%, #f97316 35%, #ea580c 70%, #dc2626 100%)",
    textColor: "white",
  },
  {
    name: "rose",
    gradient:
      "linear-gradient(135deg, #ec4899 0%, #f43f5e 35%, #be185d 70%, #9d174d 100%)",
    textColor: "white",
  },
  {
    name: "emerald",
    gradient:
      "linear-gradient(135deg, #10b981 0%, #059669 35%, #047857 70%, #065f46 100%)",
    textColor: "white",
  },
  {
    name: "sky",
    gradient:
      "linear-gradient(135deg, #0ea5e9 0%, #0284c7 35%, #0369a1 70%, #075985 100%)",
    textColor: "white",
  },
];

export const selectGradientForBook = (bookId, bookTitle = "") => {
  const identifier = bookId || bookTitle || "default";

  // Crear un hash simple del identificador
  const hash = identifier.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  // Seleccionar gradiente basado en el hash
  const index = Math.abs(hash) % GRADIENT_PRESETS.length;
  return GRADIENT_PRESETS[index];
};
/**
 * Hook personalizado para seleccionar gradientes predeterminados
 */
import { useEffect, useState } from "react";

export const useBookGradient = (bookId, bookTitle = "") => {
  const [gradient, setGradient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Simular un pequeño delay para la transición suave
    const timeoutId = setTimeout(() => {
      const selectedGradient = selectGradientForBook(bookId, bookTitle);
      setGradient(selectedGradient);
      setLoading(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [bookId, bookTitle]);

  return { gradient, loading };
};
