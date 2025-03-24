
// Standard measurement names
export const MEASUREMENT_NAMES = {
  WEIGHT: "peso",
  HEIGHT: "altura",
  ABDOMINAL: "circunferência abdominal",
};

// Standard measurement units
export const MEASUREMENT_UNITS = {
  WEIGHT: "kg",
  HEIGHT: "cm",
  ABDOMINAL: "cm",
  BMI: "kg/m²",
};

// Display names for measurements (formatted with proper capitalization)
export const MEASUREMENT_DISPLAY_NAMES = {
  [MEASUREMENT_NAMES.WEIGHT]: "Peso",
  [MEASUREMENT_NAMES.HEIGHT]: "Altura",
  [MEASUREMENT_NAMES.ABDOMINAL]: "Circunferência Abdominal",
  "imc": "IMC", // BMI in Portuguese
};

// Predefined units for common measurements
export const COMMON_MEASUREMENT_UNITS = [
  { name: "kg", label: "Quilogramas (kg)" },
  { name: "g", label: "Gramas (g)" },
  { name: "cm", label: "Centímetros (cm)" },
  { name: "mm", label: "Milímetros (mm)" },
  { name: "mmHg", label: "Milímetros de mercúrio (mmHg)" },
  { name: "bpm", label: "Batimentos por minuto (bpm)" },
  { name: "mg/dL", label: "Miligramas por decilitro (mg/dL)" },
  { name: "%", label: "Percentual (%)" },
];

// BMI classification ranges
export const BMI_CLASSIFICATION = {
  UNDERWEIGHT: { min: 0, max: 18.5, label: "Abaixo do peso", color: "text-blue-500" },
  NORMAL: { min: 18.5, max: 25, label: "Peso normal", color: "text-green-500" },
  OVERWEIGHT: { min: 25, max: 30, label: "Sobrepeso", color: "text-yellow-500" },
  OBESE_CLASS_1: { min: 30, max: 35, label: "Obesidade Classe I", color: "text-orange-500" },
  OBESE_CLASS_2: { min: 35, max: 40, label: "Obesidade Classe II", color: "text-red-500" },
  OBESE_CLASS_3: { min: 40, max: Infinity, label: "Obesidade Classe III", color: "text-red-700" },
};

// Function to classify BMI value
export const getBMIClassification = (bmi: number | null) => {
  if (bmi === null) return null;
  
  for (const [key, range] of Object.entries(BMI_CLASSIFICATION)) {
    if (bmi >= range.min && bmi < range.max) {
      return {
        classification: key,
        label: range.label,
        color: range.color
      };
    }
  }
  
  return null;
};
