// utils/textRanking.js
export function rankDescription(desc = "") {
  // 1) Normaliza comillas y separadores
  const clean = desc
    .replace(/[“”]/g, '"')
    .replace(/[«»]/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  // 2) Corta por puntuación fuerte y también por "—", ":" que suelen abrir ideas clave
  const rawChunks = clean
    .split(/(?<=[\.\?\!])\s+|—\s+| -\s+|:\s+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  // 3) Scoring por señales de puntuación y forma
  const KEYWORDS_AWARD =
    /(premio|nobel|galardon|galardón|the new york times|mejor|importante|lista)/i;
  const QUOTE = /"([^"]+)"/g;

  const scored = rawChunks.map((txt, i) => {
    const len = txt.length;
    const quotes = [...txt.matchAll(QUOTE)].length;
    const capsTokens = (txt.match(/\b[A-ZÁÉÍÓÚÑ]{3,}\b/g) || []).length;
    const numbers = (txt.match(/\b\d{2,4}\b|%\b/g) || []).length;
    const commas = (txt.match(/,/g) || []).length;
    const colons = (txt.match(/:/g) || []).length;
    const semicol = (txt.match(/;/g) || []).length;
    const awards = KEYWORDS_AWARD.test(txt) ? 1 : 0;

    // Heurística
    let score = 0;
    score += quotes * 3; // citas explícitas
    score += awards * 3; // premios/listas
    score += capsTokens * 2; // énfasis por MAYÚSCULAS
    score += numbers * 1.5; // fechas, cantidades
    score += Math.min(commas, 3); // enumeraciones
    score += semicol * 1; // ideas compuestas
    score += colons * 1; // definiciones
    if (len >= 60 && len <= 180) score += 2; // densidad informativa buena
    if (i <= 1) score += 1.5; // posición temprana
    return { txt, score, index: i };
  });

  // 4) Ordena por score desc, para empates prioriza aparición temprana
  scored.sort((a, b) => b.score - a.score || a.index - b.index);
  return scored; // [{txt, score, index}]
}
