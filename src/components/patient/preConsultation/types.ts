
export interface ParameterItem {
  id: string;
  field: string;
  value: string;
  collectedAt: string;
}

export interface ParameterHistoryItem {
  value: string;
  collectedAt: string;
}

export interface ParameterGroup {
  id: string;
  name: string;
  isDefault: boolean;
  parameters: ParameterItem[];
}

export type HistoricalDataMap = {
  [key: string]: ParameterHistoryItem[];
};
