
/**
 * Calculate BMI (Body Mass Index) from weight and height
 * @param weight Weight in kg
 * @param height Height in cm
 * @returns Calculated BMI value or null if inputs are invalid
 */
export const calculateBMI = (weight: number | null, height: number | null): number | null => {
  if (weight && height && height > 0) {
    // Convert height from cm to m
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    return parseFloat(bmiValue.toFixed(2));
  }
  return null;
};

/**
 * Formats all measurements (standard and custom) into a unified format for display
 */
export const formatAllMeasurements = (
  weight: number | null,
  height: number | null,
  abdominalCircumference: number | null,
  bmi: number | null,
  customMeasurements: { name: string; value: number | string; unit: string }[]
) => {
  const standardMeasurements = [
    { name: "Peso", value: weight ?? "-", unit: "kg" },
    { name: "Altura", value: height ?? "-", unit: "cm" },
    { name: "Circunferência Abdominal", value: abdominalCircumference ?? "-", unit: "cm" },
    { name: "IMC", value: bmi ?? "-", unit: "kg/m²" }
  ];

  const custom = customMeasurements.map(m => ({
    name: m.name,
    value: m.value,
    unit: m.unit
  }));

  return [...standardMeasurements, ...custom];
};
