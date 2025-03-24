
import { MEASUREMENT_DISPLAY_NAMES, MEASUREMENT_NAMES, MEASUREMENT_UNITS } from "@/components/patient/measurements/constants";

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
    return parseFloat(bmiValue.toFixed(1)); // Display with 1 decimal place
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
    { 
      name: MEASUREMENT_NAMES.WEIGHT, 
      value: weight ?? "-", 
      unit: MEASUREMENT_UNITS.WEIGHT 
    },
    { 
      name: MEASUREMENT_NAMES.HEIGHT, 
      value: height ?? "-", 
      unit: MEASUREMENT_UNITS.HEIGHT 
    },
    { 
      name: MEASUREMENT_NAMES.ABDOMINAL, 
      value: abdominalCircumference ?? "-", 
      unit: MEASUREMENT_UNITS.ABDOMINAL 
    },
    { 
      name: "imc", 
      value: bmi ?? "-", 
      unit: MEASUREMENT_UNITS.BMI 
    }
  ];

  const custom = customMeasurements.map(m => ({
    name: m.name,
    value: m.value,
    unit: m.unit
  }));

  return [...standardMeasurements, ...custom];
};
