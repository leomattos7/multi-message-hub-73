
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Measurement, CalculatedMeasurement } from "@/types/measurement";
import { toast } from "@/components/ui/use-toast";

export interface MeasurementForm {
  name: string;
  value: number | string;
  unit: string;
}

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

  // Calculate BMI
  const bmi = useMemo(() => {
    if (weight && height && height > 0) {
      // Convert height from cm to m
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      return parseFloat(bmiValue.toFixed(2));
    }
    return null;
  }, [weight, height]);

  // Fetch measurements
  const { data: measurements, isLoading, refetch } = useQuery({
    queryKey: ["patient-measurements", patientId],
    queryFn: async () => {
      if (!patientId) throw new Error("Patient ID is required");
      
      const { data, error } = await supabase
        .from("measurements")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Measurement[];
    },
    enabled: !!patientId,
  });

  // Initialize state from measurements data
  useEffect(() => {
    if (measurements && measurements.length > 0) {
      // Find standard measurements
      const weightMeasurement = measurements.find(m => m.name === "peso");
      const heightMeasurement = measurements.find(m => m.name === "altura");
      const abdominalMeasurement = measurements.find(m => m.name === "circunferência abdominal");
      
      // Set standard measurements
      if (weightMeasurement) setWeight(weightMeasurement.value);
      if (heightMeasurement) setHeight(heightMeasurement.value);
      if (abdominalMeasurement) setAbdominalCircumference(abdominalMeasurement.value);
      
      // Set custom measurements
      const otherMeasurements = measurements.filter(m => 
        m.name !== "peso" && 
        m.name !== "altura" && 
        m.name !== "circunferência abdominal"
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

  // Save a measurement
  const saveMeasurement = async (name: string, value: number, unit: string) => {
    if (!patientId) {
      toast({
        title: "Erro",
        description: "ID do paciente não encontrado",
        variant: "destructive",
      });
      return;
    }

    if (!name || value === null || value === undefined || isNaN(Number(value))) {
      toast({
        title: "Erro",
        description: "Nome e valor são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("measurements")
        .upsert([
          {
            patient_id: patientId,
            name: name.toLowerCase(),
            value: value,
            unit: unit,
            date: new Date().toISOString(),
          }
        ], {
          onConflict: 'patient_id,name'
        });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Medição salva com sucesso",
      });
      
      await refetch();
    } catch (error) {
      console.error("Erro ao salvar medição:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a medição",
        variant: "destructive",
      });
    }
  };

  // Add a new custom measurement
  const addCustomMeasurement = () => {
    if (!newMeasurement.name || !newMeasurement.value) {
      toast({
        title: "Erro",
        description: "Nome e valor são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const value = Number(newMeasurement.value);
    if (isNaN(value)) {
      toast({
        title: "Erro",
        description: "O valor deve ser um número",
        variant: "destructive",
      });
      return;
    }

    saveMeasurement(
      newMeasurement.name,
      value,
      newMeasurement.unit
    );

    setNewMeasurement({ name: '', value: '', unit: '' });
    setIsAddingMeasurement(false);
  };

  // Update a standard measurement
  const updateMeasurement = (name: string, value: number | null, unit: string) => {
    if (value === null) return;
    saveMeasurement(name, value, unit);
  };

  // All measurements combined for display
  const allMeasurements = useMemo(() => {
    const standardMeasurements: CalculatedMeasurement[] = [
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
      setWeight(value);
      if (value !== null) updateMeasurement("peso", value, "kg");
    },
    setHeight: (value: number | null) => {
      setHeight(value);
      if (value !== null) updateMeasurement("altura", value, "cm");
    },
    setAbdominalCircumference: (value: number | null) => {
      setAbdominalCircumference(value);
      if (value !== null) updateMeasurement("circunferência abdominal", value, "cm");
    },
    isAddingMeasurement,
    setIsAddingMeasurement,
    newMeasurement,
    setNewMeasurement,
    addCustomMeasurement
  };
};
