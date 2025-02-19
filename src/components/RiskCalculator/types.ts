
import { CalculatorInstance } from "./utils";

export interface Preset {
  id: string;
  name: string;
  instrumentId: string | 'universal';
  isUniversal: boolean;
  isDefault: boolean;
  settings: Omit<CalculatorInstance, 'id'>;
}
