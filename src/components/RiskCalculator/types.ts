
import { CalculatorInstance } from "./utils";

export interface Preset {
  id: string;
  name: string;
  isDefault: boolean;
  isUniversal: boolean;
  settings: Omit<CalculatorInstance, 'id'>;
}
