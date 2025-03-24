
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MeasurementForm } from "@/types/measurement";
import { fetchPatientMeasurements, saveMeasurement } from "@/services/measurements-service";
import { calculateBMI, formatAllMeasurements } from "@/utils/measurements-utils";
import { MEASUREMENT_NAMES, MEASUREMENT_UNITS } from "@/components/patient/measurements/constants";
import { toast } from "@/components/ui/use-toast";

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
  const bmi = useMemo(() => {
    console.log("BMI calculation triggered with:", { weight, height });
    return calculateBMI(weight, height);
  }, [weight, height]);

  // Fetch measurements
  const { data: measurements, isLoading, refetch } = useQuery({
    queryKey: ["patient-measurements", patientId],
    queryFn: () => fetchPatientMeasurements(patientId!),
    enabled: !!patientId,
  });

  // Initialize state from measurements data
  useEffect(() => {
    if (measurements && measurements.length > 0) {
      console.log("Measurements loaded:", measurements);
      
      // Find standard measurements
      const weightMeasurement = measurements.find(m => m.name === MEASUREMENT_NAMES.WEIGHT);
      const heightMeasurement = measurements.find(m => m.name === MEASUREMENT_NAMES.HEIGHT);
      const abdominalMeasurement = measurements.find(m => m.name === MEASUREMENT_NAMES.ABDOMINAL);
      
      // Set standard measurements - ensure they're parsed as numbers
      if (weightMeasurement) setWeight(Number(weightMeasurement.value));
      if (heightMeasurement) setHeight(Number(heightMeasurement.value));
      if (abdominalMeasurement) setAbdominalCircumference(Number(abdominalMeasurement.value));
      
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
    if (!patientId || value === null) {
      toast({
        title: "Erro",
        description: "Dados incompletos para salvar a medição",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Updating measurement:", { name, value, unit });
    const success = await saveMeasurement(patientId, name, value, unit);
    if (success) {
      await refetch();
    }
  };

  // Add a new custom measurement
  const addCustomMeasurement = async () => {
    if (!patientId || !newMeasurement.name || !newMeasurement.value) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos da medição",
        variant: "destructive",
      });
      return;
    }

    const value = Number(newMeasurement.value);
    if (isNaN(value)) {
      toast({
        title: "Erro",
        description: "O valor da medição deve ser um número válido",
        variant: "destructive",
      });
      return;
    }

    const success = await saveMeasurement(
      patientId,
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
  const allMeasurements = useMemo(() => {
    const result = formatAllMeasurements(weight, height, abdominalCircumference, bmi, customMeasurements);
    console.log("All measurements formatted:", result);
    return result;
  }, [weight, height, abdominalCircumference, bmi, customMeasurements]);

  return {
    weight,
    height,
    abdominalCircumference,
    bmi,
    customMeasurements,
    allMeasurements,
    isLoading,
    setWeight: (value: number | null) => {
      const numericValue = value !== null ? Number(value) : null;
      setWeight(numericValue);
      if (numericValue !== null) {
        updateMeasurement(MEASUREMENT_NAMES.WEIGHT, numericValue, MEASUREMENT_UNITS.WEIGHT);
      }
    },
    setHeight: (value: number | null) => {
      const numericValue = value !== null ? Number(value) : null;
      setHeight(numericValue);
      if (numericValue !== null) {
        updateMeasurement(MEASUREMENT_NAMES.HEIGHT, numericValue, MEASUREMENT_UNITS.HEIGHT);
      }
    },
    setAbdominalCircumference: (value: number | null) => {
      const numericValue = value !== null ? Number(value) : null;
      setAbdominalCircumference(numericValue);
      if (numericValue !== null) {
        updateMeasurement(MEASUREMENT_NAMES.ABDOMINAL, numericValue, MEASUREMENT_UNITS.ABDOMINAL);
      }
    },
    isAddingMeasurement,
    setIsAddingMeasurement,
    newMeasurement,
    setNewMeasurement,
    addCustomMeasurement,
    refetchMeasurements: () => refetch()
  };
};
