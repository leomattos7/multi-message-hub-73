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
  "13": [
    { value: "Sim", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Não", collectedAt: new Date(2023, 8, 5).toISOString() },
  ],
  "14": [
    { value: "Caminhada, Natação", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Corrida, Musculação", collectedAt: new Date(2023, 9, 15).toISOString() },
  ],
  "15": [
    { value: "150", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "120", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "16": [
    { value: "Não", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Sim", collectedAt: new Date(2023, 8, 15).toISOString() },
  ],
  "17": [
    { value: "Sim", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Não", collectedAt: new Date(2023, 8, 15).toISOString() },
  ],
  "18": [
    { value: "Não", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Sim", collectedAt: new Date(2023, 6, 20).toISOString() },
  ],
  "19": [
    { value: "3", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "2", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "20": [
    { value: "5", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "3", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "21": [
    { value: "2", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "4", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "22": [
    { value: "3", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "5", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
};

// Initial groups - only keeping "Estilo de vida" and "Sexual e reprodutivo"
export const initialGroups: ParameterGroup[] = [
  { 
    id: "3", 
    name: "Estilo de vida",
    isDefault: true,
    parameters: [
      { id: "13", field: "Fisicamente ativo?", value: "Sim", collectedAt: new Date().toISOString() },
      { id: "14", field: "Atividades realizadas", value: "Caminhada, Natação", collectedAt: new Date().toISOString() },
      { id: "15", field: "Tempo de atividade física por semana (em minutos)", value: "150", collectedAt: new Date().toISOString() },

      { id: "16", field: "Fuma?", value: "Não", collectedAt: new Date().toISOString() },
      { id: "17", field: "Bebe?", value: "Sim", collectedAt: new Date().toISOString() },
      { id: "18", field: "Usa algum tipo de droga?", value: "Não", collectedAt: new Date().toISOString() },

      { id: "19", field: "Porções de frutas por semana", value: "3", collectedAt: new Date().toISOString() },
      { id: "20", field: "Porções de legumes e verduras por semana", value: "5", collectedAt: new Date().toISOString() },
      { id: "21", field: "Porções de frituras por semana", value: "2", collectedAt: new Date().toISOString() },
      { id: "22", field: "Porções de ultraprocessados por semana", value: "3", collectedAt: new Date().toISOString() },
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
