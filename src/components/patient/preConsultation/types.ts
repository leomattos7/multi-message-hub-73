
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

export interface ParameterSubgroup {
  id: string;
  name: string;
  parameters: ParameterItem[];
}

export interface ParameterGroup {
  id: string;
  name: string;
  isDefault: boolean;
  parameters: ParameterItem[];
  subgroups?: ParameterSubgroup[];
}

export type HistoricalDataMap = {
  [key: string]: ParameterHistoryItem[];
};

export interface NewSubgroupData {
  name: string;
}
