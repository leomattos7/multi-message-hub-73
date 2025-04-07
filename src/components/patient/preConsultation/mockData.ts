
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
    { value: "Não", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "14": [
    { value: "Caminhada, Natação", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Caminhada", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "15": [
    { value: "120", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "90", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "16": [
    { value: "Não", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Sim", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "17": [
    { value: "Sim", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Não", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "18": [
    { value: "Não", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Não", collectedAt: new Date(2023, 9, 5).toISOString() },
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
    { value: "6", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "23": [
    { value: "Sim", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Sim", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "24": [
    { value: "Sim", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Sim", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "25": [
    { value: "Ambos", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Homens", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "26": [
    { value: "Sim", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Não", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "27": [
    { value: "Pílula anticoncepcional", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Preservativo", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "28": [
    { value: "Sim", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Sim", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "29": [
    { value: "Sim", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Não", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "30": [
    { value: "Janeiro 2023", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "31": [
    { value: "15/03/2024", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "20/02/2023", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "32": [
    { value: "Sim", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Sim", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "33": [
    { value: "15/03/2024", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "20/02/2023", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "34": [
    { value: "Janeiro 2024", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Março 2023", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "35": [
    { value: "Sim", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Sim", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "36": [
    { value: "2", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "1", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "37": [
    { value: "Não", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Não", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "38": [
    { value: "1", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "1", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "39": [
    { value: "1", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "0", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "40": [
    { value: "Não", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Não", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "41": [
    { value: "Sim", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "Não", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "42": [
    { value: "Fevereiro 2024", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
  "43": [
    { value: "Não", collectedAt: new Date(2023, 11, 10).toISOString() },
    { value: "", collectedAt: new Date(2023, 9, 5).toISOString() },
  ],
};

// Initial groups with "Estilo de vida" organized into subgroups
export const initialGroups: ParameterGroup[] = [
  { 
    id: "3", 
    name: "Estilo de vida",
    isDefault: true,
    parameters: [],
    subgroups: [
      {
        id: "3-1",
        name: "Atividade Física",
        parameters: [
          { id: "13", field: "Fisicamente ativo?", value: "Sim", collectedAt: new Date().toISOString() },
          { id: "14", field: "Atividades realizadas", value: "Caminhada, Natação", collectedAt: new Date().toISOString() },
          { id: "15", field: "Tempo de atividade física por semana (em minutos)", value: "120", collectedAt: new Date().toISOString() },
        ]
      },
      {
        id: "3-2",
        name: "Uso de Substâncias",
        parameters: [
          { id: "16", field: "Fuma?", value: "Não", collectedAt: new Date().toISOString() },
          { id: "17", field: "Bebe?", value: "Sim", collectedAt: new Date().toISOString() },
          { id: "18", field: "Usa algum tipo de droga?", value: "Não", collectedAt: new Date().toISOString() },
        ]
      },
      {
        id: "3-3",
        name: "Alimentação",
        parameters: [
          { id: "19", field: "Porções de frutas por semana", value: "3", collectedAt: new Date().toISOString() },
          { id: "20", field: "Porções de legumes e verduras por semana", value: "5", collectedAt: new Date().toISOString() },
          { id: "21", field: "Porções de frituras por semana", value: "2", collectedAt: new Date().toISOString() },
          { id: "22", field: "Porções de ultraprocessados por semana", value: "3", collectedAt: new Date().toISOString() },
        ]
      }
    ]
  },
  { 
    id: "4", 
    name: "Sexual e reprodutivo",
    isDefault: true,
    parameters: [],
    subgroups: [
      {
        id: "4-1",
        name: "Vida Sexual",
        parameters: [
          { id: "23", field: "Permite falar sobre vida sexual?", value: "Sim", collectedAt: new Date().toISOString() },
          { id: "24", field: "Iniciou a vida sexual?", value: "Sim", collectedAt: new Date().toISOString() },
          { id: "25", field: "Se sim, faz sexo com:", value: "Ambos", collectedAt: new Date().toISOString() },
        ]
      },
      {
        id: "4-2",
        name: "Métodos Contraceptivos",
        parameters: [
          { id: "26", field: "Você ou sua parceria utilizam algum método contraceptivo?", value: "Sim", collectedAt: new Date().toISOString() },
          { id: "27", field: "Se sim, qual?", value: "Pílula anticoncepcional", collectedAt: new Date().toISOString() },
        ]
      },
      {
        id: "4-3",
        name: "Relações e Exames",
        parameters: [
          { id: "28", field: "Já teve relação de penetração com pênis alguma vez na vida?", value: "Sim", collectedAt: new Date().toISOString() },
          { id: "29", field: "Já fez exames para infecções sexualmente transmissíveis?", value: "Sim", collectedAt: new Date().toISOString() },
          { id: "30", field: "Se sim, quando?", value: "Janeiro 2023", collectedAt: new Date().toISOString() },
        ]
      },
      {
        id: "4-4",
        name: "Menstruação",
        parameters: [
          { id: "31", field: "Quando foi sua última menstruação?", value: "15/03/2024", collectedAt: new Date().toISOString() },
          { id: "32", field: "Você já menstruou?", value: "Sim", collectedAt: new Date().toISOString() },
        ]
      },
      {
        id: "4-5",
        name: "Exames e Gravidez",
        parameters: [
          { id: "34", field: "Quando foi o seu último papanicolau?", value: "Janeiro 2024", collectedAt: new Date().toISOString() },
          { id: "35", field: "Já engravidou?", value: "Sim", collectedAt: new Date().toISOString() },
          { id: "36", field: "Se sim, quantas vezes?", value: "2", collectedAt: new Date().toISOString() },
          { id: "37", field: "Já teve algum aborto?", value: "Não", collectedAt: new Date().toISOString() },
        ]
      },
      {
        id: "4-6",
        name: "Partos",
        parameters: [
          { id: "38", field: "Quantos partos normais você teve?", value: "1", collectedAt: new Date().toISOString() },
          { id: "39", field: "Quantas cesarianas você teve?", value: "1", collectedAt: new Date().toISOString() },
          { id: "40", field: "Teve algum problema na gestação?", value: "Não", collectedAt: new Date().toISOString() },
        ]
      },
      {
        id: "4-7",
        name: "Mamografia",
        parameters: [
          { id: "41", field: "Já fez mamografia?", value: "Sim", collectedAt: new Date().toISOString() },
          { id: "42", field: "Se sim, quando?", value: "Fevereiro 2024", collectedAt: new Date().toISOString() },
          { id: "43", field: "Teve alguma alteração?", value: "Não", collectedAt: new Date().toISOString() },
        ]
      }
    ]
  },
];
