
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MeasurementForm } from "@/types/measurement";
import { fetchPatientMeasurements, saveMeasurement } from "@/services/measurements-service";
import { calculateBMI, formatAllMeasurements } from "@/utils/measurements-utils";
import { MEASUREMENT_NAMES, MEASUREMENT_UNITS } from "@/components/patient/measurements/constants";

export const usePatientMeasurements = (patientId?: string) => {
  const [weight, setWeight] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [abdominalCircumference, setAbdominalCircumference] = useState<number | null>(null);
  const [customMeasurements, setCustomMeasurements] = useState<MeasurementForm[]>([]);
  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [newMeasurement, setNewMeasurement] = useState<MeasurementForm>({ 
    name: '', 
    value: '', 
    unit: '' 
  });

  // Calculate BMI using the utility function
  const bmi = useMemo(() => calculateBMI(weight, height), [weight, height]);

  // Fetch measurements
  const { data: measurements, isLoading, refetch } = useQuery({
    queryKey: ["patient-measurements", patientId],
    queryFn: () => fetchPatientMeasurements(patientId!),
    enabled: !!patientId,
  });

  // Initialize state from measurements data
  useEffect(() => {
    if (measurements && measurements.length > 0) {
      // Find standard measurements
      const weightMeasurement = measurements.find(m => m.name === MEASUREMENT_NAMES.WEIGHT);
      const heightMeasurement = measurements.find(m => m.name === MEASUREMENT_NAMES.HEIGHT);
      const abdominalMeasurement = measurements.find(m => m.name === MEASUREMENT_NAMES.ABDOMINAL);
      
      // Set standard measurements
      if (weightMeasurement) setWeight(weightMeasurement.value);
      if (heightMeasurement) setHeight(heightMeasurement.value);
      if (abdominalMeasurement) setAbdominalCircumference(abdominalMeasurement.value);
      
      // Set custom measurements
      const otherMeasurements = measurements.filter(m => 
        m.name !== MEASUREMENT_NAMES.WEIGHT && 
        m.name !== MEASUREMENT_NAMES.HEIGHT && 
        m.name !== MEASUREMENT_NAMES.ABDOMINAL
      );
      
      if (otherMeasurements.length > 0) {
        setCustomMeasurements(otherMeasurements.map(m => ({
          name: m.name,
          value: m.value,
          unit: m.unit
        })));
      }
    }
  }, [measurements]);

  // Update a standard measurement
  const updateMeasurement = async (name: string, value: number | null, unit: string) => {
    if (value === null) return;
    const success = await saveMeasurement(patientId!, name, value, unit);
    if (success) await refetch();
  };

  // Add a new custom measurement
  const addCustomMeasurement = async () => {
    if (!newMeasurement.name || !newMeasurement.value) {
      return;
    }

    const value = Number(newMeasurement.value);
    if (isNaN(value)) {
      return;
    }

    const success = await saveMeasurement(
      patientId!,
      newMeasurement.name,
      value,
      newMeasurement.unit
    );

    if (success) {
      setNewMeasurement({ name: '', value: '', unit: '' });
      setIsAddingMeasurement(false);
      await refetch();
    }
  };

  // All measurements combined for display
  const allMeasurements = useMemo(() => 
    formatAllMeasurements(weight, height, abdominalCircumference, bmi, customMeasurements),
  [weight, height, abdominalCircumference, bmi, customMeasurements]);

  return {
    weight,
    height,
    abdominalCircumference,
    bmi,
    customMeasurements,
    allMeasurements,
    isLoading,
    setWeight: (value: number | null) => {
      setWeight(value);
      if (value !== null) updateMeasurement(MEASUREMENT_NAMES.WEIGHT, value, MEASUREMENT_UNITS.WEIGHT);
    },
    setHeight: (value: number | null) => {
      setHeight(value);
      if (value !== null) updateMeasurement(MEASUREMENT_NAMES.HEIGHT, value, MEASUREMENT_UNITS.HEIGHT);
    },
    setAbdominalCircumference: (value: number | null) => {
      setAbdominalCircumference(value);
      if (value !== null) updateMeasurement(MEASUREMENT_NAMES.ABDOMINAL, value, MEASUREMENT_UNITS.ABDOMINAL);
    },
    isAddingMeasurement,
    setIsAddingMeasurement,
    newMeasurement,
    setNewMeasurement,
    addCustomMeasurement
  };
};
