
import { ReactNode } from "react";

export interface Parameter {
  id: string;
  field: string;
  value: string;
  unit: string;
  collectedAt: string;
}

export interface ParameterHistory {
  value: string;
  unit: string;
  collectedAt: string;
}

export interface ParameterGroup {
  id: string;
  name: string;
  isDefault: boolean;
  parameters: Parameter[];
}

export interface NewParameter {
  field: string;
  value: string;
  unit: string;
  collectedAt: string;
}

export type HistoricalDataType = Record<string, ParameterHistory[]>;
