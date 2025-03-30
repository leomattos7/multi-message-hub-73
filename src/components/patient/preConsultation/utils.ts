
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HistoricalDataMap, ParameterHistoryItem } from "./types";

export const formatDateLocal = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
};

// Get historic data for a parameter and sort by date (newest first)
export const getParameterHistory = (id: string, historicalData: HistoricalDataMap): ParameterHistoryItem[] => {
  const history = historicalData[id] || [];
  
  // Sort history by date, newest first
  return [...history].sort((a, b) => {
    return new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime();
  });
};
