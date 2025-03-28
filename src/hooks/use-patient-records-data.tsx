
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { MedicalRecord } from "@/types/patient";
import { mockMedicalRecords, getMockData } from "@/utils/mock-data-provider";

export const usePatientRecordsData = (patientId?: string, recordType: string = "all") => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  
  const { 
    isLoading: recordsLoading, 
    refetch: refetchRecords 
  } = useQuery({
    queryKey: ["patient-records", patientId, recordType],
    queryFn: async () => {
      if (!patientId) throw new Error("Patient ID is required");
      
      // Filter records based on patient ID and record type
      let filteredRecords = mockMedicalRecords.filter(
        record => record.patient_id === patientId
      );
      
      if (recordType !== "all") {
        filteredRecords = filteredRecords.filter(
          record => record.record_type === recordType
        );
      }
      
      // Sort by creation date, newest first
      filteredRecords.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setRecords(filteredRecords as MedicalRecord[]);
      return filteredRecords as MedicalRecord[];
    },
    enabled: !!patientId,
  });

  const createRecord = useCallback(async (content: string, type: string) => {
    if (!patientId || !content.trim()) {
      throw new Error("Patient ID and content are required");
    }

    const currentDate = new Date().toISOString();
    
    const newRecord = {
      id: `record-${Date.now()}`,
      patient_id: patientId,
      record_date: currentDate,
      record_type: type,
      content: content,
      created_at: currentDate,
      updated_at: currentDate
    };
    
    setRecords(prev => [newRecord as MedicalRecord, ...prev]);
    await refetchRecords();
    return true;
  }, [patientId, refetchRecords]);

  const deleteRecord = useCallback(async (recordId: string) => {
    if (!patientId || !recordId) {
      throw new Error("Patient ID and record ID are required");
    }
    
    setRecords(prev => prev.filter(record => record.id !== recordId));
    await refetchRecords();
    return true;
  }, [patientId, refetchRecords]);

  return {
    records,
    recordsLoading,
    refetchRecords,
    createRecord,
    deleteRecord
  };
};
