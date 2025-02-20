
import React, { useState } from 'react';
import RiskCalculator from '../components/RiskCalculator/RiskCalculator';
import { instruments } from '../data/instruments';
import { exchangeGroups } from '../data/exchanges';
import { CalculatorInstance } from '../components/RiskCalculator/utils';
import { Preset } from '../components/RiskCalculator/types';
import { Moon, Sun, Grid, LayoutGrid, Plus } from 'lucide-react';
import { useTheme } from 'next-themes';

const defaultCalculator: CalculatorInstance = {
  id: String(Date.now()),
  selectedInstrument: instruments[0],
  ticks: 0,
  points: 0,
  riskAmount: 0,
  profitAmount: 0,
  riskRewardRatio: 2,
  selectedExchange: exchangeGroups[0].exchanges[0],
  customFee: 4.50
};

const IndexPage: React.FC = () => {
  const [calculators, setCalculators] = useState<CalculatorInstance[]>([defaultCalculator]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isGridLayout, setIsGridLayout] = useState(false);
  const { theme, setTheme } = useTheme();

  const addCalculator = () => {
    const newCalculator = { ...defaultCalculator, id: String(Date.now()) };
    setCalculators([...calculators, newCalculator]);
  };

  const updateCalculator = (id: string, updates: Partial<CalculatorInstance>) => {
    setCalculators(calculators.map(calc => calc.id === id ? { ...calc, ...updates } : calc));
  };

  const removeCalculator = (id: string) => {
    setCalculators(calculators.filter(calc => calc.id !== id));
  };

  const resetCalculators = () => {
    setCalculators([defaultCalculator]);
  };

  const savePreset = (name: string, isUniversal: boolean) => {
    const calculator = calculators[calculators.length - 1];
    const newPreset: Preset = {
      id: String(Date.now()),
      name,
      instrumentId: isUniversal ? 'universal' : calculator.selectedInstrument.id,
      isUniversal,
      isDefault: false,
      settings: {
        selectedInstrument: calculator.selectedInstrument,
        ticks: calculator.ticks,
        points: calculator.points,
        riskAmount: calculator.riskAmount,
        profitAmount: calculator.profitAmount,
        riskRewardRatio: calculator.riskRewardRatio,
        selectedExchange: calculator.selectedExchange,
        customFee: calculator.customFee
      }
    };
    setPresets(prev => [...prev, newPreset]);
  };

  const updatePreset = (presetId: string, updates: Partial<Preset>) => {
    setPresets(prev =>
      prev.map(preset => (preset.id === presetId ? { ...preset, ...updates } : preset))
    );
  };

  const deletePreset = (presetId: string) => {
    setPresets(prev => prev.filter(preset => preset.id !== presetId));
  };

  const setDefaultPreset = (presetId: string) => {
    setPresets(prev =>
      prev.map(preset => ({
        ...preset,
        isDefault: preset.id === presetId
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span role="img" aria-label="calculator">🧮</span>
            Futures Risk Calculator
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsGridLayout(!isGridLayout)}
              className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isGridLayout ? <LayoutGrid size={20} /> : <Grid size={20} />}
            </button>
            <button
              onClick={addCalculator}
              className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
        <div className={`space-y-6 ${isGridLayout ? 'grid grid-cols-2 gap-6 space-y-0' : ''}`}>
          {calculators.map((calculator) => (
            <RiskCalculator
              key={calculator.id}
              data={calculator}
              onUpdate={updateCalculator}
              onRemove={removeCalculator}
              onReset={resetCalculators}
              presets={presets}
              onSavePreset={savePreset}
              onUpdatePreset={updatePreset}
              onDeletePreset={deletePreset}
              onSetDefaultPreset={setDefaultPreset}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
