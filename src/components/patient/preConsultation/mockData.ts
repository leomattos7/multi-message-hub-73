
import { HistoricalDataMap, ParameterGroup } from "./types";

// Mock historical data for each parameter
export const historicalData: HistoricalDataMap = {
  "1": [
    { value: "70 kg", collectedAt: new Date(2023, 11, 15).toISOString() },
    { value: "71 kg", collectedAt: new Date(2023, 10, 20).toISOString() },
    { value: "73 kg", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "2": [
    { value: "174 cm", collectedAt: new Date(2023, 10, 15).toISOString() },
    { value: "175 cm", collectedAt: new Date(2023, 6, 10).toISOString() },
  ],
  "3": [
    { value: "118/78 mmHg", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "120/82 mmHg", collectedAt: new Date(2023, 10, 5).toISOString() },
    { value: "125/85 mmHg", collectedAt: new Date(2023, 9, 1).toISOString() },
    { value: "130/90 mmHg", collectedAt: new Date(2023, 8, 15).toISOString() },
  ],
  "4": [
    { value: "36.7 °C", collectedAt: new Date(2023, 11, 5).toISOString() },
    { value: "37.1 °C", collectedAt: new Date(2023, 10, 20).toISOString() },
    { value: "36.5 °C", collectedAt: new Date(2023, 9, 10).toISOString() },
  ],
  "5": [
    { value: "72 bpm", collectedAt: new Date(2023, 11, 5).toISOString() },
    { value: "76 bpm", collectedAt: new Date(2023, 10, 15).toISOString() },
    { value: "75 bpm", collectedAt: new Date(2023, 9, 1).toISOString() },
  ],
  "6": [
    { value: "15 irpm", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "16 irpm", collectedAt: new Date(2023, 9, 15).toISOString() },
  ],
  "7": [
    { value: "97%", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "98%", collectedAt: new Date(2023, 9, 5).toISOString() },
    { value: "96%", collectedAt: new Date(2023, 7, 20).toISOString() },
  ],
  "8": [
    { value: "92 mg/dL", collectedAt: new Date(2023, 11, 5).toISOString() },
    { value: "95 mg/dL", collectedAt: new Date(2023, 9, 10).toISOString() },
    { value: "98 mg/dL", collectedAt: new Date(2023, 7, 15).toISOString() },
    { value: "100 mg/dL", collectedAt: new Date(2023, 5, 1).toISOString() },
  ],
  "9": [
    { value: "Sim", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Não", collectedAt: new Date(2023, 8, 15).toISOString() },
  ],
  "10": [
    { value: "2x/semana", collectedAt: new Date(2023, 11, 5).toISOString() },
    { value: "3x/semana", collectedAt: new Date(2023, 8, 20).toISOString() },
  ],
  "11": [
    { value: "Sim", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Não", collectedAt: new Date(2023, 9, 1).toISOString() },
  ],
  "12": [
    { value: "Regular", collectedAt: new Date(2023, 11, 15).toISOString() },
    { value: "Irregular", collectedAt: new Date(2023, 7, 10).toISOString() },
  ],
};

// Initial groups
export const initialGroups: ParameterGroup[] = [
  { 
    id: "1", 
    name: "Dados gerais",
    isDefault: true,
    parameters: [
      { id: "1", field: "Peso", value: "72 kg", collectedAt: new Date().toISOString() },
      { id: "2", field: "Altura", value: "175 cm", collectedAt: new Date().toISOString() },
      { id: "3", field: "Pressão Arterial", value: "120/80 mmHg", collectedAt: new Date().toISOString() },
      { id: "4", field: "Temperatura", value: "36.5 °C", collectedAt: new Date().toISOString() },
      { id: "5", field: "Frequência Cardíaca", value: "75 bpm", collectedAt: new Date().toISOString() },
      { id: "6", field: "Frequência Respiratória", value: "16 irpm", collectedAt: new Date().toISOString() },
      { id: "7", field: "Saturação O2", value: "98%", collectedAt: new Date().toISOString() },
      { id: "8", field: "Glicemia", value: "95 mg/dL", collectedAt: new Date().toISOString() },
    ] 
  },
  { 
    id: "2", 
    name: "Histórico Familiar",
    isDefault: true,
    parameters: [
      { id: "9", field: "Diabetes na família", value: "Sim", collectedAt: new Date().toISOString() },
    ]
  },
  { 
    id: "3", 
    name: "Estilo de vida",
    isDefault: true,
    parameters: [
      { id: "10", field: "Atividade física", value: "2x/semana", collectedAt: new Date().toISOString() },
      { id: "11", field: "Tabagismo", value: "Não", collectedAt: new Date().toISOString() },
    ]
  },
  { 
    id: "4", 
    name: "Sexual e reprodutivo",
    isDefault: true,
    parameters: [
      { id: "12", field: "Ciclo menstrual", value: "Regular", collectedAt: new Date().toISOString() },
    ]
  },
];
