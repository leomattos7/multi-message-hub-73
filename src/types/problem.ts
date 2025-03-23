
export interface ProblemItem {
  id: string;
  name: string;
  cid?: string;
  ciap?: string;
  created_at: string;
}

// Sample CID codes (International Classification of Diseases)
export const cidCodes = [
  { code: "I10", description: "Hipertensão essencial (primária)" },
  { code: "E11", description: "Diabetes mellitus tipo 2" },
  { code: "J45", description: "Asma" },
  { code: "F32", description: "Episódio depressivo" },
  { code: "M54", description: "Dorsalgia" },
  { code: "K29", description: "Gastrite e duodenite" },
  { code: "G43", description: "Enxaqueca" },
  { code: "H40", description: "Glaucoma" },
  { code: "N39", description: "Outros transtornos do trato urinário" },
];

// Sample CIAP codes (International Classification of Primary Care)
export const ciapCodes = [
  { code: "K86", description: "Hipertensão sem complicações" },
  { code: "T90", description: "Diabetes não insulino-dependente" },
  { code: "R96", description: "Asma" },
  { code: "P76", description: "Perturbações depressivas" },
  { code: "L03", description: "Sintomas/queixas lombares" },
  { code: "D87", description: "Alterações funcionais do estômago" },
  { code: "N89", description: "Enxaqueca" },
  { code: "F93", description: "Glaucoma" },
  { code: "U71", description: "Cistite/outras infecções urinárias" },
];
